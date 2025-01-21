import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa6";
import { FaPause } from "react-icons/fa";
import { IoVolumeHigh } from "react-icons/io5";
import { Button } from "@/components/ui/button";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState<number>(100);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("http://localhost:3000/?songid=1");

    audioRef.current.volume = volume / 100;

    // Set up event listeners
    audioRef.current.addEventListener("loadedmetadata", () => {
      setDuration(audioRef.current!.duration);
    });

    audioRef.current.addEventListener("timeupdate", () => {
      setCurrentTime(audioRef.current!.currentTime);
    });

    audioRef.current.addEventListener("volumechange", () => {
      setVolume(audioRef.current!.volume * 100);
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

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-[70vw] h-[30vh] text-white flex flex-col bg-slate-800 justify-around items-center p-6 rounded-lg">
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between w-full text-sm">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={1}
          className="w-full"
          onValueChange={handleSliderChange}
        />

        <div className="flex justify-center gap-4 mt-4">
          <Button
            onClick={togglePlayPause}
            className="h-12 w-12 rounded-full"
            variant="secondary"
          >
            {isPlaying ? (
              <FaPause className="text-2xl" />
            ) : (
              <FaPlay className="text-2xl ml-1" />
            )}
          </Button>
          <div className="flex items-center gap-1">
            <IoVolumeHigh className="text-2xl" />
            <Slider
              onValueChange={handleVolumeChange}
              step={1}
              max={100}
              value={[volume!]}
              className="w-32"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
