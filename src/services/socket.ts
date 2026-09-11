import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    // In browser, connect to current origin (same host & port 3000)
    socket = io(typeof window !== 'undefined' ? window.location.origin : '', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });
  }
  return socket;
};

export const joinOrderRoom = (orderId: string) => {
  const s = getSocket();
  s.emit('join_order', orderId);
};

export const leaveOrderRoom = (orderId: string) => {
  const s = getSocket();
  s.emit('leave_order', orderId);
};

export const sendLiveLocation = (data: {
  orderId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
}) => {
  const s = getSocket();
  s.emit('send_location', data);
};
