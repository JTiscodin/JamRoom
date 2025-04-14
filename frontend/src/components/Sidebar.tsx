import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Music } from "lucide-react";
import { useRoomManager } from "@/providers/RoomManager";
import { useEffect, useState } from "react";
import { useSocket } from "@/providers/SocketProvider";

interface Track {
    id: string;
    name: string;
    mimeType: string;
    image?: string;
}

export function Sidebar() {
    const { changeMusic } = useRoomManager();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTracks = async () => {
            try {
                setIsLoading(true);
                // const response = await fetch('http://localhost:3000/list-files');
                const response = await fetch('http://192.168.4.185:3000/list-files');
                const data = await response.json();
                setTracks(data);
            } catch (error) {
                console.error('Error fetching tracks:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTracks();
    }, []);

    return (
        <div className="w-64 h-screen bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-800/50 p-6 flex flex-col">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Listen Together</h2>
            </div>
            
            <div className="flex items-center mb-6">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full flex gap-2 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-slate-700 text-white hover:bg-gradient-to-r hover:from-indigo-600/30 hover:to-purple-600/30 transition-all"
                >
                    <PlusCircle size={16} />
                    Add New Track
                </Button>
            </div>
            
            <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Tracks</h3>
            </div>
            
            <ScrollArea className="flex-1 pr-4">
                {isLoading ? (
                    <div className="text-center py-4 text-slate-400">Loading tracks...</div>
                ) : (
                    <div className="space-y-2">
                        {tracks.map((track) => (
                            <Button
                                onClick={() => changeMusic(track.id)}
                                key={track.id}
                                variant="ghost"
                                className="w-full justify-start p-2 h-auto hover:bg-slate-800/50 text-slate-300 hover:text-white rounded-lg transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 rounded-md shadow-md overflow-hidden border border-slate-700/50">
                                        <AvatarFallback className="bg-gradient-to-br from-indigo-500/90 to-purple-600/90">
                                            <Music size={14} />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-sm text-left">
                                        <div className="font-medium truncate w-36">{track.name}</div>
                                        <div className="text-xs text-slate-400 truncate w-36">{track.mimeType}</div>
                                    </div>
                                </div>
                            </Button>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}

export default Sidebar;