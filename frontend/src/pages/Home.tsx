import { useCallback, useEffect, useRef } from "react";
import { useSocket } from "../providers/SocketProvider";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleRoomJoined = useCallback((msg: string) => {
    console.log(msg);
    fetch("http://localhost:3000/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch audio");
        }
        return response.blob();
      })
      .then((blob) => {
        const audioUrl = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play().catch((err) => {
            console.error("Autoplay failed:", err);
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching audio:", error);
      });
  }, []);

  const handleRoomCreated = useCallback(() => {
    navigate("/listentogether")
}, [navigate])

  useEffect(() => {
    if (!socket) return;
    // Set up the socket listener once

    socket.on("roomCreated", handleRoomCreated);

    return () => {
      // Cleanup the listener to avoid duplicates
      socket.off("roomCreated");
    };
  }, [socket, handleRoomJoined]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Create Room</CardTitle>
          <CardContent className="flex flex-col gap-3">
            <Input placeholder="Username" />
            <Input placeholder="Room Name" />
            <Button>Create Room</Button>
          </CardContent>
        </CardHeader>
      </Card>
      {/* Attach the ref to the audio element */}
      <audio ref={audioRef} controls></audio>
    </div>
  );
};

export default Home;
