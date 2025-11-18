// src/services/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_API_URL?.trim() || "https://unmaterial-ardis-hereditary.ngrok-free.dev";

console.log("🔗 Conectando a socket:", SOCKET_URL);

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 999,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  forceNew: true,
  path: "/socket.io/",
  autoConnect: false
});

socket.on("connect", () => {
  console.log("✅ SOCKET CONNECTED:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("⚠️ SOCKET CONNECT_ERROR:", err);
});

export default socket;
