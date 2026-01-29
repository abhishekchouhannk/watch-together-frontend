// components/VideoPlayer.tsx
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

interface VideoPlayerProps {
  socket: Socket;
  roomId: string;
}

export default function VideoPlayer({ socket, roomId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLocalAction, setIsLocalAction] = useState(false);
  const [videoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket || !videoRef.current) return;

    const video = videoRef.current;

    // Socket event handlers
    const handleRemotePlay = ({ currentTime, userId }: { currentTime: number; userId: string }) => {
      if (userId !== socket.id && video) {
        setIsLocalAction(true);
        video.currentTime = currentTime;
        video.play().catch(console.error);
        setTimeout(() => setIsLocalAction(false), 100);
      }
    };

    const handleRemotePause = ({ currentTime, userId }: { currentTime: number; userId: string }) => {
      if (userId !== socket.id && video) {
        setIsLocalAction(true);
        video.currentTime = currentTime;
        video.pause();
        setTimeout(() => setIsLocalAction(false), 100);
      }
    };

    const handleRemoteSeek = ({ currentTime, userId }: { currentTime: number; userId: string }) => {
      if (userId !== socket.id && video) {
        setIsLocalAction(true);
        video.currentTime = currentTime;
        setTimeout(() => setIsLocalAction(false), 100);
      }
    };

    const handleRoomState = (state: { currentTime: number; isPlaying: boolean; lastUpdate: number }) => {
      if (video) {
        setIsLocalAction(true);
        video.currentTime = state.currentTime;
        if (state.isPlaying) {
          video.play().catch(console.error);
        } else {
          video.pause();
        }
        setTimeout(() => setIsLocalAction(false), 100);
      }
    };

    socket.on('play', handleRemotePlay);
    socket.on('pause', handleRemotePause);
    socket.on('seek', handleRemoteSeek);
    socket.on('room-state', handleRoomState);

    // Request initial sync
    socket.emit('sync-request', { roomId });

    return () => {
      socket.off('play', handleRemotePlay);
      socket.off('pause', handleRemotePause);
      socket.off('seek', handleRemoteSeek);
      socket.off('room-state', handleRoomState);
    };
  }, [socket, roomId]);

  const handlePlay = () => {
    if (!isLocalAction && videoRef.current) {
      socket.emit('play', { 
        roomId, 
        currentTime: videoRef.current.currentTime 
      });
    }
  };

  const handlePause = () => {
    if (!isLocalAction && videoRef.current) {
      socket.emit('pause', { 
        roomId, 
        currentTime: videoRef.current.currentTime 
      });
    }
  };

  const handleSeeked = () => {
    if (!isLocalAction && videoRef.current) {
      // Clear any pending sync timeout
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      
      // Debounce seek events
      syncTimeoutRef.current = setTimeout(() => {
        if (videoRef.current) {
          socket.emit('seek', { 
            roomId, 
            currentTime: videoRef.current.currentTime 
          });
        }
      }, 200);
    }
  };

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full"
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeeked}
        src={videoUrl}
      >
        Your browser does not support the video tag.
      </video>
      <div className="p-4 bg-gray-800">
        <p className="text-sm text-gray-400">
          Sample video for testing synchronized playback
        </p>
      </div>
    </div>
  );
}