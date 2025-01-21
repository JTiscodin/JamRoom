"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerState = exports.ServerEvents = void 0;
var ServerEvents;
(function (ServerEvents) {
    ServerEvents["PLAYERSTATEUPDATE"] = "state-update";
    ServerEvents["MUSICCHANGE"] = "music-change";
})(ServerEvents || (exports.ServerEvents = ServerEvents = {}));
var PlayerState;
(function (PlayerState) {
    PlayerState[PlayerState["PLAYING"] = 0] = "PLAYING";
    PlayerState[PlayerState["PAUSED"] = 1] = "PAUSED";
})(PlayerState || (exports.PlayerState = PlayerState = {}));
