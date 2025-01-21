interface playerStateUpdateMessage {
  type: ServerEvents.PLAYERSTATEUPDATE;
  state: PlayerState;
}

export interface ServerToClientEvents {
  changeMusic: (musicTitle: string) => void;
}

export interface ClientToServerEvents {
  createRoom: (roomName: string) => void;
  joinRoom: (roomName: string) => void;
}

interface songChange {
  type: ServerEvents.MUSICCHANGE;
  music: string;
}

export type ServerMessages = playerStateUpdateMessage | songChange;

export enum ServerEvents {
  PLAYERSTATEUPDATE = "state-update",
  MUSICCHANGE = "music-change",
}

export enum PlayerState {
  PLAYING,
  PAUSED,
}
