import MusicPlayer from "@/components/MusicPlayer";

const ListenTogether = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="space-y-8">
        <h1 className="text-4xl text-white text-center font-bold">
          Music Player
        </h1>
        <MusicPlayer />
      </div>
    </div>
  );
};

export default ListenTogether;
