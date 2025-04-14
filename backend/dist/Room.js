"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const uuid_1 = require("uuid");
const types_1 = require("./types");
class Room {
    constructor(host, name, io) {
        this.id = (0, uuid_1.v4)();
        this.host = host;
        this.name = name;
        this.members = new Set();
        this.musicId = null;
        this.io = io;
        this.currrentState = types_1.PlayerState.PAUSED;
        //Adding the host to the members list.
        this.joinRoom(host);
    }
    changeMusic(musicId) {
        this.musicId = musicId;
        this.io.to(this.id).emit("musicChanged", musicId);
    }
    joinRoom(member) {
        if (this.members.has(member.id)) {
            console.log("member already exists");
            return;
        }
        this.members.add(member.id);
        member.join(this.id);
    }
    leaveRoom(member) {
        this.members.delete(member.id);
        member.leave(this.id);
    }
}
exports.Room = Room;
