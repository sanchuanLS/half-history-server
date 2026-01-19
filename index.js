
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { KeepLiveWS } = require('bilibili-live-ws');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from Vercel
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3001;

// Map socket.id -> Bilibili Connection
const connections = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', (roomId) => {
    // 1. Close existing connection if any
    if (connections.has(socket.id)) {
      connections.get(socket.id).close();
      connections.delete(socket.id);
    }

    try {
      const room = parseInt(roomId);
      if (isNaN(room)) {
        socket.emit('status', { success: false, message: "Invalid Room ID" });
        return;
      }

      console.log(`Socket ${socket.id} joining room ${room}`);
      
      // 2. Create Bilibili Connection
      const live = new KeepLiveWS(room);
      connections.set(socket.id, live);

      live.on('open', () => {
        socket.emit('status', { success: true, message: "Connected to Bilibili" });
        console.log(`Bilibili connected for ${socket.id}`);
      });

      live.on('live', () => {
        socket.emit('status', { success: true, message: "Live Started" });
      });

      live.on('close', () => {
        socket.emit('status', { success: false, message: "Connection Closed" });
      });

      live.on('error', (e) => {
        console.error(`Error for ${socket.id}:`, e);
        // Don't emit error to client to avoid spam, maybe just reconnect logic handled by lib
      });

      // 3. Forward Events
      live.on('danmaku', (data) => {
        socket.emit('bilibili-event', {
          type: 'chat',
          user: data.info[2][1],
          text: data.info[1]
        });
      });

      live.on('gift', (data) => {
        socket.emit('bilibili-event', {
          type: 'gift',
          user: data.data.uname,
          giftName: data.data.giftName,
          amount: data.data.num
        });
      });

      live.on('guard', (data) => {
        socket.emit('bilibili-event', {
          type: 'guard',
          user: data.data.username,
          giftName: 'Guard',
          text: `Became a Guard (Level ${data.data.guard_level})`
        });
      });

    } catch (e) {
      console.error(e);
      socket.emit('status', { success: false, message: "Server Error: " + e.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    if (connections.has(socket.id)) {
      connections.get(socket.id).close();
      connections.delete(socket.id);
    }
  });
});

app.get('/', (req, res) => {
  res.send('Half History Relay Server is Running');
});

server.listen(PORT, () => {
  console.log(`Relay server listening on port ${PORT}`);
});