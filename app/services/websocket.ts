import { URL_LOCALHOST } from '@/constants/Url';
import { io, Socket } from 'socket.io-client';

let socket: Socket | any = null;

export const connectWebSocket = (userId: any): Socket => {
  if (!socket) {
    console.log('Initializing WebSocket connection...');
    socket = io(URL_LOCALHOST);

    socket.on('connect', () => {
      console.log('WebSocket connected:', socket?.id);
      socket.emit('joinRoom', `user_${userId}`);
    });

    socket.on('connect_error', (error: any) => {
      console.error('WebSocket connection error:', error);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected.');
    });
  } else if (!socket.connected) {
    console.log('Reconnecting WebSocket...');
    socket.connect();
  }

  return socket;
};

export const onGroupUpdate = (callback: (data: any) => void): void => {
  if (!socket) {
    console.error('WebSocket connection is not established. onGroupUpdate');
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

export const onGroupDeleted = (callback: (data: { groupId: number; message: string }) => void): void => {
  if (socket) {
    socket.on("groupDeleted", callback);
  } else {
    console.error("WebSocket connection is not established. groupDeleted");
  }
};

export const onGroupCreated = (callback: (group: any) => void): void => {
  if (!socket) {
    console.error('WebSocket connection is not established. onGroupCreated');
    return;
  }

  socket.on('groupCreated', (group: any) => {
    console.log('New group created:', group);
    callback(group);
  });
};

export const onWinnerReceived = (callback: (winnerData: any) => void): void => {
  if (socket) {
    socket.on('gameWinner', callback);
  } else {
    console.error('WebSocket connection is not established. onWinnerReceived');
  }
};

export const joinGroupRoom = (groupId: number): void => {
  if (socket) {
    socket.emit('joinGroupRoom', groupId);
    console.log(`Joined group room: group_${groupId}`);
  } else {
    console.error('WebSocket connection is not established. joinGroupRoom');
  }
};

export const leaveGroupRoom = (groupId: number, retryCount = 0): void => {
  if (socket && socket.connected) {
    socket.emit('leaveGroupRoom', groupId);
    console.log(`Left group room: group_${groupId}`);
  }
};
