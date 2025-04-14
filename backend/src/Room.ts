import { Server, Socket } from "socket.io";
import { v4 as uuid } from "uuid";
import {
  ClientToServerEvents,
  PlayerState,
  ServerToClientEvents,
} from "./types";

export class Room {
  public id: string;
  public host: Socket;
  public name: string;
  private musicId: string | null;
  public currrentState: PlayerState;
  private members: Set<string>;
  private io: Server<ClientToServerEvents, ServerToClientEvents>;

  constructor(host: Socket, name: string, io: Server) {
    this.id = uuid();
    this.host = host;
    this.name = name;
    this.members = new Set();
    this.musicId = null;
    this.io = io;
    this.currrentState = PlayerState.PAUSED;
    //Adding the host to the members list.
    this.joinRoom(host);
  }

  changeMusic(musicId: string) {
    this.musicId = musicId;
    this.io.to(this.id).emit("musicChanged", musicId);
  }

  joinRoom(member: Socket) {
    if (this.members.has(member.id)) {
      console.log("member already exists");
      return;
    }
    this.members.add(member.id);
    member.join(this.id);
  }

  leaveRoom(member: Socket) {
    this.members.delete(member.id);
    member.leave(this.id);
  }
}
