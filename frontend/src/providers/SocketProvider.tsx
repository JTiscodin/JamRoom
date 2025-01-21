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
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = useMemo(
    () => io("localhost:3000"),
    []
  );
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export const useSocket = () => {
  return React.useContext(SocketContext);
};
