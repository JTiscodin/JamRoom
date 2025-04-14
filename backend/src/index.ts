import express from "express";
import fs from "fs";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";
import { Room } from "./Room";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
import { google } from "googleapis";

const app = express();

app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

// Set up Google Drive API
const auth = new google.auth.GoogleAuth({
  keyFile: "./config/listen-together.json",
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
});

const drive = google.drive({ version: "v3", auth });

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const Rooms = new Map<string, Room>();

io.on("connection", (socket) => {
  console.log(socket.id, "connected");

  socket.on("createRoom", roomName => {
    console.log("recieved createRoom request: ", roomName);
    const room = new Room(socket, roomName, io);
    Rooms.set(room.id, room);
    socket.emit("roomCreated", room.id);
  });

  socket.on("joinRoom", (roomId : string) => {
    const room = Rooms.get(roomId);
    if (room) {
      room.joinRoom(socket);
      socket.emit("roomJoined", room.name);
    } else {
      socket.emit("error", "Room not found");
    }
  });

  socket.on("changeMusic", (musicId) => {
    const room = Rooms.get(Array.from(socket.rooms)[1]);
    if (room && room.host.id === socket.id) {
      console.log("changing music in room", room.id, "to", musicId);
      room.changeMusic(musicId);
    }
  })

  socket.on("disconnect", () => {
    console.log("disconnected " + socket.id);
  });
});

app.get("/list-files", async (req, res) => {
  try {
    const response = await drive.files.list({
      q: "'1SOpU6NL8ihWPqD0KIyIGxqa0YWP2_dwt' in parents and trashed = false",
      fields: "files(id, name, mimeType)",
      spaces: "drive",
    });

    const files = response.data.files;

    if (!files || files.length === 0) {
      return res.status(404).send("No files found.");
    }

    res.status(200).json(files);
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).send("Failed to list files");
  }
});

app.get("/", async (req, res) => {
  let { songId } = req.query;

  try {
    if (songId) {
      // Get file metadata
      const file = await drive.files.get({
        fileId: songId as string,
        fields: "size",
      });

      const fileSize = Number(file.data.size);
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = end - start + 1;
        console.log("range requested", start, end, chunksize);
        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "audio/mpeg",
        });

        const stream = await drive.files.get(
          {
            fileId: songId as string,
            alt: "media",
          },
          {
            responseType: "stream",
            headers: {
              Range: `bytes=${start}-${end}`,
            },
          }
        );

        if (stream && "data" in stream) {
          stream.data.pipe(res);
        } else {
          throw new Error("Invalid stream response");
        }
      } else {
        res.writeHead(200, {
          "Content-Length": fileSize,
          "Content-Type": "audio/mpeg",
        });

        const stream = await drive.files.get(
          {
            fileId: songId as string,
            alt: "media",
          },
          {
            responseType: "stream",
          }
        );

        if (stream && "data" in stream) {
          stream.data.pipe(res);
        } else {
          throw new Error("Invalid stream response");
        }

        stream.data.pipe(res);
      }
    } else {
      // Local file handling
      const music = "./assets/sounds/cyhtm.mp3";
      const stat = fs.statSync(music);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (
          isNaN(start) ||
          isNaN(end) ||
          start < 0 ||
          end >= fileSize ||
          start > end
        ) {
          res.status(416).send("Requested range not satisfiable");
          return;
        }

        const chunkSize = end - start + 1;
        const file = fs.createReadStream(music, { start, end });
        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": "audio/mpeg",
        });
        file.pipe(res);
      } else {
        res.writeHead(200, {
          "Content-Length": fileSize,
          "Content-Type": "audio/mpeg",
        });
        fs.createReadStream(music).pipe(res);
      }
    }
  } catch (error) {
    console.error("Error streaming file:", error);
    res.status(500).send("Error streaming file");
  }
});

httpServer.listen(3000, () => {
  console.log("Server started on port 3000");
});
