// src/services/socket.js
import { io } from "socket.io-client";
import { API_URL } from "./api";

// Ajusta API_URL en env si es necesario
const SOCKET_URL = API_URL || (process.env.REACT_APP_API_URL || window.location.origin);

// Opciones: websocket preferido, reintentos
const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  auth: {}, // si necesitaras token, aquí
});

export default socket;
