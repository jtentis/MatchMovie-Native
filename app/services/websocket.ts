import { URL_LOCALHOST } from '@/constants/Url';
import { io, Socket } from 'socket.io-client';

let socket: Socket | any = null;

export const connectWebSocket = (userId: any): Socket => {
  if (!socket) {
    socket = io(URL_LOCALHOST);

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket?.id);
      socket?.emit('joinRoom', `user_${userId}`);
    });

    socket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected.');
    });
  }

  return socket;
};

export const onGroupUpdate = (callback: (data: any) => void): void => {
  if (!socket) {
    console.error('WebSocket connection is not established.');
    return;
  }

  socket.on('groupUpdated', (data: any) => {
    console.log('Group updated event received:', data);
    callback(data);
  });
};

export const disconnectWebSocket = (forceDisconnect = true): void => {
  if (socket && forceDisconnect) {
    socket.disconnect();
    console.log('WebSocket disconnected.');
    socket = null;
  } else {
    console.log('WebSocket connection preserved.', socket?.id);
  }
};

export const onGroupCreated = (callback: (group: any) => void): void => {
  if (!socket) {
      console.error('WebSocket connection is not established.');
      return;
  }

  socket.on('groupCreated', (group: any) => {
      console.log('New group created:', group);
      callback(group);
  });
};
