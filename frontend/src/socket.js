import { io } from "socket.io-client";

// Same origin the REST API (api.js) talks to.
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});