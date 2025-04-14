import { ClientToServerEvents, ServerToClientEvents } from "@/lib/types";
import React, { useEffect, useMemo } from "react";

import { io } from "socket.io-client";

import { Socket } from "socket.io-client";

const SocketContext = React.createContext<Socket<
  ServerToClientEvents,
  ClientToServerEvents
> | null>(null);

interface SocketContextProviderProps {
  children: React.ReactNode;
}

export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({
  children,
}) => {
  const [socket, setSocket] = React.useState<Socket | null>(null);

  useEffect(() => {
    // const socketInstance = io('http://localhost:3000');
    const socketInstance = io('http://192.168.4.185:3000');
     
    socketInstance.on('connect', () => {
      console.log('Socket connected successfully', socketInstance.id);
    });
    
    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    setSocket(socketInstance);
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export const useSocket = () => {
  return React.useContext(SocketContext);
};
