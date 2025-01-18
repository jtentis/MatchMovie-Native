import React, { useEffect } from 'react';
import { connectWebSocket, disconnectWebSocket, onGroupUpdate } from './websocket';

const Dashboard = ({ userId }: { userId: number }) => {
  useEffect(() => {
    // Connect to WebSocket when the component mounts
    connectWebSocket(userId);

    // Listen for group updates
    onGroupUpdate((data) => {
      console.log('Group Update:', data.message);
      // Optionally update your state or UI here
    });

    // Disconnect WebSocket when the component unmounts
    return () => {
      disconnectWebSocket();
    };
  }, [userId]);

  return <></>; // Your component JSX goes here
};

export default Dashboard;