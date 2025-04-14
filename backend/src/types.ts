interface playerStateUpdateMessage {
  type: ServerEvents.PLAYERSTATEUPDATE;
  state: PlayerState;
}

export interface ServerToClientEvents {
  musicChanged: (musicId: string) => void;
  error: (message: string) => void;
  playerStateUpdate: (message: playerStateUpdateMessage) => void;
  roomCreated: (roomId: string) => void;
  roomJoined: (roomId: string) => void;
}

export interface ClientToServerEvents {
  createRoom: (roomName: string) => void;
  joinRoom: (roomId: string) => void;
  updatePlayerState: (state: PlayerState) => void;
  changeMusic : (musicId : string) => void;
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
