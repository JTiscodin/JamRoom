import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  PlayerState,
  ServerEvents,
  ServerToClientEvents,
} from "./types";

export class Room {
  public host: Socket;
  public name: string;
  private musicTitle: string | null;
  public currrentState: PlayerState;
  private members: Set<string>;
  private io: Server<ClientToServerEvents, ServerToClientEvents>;

  constructor(host: Socket, name: string, io: Server) {
    this.host = host;
    this.name = name;
    this.members = new Set();
    this.musicTitle = null;
    this.io = io;
    this.currrentState = PlayerState.PAUSED;
    //Adding the host to the members list.
    this.joinRoom(host);
  }

  changeMusic(musicTitle: string) {
    this.musicTitle = musicTitle;
    this.io.to(this.name).emit("changeMusic", musicTitle);
  }

  joinRoom(member: Socket) {
    if (this.members.has(member.id)) {
      console.log("member already exists");
      return;
    }
    this.members.add(member.id);
    member.join(this.name);
  }

  leaveRoom(member: Socket) {
    if (this.members.has(member.id)) {
      this.members.delete(member.id);
      member.leave(this.name);
    } else {
      console.log("No such member found");
    }
  }
}
