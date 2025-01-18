import { URL_LOCALHOST } from '@/constants/Url';
import { io, Socket } from 'socket.io-client';

let socket: Socket | any = null;

export const connectWebSocket = (userId: any): void => {
    if (!socket) {
      socket = io(URL_LOCALHOST); // Replace with your actual server URL
  
      socket.on('connect', () => {
        console.log('WebSocket connected:', socket.id); // Log the socket ID after connection
        socket.emit('joinRoom', `user_${userId}`); // Emit the correct room name
      });
  
      socket.on('connect_error', (error:any) => {
        console.error('WebSocket connection error:', error);
      });
    }
  };
  

export const onGroupUpdate = (callback: (data: any) => void): void => {
  if (socket) {
    socket.on('groupUpdated', callback);
  } else {
    console.error('WebSocket connection is not established.');
  }
};

export const disconnectWebSocket = (): void => {
  if (socket) {
    socket.disconnect();
    console.log('WebSocket disconnected.');
    socket = null;
  }
};
