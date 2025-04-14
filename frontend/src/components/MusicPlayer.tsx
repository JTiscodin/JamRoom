import { Slider } from "@/components/ui/slider";
import { FaPlay } from "react-icons/fa6";
import { FaPause } from "react-icons/fa";
import { IoVolumeHigh } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useRoomManager } from "@/providers/RoomManager";

const MusicPlayer = () => {
  // const audioRef = useRef<HTMLAudioElement | null>(null);
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    handleSliderChange,
    handleVolumeChange,
    togglePlayPause,
  } = useRoomManager();

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-3xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800/50 rounded-xl shadow-xl p-8 backdrop-blur-sm">
      <div className="space-y-8">
        {/* Song info area with improved layout */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex-shrink-0 shadow-md overflow-hidden">
            {/* Album art placeholder with subtle animation */}
            <div className="w-full h-full bg-gradient-to-br from-indigo-500/90 to-purple-600/90 animate-pulse-slow"></div>
          </div>
          <div>
            <h3 className="text-white font-semibold text-xl">Song Title</h3>
            <p className="text-slate-400 text-sm mt-1">Artist</p>
            <p className="text-slate-500 text-xs mt-1">Album • Year</p>
          </div>
        </div>

        {/* Enhanced progress bar */}
        <div className="space-y-3">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            className="w-full cursor-pointer relative h-2 [&>.relative]:h-2 [&>span]:h-2 [&>span>span]:bg-indigo-500 [&>span>span]:h-full [&>span>span.dragging]:bg-indigo-400"
            onValueChange={handleSliderChange}
            // @ts-ignore
            thumbClassName="h-4 w-4 bg-white shadow-md"
          />

          <div className="flex items-center justify-between w-full text-xs text-slate-400">
            <span className="tabular-nums">{formatTime(currentTime)}</span>
            <span className="tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Enhanced controls with better spacing and visual hierarchy */}
        <div className="flex items-center justify-between mt-2">
          {/* Additional controls could go here */}
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
                />
              </svg>
            </button>
          </div>

          <Button
            onClick={togglePlayPause}
            className="h-16 w-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-none shadow-lg transition-transform hover:scale-105"
            variant="secondary"
            disabled={duration === 0 || audioRef.current?.src === ""}
            size="icon"
          >
            {isPlaying ? (
              <FaPause className="text-2xl text-white" />
            ) : (
              <FaPlay className="text-2xl ml-1 text-white" />
            )}
          </Button>

          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Volume control in its own section */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-800/50">
          <IoVolumeHigh className="text-xl text-slate-400" />
          <Slider
            onValueChange={handleVolumeChange}
            step={1}
            max={100}
            value={[volume]}
            className="w-32 cursor-pointer relative h-1.5 [&>.relative]:h-1.5 [&>span]:h-1.5 [&>span>span]:bg-indigo-500/80 [&>span>span]:h-full"
            // @ts-ignore
            thumbClassName="h-3 w-3 bg-white shadow-sm"
          />
          <span className="text-xs text-slate-500 tabular-nums w-8">
            {volume}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
