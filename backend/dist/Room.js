"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const types_1 = require("./types");
class Room {
    constructor(host, name, io) {
        this.host = host;
        this.name = name;
        this.members = new Set();
        this.musicTitle = null;
        this.io = io;
        this.currrentState = types_1.PlayerState.PAUSED;
        //Adding the host to the members list.
        this.joinRoom(host);
    }
    changeMusic(musicTitle) {
        this.musicTitle = musicTitle;
        this.io.to(this.name).emit("changeMusic", musicTitle);
    }
    joinRoom(member) {
        if (this.members.has(member.id)) {
            console.log("member already exists");
            return;
        }
        this.members.add(member.id);
        member.join(this.name);
    }
    leaveRoom(member) {
        if (this.members.has(member.id)) {
            this.members.delete(member.id);
            member.leave(this.name);
        }
        else {
            console.log("No such member found");
        }
    }
}
exports.Room = Room;
