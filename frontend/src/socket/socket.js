import { io } from "socket.io-client";
import { base_URL } from "../utills/baseUrl";

export const socket = io(base_URL, {
  transports: ["websocket"],
  reconnection: true,             // ✅ Auto-reconnect on
  reconnectionAttempts: Infinity, // ✅ Kabhi nahi rukega reconnect try karna
  reconnectionDelay: 1000,        // ✅ 1 second mein try karega
});
