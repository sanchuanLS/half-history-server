{
  "name": "god-simulator-box",
  "productName": "HALF HISTORY",
  "version": "1.0.0",
  "main": "electron.js",
  "description": "A cellular automata sandbox game.",
  "author": "sanchuanLS",
  "license": "MIT",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "electron:start": "npm run build && electron .",
    "dist": "npm run build && electron-builder"
  },
  "dependencies": {
    "lucide-react": "^0.300.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.160.0",
    "peerjs": "^1.5.2",
    "ws": "^8.16.0",
    "bilibili-live-ws": "^5.2.0",
    "socket.io-client": "^4.7.4",
    "@google/genai": "latest"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/three": "^0.160.0",
    "@vitejs/plugin-react": "^4.2.0",
    "electron": "^28.0.0",
    "electron-builder": "^24.9.0",
    "typescript": "^5.2.0",
    "vite": "^5.0.0"
  },
  "build": {
    "appId": "com.sanchuanls.godsim",
    "productName": "HALF HISTORY",
    "asar": true,
    "asarUnpack": [
      "**/*.node"
    ],
    "directories": {
      "output": "dist-electron"
    },
    "files": [
      "dist/**/*",
      "electron.js",
      "package.json",
      "icon.png"
    ],
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        },
        {
          "target": "dir",
          "arch": ["x64"]
        }
      ],
      "icon": "icon.png"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    },
    "mac": {
      "target": "dmg",
      "icon": "icon.png",
      "category": "public.app-category.simulation-games",
      "hardenedRuntime": true,
      "gatekeeperAssess": false
    },
    "dmg": {
      "title": "${productName} Installer",
      "contents": [
        {
          "x": 130,
          "y": 220
        },
        {
          "x": 410,
          "y": 220,
          "type": "link",
          "path": "/Applications"
        }
      ]
    }
  }
}
