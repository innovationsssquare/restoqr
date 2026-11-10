import { io } from "socket.io-client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8081`
    : "http://localhost:8081");

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("[Socket.io] Connected to RestoQR server with ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("[Socket.io] Disconnected from RestoQR server");
    });
  }

  return socket;
};

