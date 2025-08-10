import { io, Socket } from "socket.io-client";
let socket: Socket | null = null;

export function initSocket(token?: string) {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string , {
      auth: {
        token: token
      }
    });
  }
  return socket;
}

export function getSocket() {
  return socket;
}