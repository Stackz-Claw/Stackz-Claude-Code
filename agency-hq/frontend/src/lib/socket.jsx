import { io } from 'socket.io-client';
import { createContext, useContext, useEffect, useState } from 'react';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,
});

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [lastPing, setLastPing] = useState(null);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      setConnected(true);
      setLastPing(new Date());
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
    });

    // Listen for ping from server to track latency
    socket.on('pong', () => {
      setLastPing(new Date());
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, lastPing }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

// Helper to subscribe to socket events with automatic cleanup
export function useSocketEvent(event, callback) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  }, [socket, event, callback]);
}