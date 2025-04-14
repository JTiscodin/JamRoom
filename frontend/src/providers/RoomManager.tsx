import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSocket } from "./SocketProvider";
import { useNavigate } from "react-router-dom";

interface PlayerContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  changeMusic: (musicId: string) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  roomName: string;
  isHost: boolean;
  handleSliderChange: (newValue: number[]) => void;
  handleVolumeChange: (newValue: number[]) => void;
  togglePlayPause: () => void;
  handleCreateRoom: (roomName: string) => void;
  handleJoinRoom: (roomId: string) => void;
}

const RoomContext = createContext<PlayerContextType | null>(null);

export const RoomManagerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [roomName, setRoomName] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState<number>(100);
  const socket = useSocket();
  console.log(socket) 

  useEffect(() => {
    audioRef.current.volume = volume / 100;

    // Set up event listeners
    audioRef.current.addEventListener("loadedmetadata", () => {
      setDuration(audioRef.current!.duration);
    });

    audioRef.current.addEventListener("timeupdate", () => {
      setCurrentTime(audioRef.current!.currentTime);
      // TODO: Whenver the host changes the song, the current time should be sent from here
    });

    audioRef.current.addEventListener("volumechange", () => {
      setVolume(Math.round(audioRef.current!.volume * 100));
    });

    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Playback failed:", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (newValue: number[]) => {
    if (!audioRef.current) return;

    const time = newValue[0];
    console.log(time);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (newValue: number[]) => {
    if (!audioRef.current) return;

    setVolume(newValue[0]);
    audioRef.current.volume = newValue[0] / 100;
  };

  const changeMusic = (musicId: string) => {
    if (!socket) return;
    setLoading(true);
    socket.emit("changeMusic", musicId);
  };

  const handleCreateRoom = (roomName: string) => {
    if (!socket) return;
    console.log(socket);
    setLoading(true);
    socket.emit("createRoom", roomName);
    setIsHost(true);
    setRoomName(roomName);
  };

  const handleJoinRoom = (roomId: string) => {
    if (!socket) return;
    socket.emit("joinRoom", roomId);
    setIsHost(false);
  };

  useEffect(() => {
    if (!socket) return;
    
    // Define event handlers
    const handleMusicChanged = (musicId: string) => {
      if (audioRef.current) {
        // audioRef.current.src = `http://localhost:3000/?songId=${musicId}`;
        audioRef.current.src = `http://192.168.4.185:3000/?songId=${musicId}`;
        audioRef.current.play().catch(err => {
          console.error("Playback failed:", err);
        });
        setIsPlaying(true);
      }
    };
  
    const handleRoomCreated = (roomId: string) => {
      console.log("Room created with ID:", roomId);
      setLoading(false);
      setRoomName(roomId);
      navigate("/listentogether?roomId=" + roomId);
    };
  
    const handleRoomJoined = (roomId: string) => {
      console.log("Joined room with ID:", roomId);
      setLoading(false);
      setRoomName(roomId);
      navigate("/listentogether?roomId=" + roomId);
    };
  
    const handleError = (errorMsg: string) => {
      console.error("Socket error:", errorMsg);
      setLoading(false);
      // You might want to display this error to the user
    };
  
    socket.on("musicChanged", handleMusicChanged);
    socket.on("roomCreated", handleRoomCreated);
    socket.on("error", handleError);
    socket.on("roomJoined", handleRoomJoined);
  
    return () => {
      socket.off("musicChanged", handleMusicChanged);
      socket.off("roomCreated", handleRoomCreated);
      socket.off("error", handleError);
      socket.off("roomJoined", handleRoomJoined);
    };
  }, [socket]);

  return (
    <RoomContext.Provider
      value={{
        audioRef,
        changeMusic,
        loading,
        setLoading,
        isPlaying,
        currentTime,
        duration,
        volume,
        roomName,
        isHost,
        handleSliderChange,
        handleVolumeChange,
        togglePlayPause,
        handleCreateRoom,
        handleJoinRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomManager = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoomManager must be used within a RoomManagerProvider");
  }
  return context;
};
