import { io } from "socket.io-client";
import { base_URL } from "../utills/baseUrl";


export const socket = io(base_URL , {
  transports: ["websocket"],
});
