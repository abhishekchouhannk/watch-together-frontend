// VideoPlayer.tsx (Updated to work with the main component)
import { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
} from 'lucide-react';

interface VideoPlayerProps {
  socket: Socket;
  roomId: string;
  floatingEmojis: Array<{ id: number; emoji: string; left: number }>;
  reactionMode: string;
  setReactionMode: (mode: string) => void;
  highlightedEmojis: { [key: number]: boolean };
  quickEmojis: string[];
  handleEmojiReaction: (emoji: string, index: number) => void;
}

export default function VideoPlayer({
  socket,
  roomId,
  floatingEmojis,
  reactionMode,
  setReactionMode,
  highlightedEmojis,
  quickEmojis,
  handleEmojiReaction
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLocalAction, setIsLocalAction] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket || !videoRef.current) return;

    const video = videoRef.current;

    // Socket event handlers
    const handleRemotePlay = ({ currentTime: time, userId }: { currentTime: number; userId: string }) => {
      if (userId !== socket.id && video) {
        setIsLocalAction(true);
        video.currentTime = time;
        video.play().catch(console.error);
        setIsPlaying(true);
        setTimeout(() => setIsLocalAction(false), 100);
      }
    };

    const handleRemotePause = ({ currentTime: time, userId }: { currentTime: number; userId: string }) => {
      if (userId !== socket.id && video) {
        setIsLocalAction(true);
        video.currentTime = time;
        video.pause();
        setIsPlaying(false);
        setTimeout(() => setIsLocalAction(false), 100);
      }
    };

    const handleRemoteSeek = ({ currentTime: time, userId }: { currentTime: number; userId: string }) => {
      if (userId !== socket.id && video) {
        setIsLocalAction(true);
        video.currentTime = time;
        setCurrentTime(time);
        setTimeout(() => setIsLocalAction(false), 100);
      }
    };

    const handleRoomState = (state: { currentTime: number; isPlaying: boolean; lastUpdate: number }) => {
      if (video) {
        setIsLocalAction(true);
        video.currentTime = state.currentTime;
        setCurrentTime(state.currentTime);
        if (state.isPlaying) {
          video.play().catch(console.error);
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
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
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (!isLocalAction && videoRef.current) {
      socket.emit('pause', {
        roomId,
        currentTime: videoRef.current.currentTime
      });
      setIsPlaying(false);
    }
  };

  const handleSeeked = () => {
    if (!isLocalAction && videoRef.current) {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      
      socket.emit('seek', {
        roomId,
        currentTime: newTime
      });
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="relative bg-black lg:rounded-xl overflow-hidden shadow-2xl aspect-video group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeeked}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        src={videoUrl}
      >
        Your browser does not support the video tag.
      </video>

      {/* Floating Emojis */}
      {reactionMode === 'floating' && floatingEmojis.map(emoji => (
        <div
          key={emoji.id}
          className="absolute bottom-20 text-3xl md:text-4xl animate-float-up pointer-events-none z-30"
          style={{ left: `${emoji.left}%` }}
        >
          {emoji.emoji}
        </div>
      ))}

      {/* Video Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Play/Pause Center Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlayPause}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div 
            className="w-full h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer hover:h-2 transition-all"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-red-500 rounded-full relative transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayPause}
                className="text-white hover:scale-110 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={toggleMute}
                className="text-white hover:scale-110 transition-transform"
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
              <div className="text-white text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="text-white hover:scale-110 transition-transform">
                <Settings className="w-6 h-6" />
              </button>
              <button 
                onClick={() => videoRef.current?.requestFullscreen()}
                className="text-white hover:scale-110 transition-transform"
              >
                <Maximize className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Emoji Reactions */}
      <div className="absolute bottom-20 md:bottom-24 right-2 flex flex-col gap-2 z-20">
        {/* Toggle Button */}
        <button
          onClick={() => setReactionMode(reactionMode === 'floating' ? 'highlight' : 'floating')}
          className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg mb-1"
          title={reactionMode === 'floating' ? 'Switch to Highlight Mode' : 'Switch to Floating Mode'}
        >
          <span className="text-lg">
            {reactionMode === 'floating' ? '✨' : '💫'}
          </span>
        </button>

        {/* Emoji Buttons */}
        {quickEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => handleEmojiReaction(emoji, index)}
            className={`w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-xl transition-all hover:scale-110
              ${highlightedEmojis[index] ? 'emoji-highlight' : ''}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}