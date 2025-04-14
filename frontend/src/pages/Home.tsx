import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRoomManager } from "@/providers/RoomManager";

const Home = () => {
  const { handleCreateRoom, handleJoinRoom, loading } = useRoomManager();
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId") || undefined;

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-slate-950 p-4">
      <div className="w-full max-w-md bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800/50 rounded-xl shadow-xl p-8 backdrop-blur-sm">
        <div className="space-y-6">
          {/* Header with gradient text */}
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              {!roomId ? "Create Room" : "Join Room"}
            </h1>
            <p className="text-slate-400 mt-2">
              Start a new listening session with friends
            </p>
          </div>

          {/* Form inputs with consistent styling */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm text-slate-400 block"
              >
                Username
              </label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-900/70 border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-500"
              />
            </div>

            {!roomId && (
              <div className="space-y-2">
                <label
                  htmlFor="roomname"
                  className="text-sm text-slate-400 block"
                >
                  Room Name
                </label>
                <Input
                  id="roomname"
                  placeholder="Name your room"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="bg-slate-900/70 border-slate-800 focus:border-indigo-500 text-white placeholder:text-slate-500"
                />
              </div>
            )}
          </div>

          {/* Create button with same gradient as play button */}
          <Button
            onClick={
              !roomId
                ? () => handleCreateRoom(roomName)
                : () => handleJoinRoom(roomId)
            }
            disabled={!username || (!roomId && !roomName) || loading}
            className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white duration-200 transition-all font-medium rounded-lg  hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "loading" : !roomId ? "Create Room" : "Join Room"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
