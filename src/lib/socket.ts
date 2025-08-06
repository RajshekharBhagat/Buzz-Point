import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = () => {
  if (!socket) {
    socket = io('https://buzz-point-socket-server.onrender.com', {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  socket.on("connect", () => {
    console.log("Connected to socket server: ", socket?.id);
  });
  socket.on("disconnect", () => {
    console.log("Disconnected to the socket server");
  });
  return socket
};


export const getSocket = () => {
    if(!socket) {
        throw new Error("Socket is not initialized. Call the initSocket() first");
    }
    return socket;
}