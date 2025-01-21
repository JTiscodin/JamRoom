export interface ServerToClientEvents {
  changeMusic: (musicTitle: string) => void;
  roomCreated : (callback : () => void) => void;
}

export interface ClientToServerEvents {
  createRoom: (roomName: string) => void;
  joinRoom: (roomName: string) => void;
}
