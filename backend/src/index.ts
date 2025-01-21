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
  socket.on("createRoom", (roomName) => {
    const room = new Room(socket, roomName, io);
    Rooms.set(roomName, room);
  });

  socket.on("disconnect", () => {
    console.log("disconnected " + socket.id);
  });
});

app.use(express.static("assets"));

app.get("/", async (req, res) => {
  let { songid } = req.query;

  try {
    if (songid === "1") {
      // Google Drive file
      const fileId = "1pjxXcag5rvGxxBlCiMz42TjuFJICo5nT";

      // Get file metadata
      const file = await drive.files.get({
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

        const stream = await drive.files.get(
          {
            fileId: fileId,
            alt: "media",
            headers: {
              Range: `bytes=${start}-${end}`,
            },
          },
          {
            responseType: "stream",
          }
        );

        stream.data.pipe(res);
      } else {
        res.writeHead(200, {
          "Content-Length": fileSize,
          "Content-Type": "audio/mpeg",
        });

        const stream = await drive.files.get(
          {
            fileId: fileId,
            alt: "media",
          },
          {
            responseType: "stream",
          }
        );

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
