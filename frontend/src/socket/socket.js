import { io } from "socket.io-client";
import { BASE_URL } from "../config/api.js";


export const socket = io(BASE_URL, {
  withCredentials: true,
  transports: ["websocket"],
});