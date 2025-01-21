"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const Room_1 = require("./Room");
const googleapis_1 = require("googleapis");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const httpServer = (0, http_1.createServer)(app);
// Set up Google Drive API
const auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: "./config/listen-together.json",
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});
const drive = googleapis_1.google.drive({ version: "v3", auth });
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const Rooms = new Map();
io.on("connection", (socket) => {
    console.log(socket.id, "connected");
    socket.on("createRoom", (roomName) => {
        const room = new Room_1.Room(socket, roomName, io);
        Rooms.set(roomName, room);
    });
    socket.on("disconnect", () => {
        console.log("disconnected " + socket.id);
    });
});
app.use(express_1.default.static("assets"));
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { songid } = req.query;
    try {
        if (songid === "1") {
            // Google Drive file
            const fileId = "1pjxXcag5rvGxxBlCiMz42TjuFJICo5nT";
            // Get file metadata
            const file = yield drive.files.get({
                fileId: fileId,
                fields: "size",
            });
            const fileSize = Number(file.data.size);
            const range = req.headers.range;
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = end - start + 1;
                res.writeHead(206, {
                    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": chunksize,
                    "Content-Type": "audio/mpeg",
                });
                const stream = yield drive.files.get({
                    fileId: fileId,
                    alt: "media",
                    headers: {
                        Range: `bytes=${start}-${end}`,
                    },
                }, {
                    responseType: "stream",
                });
                stream.data.pipe(res);
            }
            else {
                res.writeHead(200, {
                    "Content-Length": fileSize,
                    "Content-Type": "audio/mpeg",
                });
                const stream = yield drive.files.get({
                    fileId: fileId,
                    alt: "media",
                }, {
                    responseType: "stream",
                });
                stream.data.pipe(res);
            }
        }
        else {
            // Local file handling
            const music = "./assets/sounds/cyhtm.mp3";
            const stat = fs_1.default.statSync(music);
            const fileSize = stat.size;
            const range = req.headers.range;
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                if (isNaN(start) ||
                    isNaN(end) ||
                    start < 0 ||
                    end >= fileSize ||
                    start > end) {
                    res.status(416).send("Requested range not satisfiable");
                    return;
                }
                const chunkSize = end - start + 1;
                const file = fs_1.default.createReadStream(music, { start, end });
                res.writeHead(206, {
                    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": chunkSize,
                    "Content-Type": "audio/mpeg",
                });
                file.pipe(res);
            }
            else {
                res.writeHead(200, {
                    "Content-Length": fileSize,
                    "Content-Type": "audio/mpeg",
                });
                fs_1.default.createReadStream(music).pipe(res);
            }
        }
    }
    catch (error) {
        console.error("Error streaming file:", error);
        res.status(500).send("Error streaming file");
    }
}));
httpServer.listen(3000, () => {
    console.log("Server started on port 3000");
});
