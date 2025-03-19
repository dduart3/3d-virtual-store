import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAtom } from 'jotai';
import { useAuth } from '../../../auth/hooks/useAuth';
import { avatarUrlAtom } from '../../avatar/state/avatar';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  userCount: number;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  userCount: 0,
  reconnect: () => {}
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { profile } = useAuth();
  const [avatarUrl] = useAtom(avatarUrlAtom);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);
  
  const connectSocket = () => {
    if (!profile || socketRef.current) return;
    
    const SOCKET_URL = import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:3001';
    
    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      auth: {
        userId: profile.id,
        username: profile?.username || 'Usuario',
        avatarUrl: avatarUrl || 'https://readyplayerme-assets.s3.amazonaws.com/animations/visage/male.glb'
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });
    
    // Set up event handlers
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });
    
    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setIsConnected(false);
    });
    
    newSocket.on('users:count', (count: number) => {
      setUserCount(count);
    });
    
    // Store socket in ref and state
    socketRef.current = newSocket;
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    };
  };
  
  // Connect when user is available
  useEffect(() => {
    if (profile && !socketRef.current) {
      const cleanup = connectSocket();
      return cleanup;
    }
  }, [profile, avatarUrl]);
  
  // Reconnect function
  const reconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
    }
    connectSocket();
  };
  
  return (
    <SocketContext.Provider value={{ socket, isConnected, userCount, reconnect }}>
      {children}
    </SocketContext.Provider>
  );
};