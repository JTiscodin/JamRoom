import MusicPlayer from "@/components/MusicPlayer";
import Sidebar from "@/components/Sidebar";
import { useRoomManager } from "@/providers/RoomManager";
import { useState } from "react";

const ListenTogether = () => {
  const { isHost } = useRoomManager();
  const [linkCopied, setLinkCopied] = useState(false);

  const copyLinkToClipboard = () => {
    // Get the current roomId from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get("roomId");

    // Create the home page URL with the roomId
    const homeUrl = `${window.location.origin}/?roomId=${roomId}`;

    navigator.clipboard.writeText(homeUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Sidebar */}
      {isHost && <Sidebar />}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="space-y-8">
          {/* Invite Friends Button */}
          <div className="flex justify-center">
            <button
              onClick={copyLinkToClipboard}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>{linkCopied ? "Link Copied!" : "Invite Friends"}</span>
            </button>
          </div>

          <h1 className="text-4xl text-white text-center font-bold">
            Music Player
          </h1>
          <MusicPlayer />

          {/* Currently Playing Section */}
          <div className="bg-slate-800 rounded-lg p-4 shadow-lg">
            <h2 className="text-xl text-white font-semibold mb-3">
              Currently Playing
            </h2>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-slate-700 rounded-md flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-white font-medium">Song Title</p>
                <p className="text-slate-400 text-sm">Artist Name</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListenTogether;
