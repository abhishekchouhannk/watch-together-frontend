// components/dashboard/RoomCard.tsx
import React, { useState, useRef } from 'react';
import { Users, Play, Pause, Lock, Unlock, Crown, ArrowRight } from 'lucide-react';
import { Room } from '@/components/dashboard/types/room';
import { useRouter } from 'next/navigation';

interface RoomCardProps {
  room: Room;
  isOwned: boolean;
}

export default function RoomCard({ room, isOwned }: RoomCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => {
      if (isHovered) {
        setIsExpanded(true);
        // Start playing video preview if available
        if (videoRef.current && room.video?.url) {
          videoRef.current.play();
        }
      }
    }, 500); // Delay expansion by 500ms
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsExpanded(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleJoinRoom = () => {
    router.push(`/room/${room.roomId}`);
  };

  const getModeColor = (mode: string) => {
  switch(mode) {
    case 'study':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'gaming':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'entertainment':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'casual':
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

  return (
    <div
      className={`relative transition-all duration-500 ease-in-out transform
                  ${isExpanded ? 'scale-105 z-30' : 'scale-100 z-10'}
                  ${isHovered ? 'shadow-2xl shadow-purple-500/20' : 'shadow-lg'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden border 
                       border-gray-700 hover:border-purple-500/50 transition-all duration-300
                       ${isExpanded ? 'h-auto' : 'h-64'}`}>
        
        {/* Room Header */}
        <div className="relative h-32 bg-gradient-to-br from-purple-600/20 to-blue-600/20">
          {room.thumbnail ? (
            <img 
              src={room.thumbnail} 
              alt={room.roomName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-4xl">{room.mode === 'gaming' ? '🎮' : room.mode === 'study' ? '📚' : '🎬'}</div>
            </div>
          )}
          
          {/* Status Indicators */}
          <div className="absolute top-2 left-2 flex gap-2">
            <span className={`px-2 py-1 text-xs rounded-full border ${getModeColor(room.mode)}`}>
              {room.mode}
            </span>
            {room.video?.isPlaying && (
              <span className="px-2 py-1 text-xs bg-red-500/80 text-white rounded-full flex items-center gap-1">
                <Play size={10} fill="white" />
                LIVE
              </span>
            )}
          </div>

          {/* Privacy Indicator */}
          <div className="absolute top-2 right-2">
            {room.isPublic ? <Unlock size={16} className="text-white/70" /> : <Lock size={16} className="text-white/70" />}
          </div>

          {/* Owner Badge */}
          {isOwned && (
            <div className="absolute bottom-2 right-2 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full flex items-center gap-1">
              <Crown size={12} />
              <span className="text-xs">Admin</span>
            </div>
          )}
        </div>

        {/* Room Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-1 truncate">{room.roomName}</h3>
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{room.description || 'No description'}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <Users size={16} />
              <span className="text-sm">{room.participants.length}/{room.maxParticipants}</span>
            </div>
            
            {!isExpanded && (
              <button
                onClick={handleJoinRoom}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Expanded Preview Section */}
        {isExpanded && (
          <div className="border-t border-gray-700 animate-slideDown">
            {/* Video Preview */}
            {room.video?.url && (
              <div className="relative h-48 bg-black">
                <video
                  ref={videoRef}
                  src={room.video.url}
                  className="w-full h-full object-contain"
                  muted
                  loop
                  currentTime={room.video.currentTime}
                />
                <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded">
                  <span className="text-xs text-white">
                    {room.video.isPlaying ? 'Currently Playing' : 'Paused'}
                  </span>
                </div>
              </div>
            )}

            {/* Participants Preview */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-300">Active Participants</h4>
                <span className="text-xs text-gray-500">
                  {new Date(room.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex -space-x-2">
                {room.participants.slice(0, 5).map((participant, idx) => (
                  <div
                    key={participant.userId}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 
                             flex items-center justify-center text-xs text-white font-semibold
                             border-2 border-gray-800"
                    title={participant.username}
                  >
                    {participant.username[0].toUpperCase()}
                  </div>
                ))}
                {room.participants.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center 
                                text-xs text-gray-300 border-2 border-gray-800">
                    +{room.participants.length - 5}
                  </div>
                )}
              </div>

              {/* Tags */}
              {room.tags && room.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {room.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-gray-700/50 text-gray-400 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleJoinRoom}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white 
                           rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  Join Room
                </button>
                <button
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 
                           rounded-lg transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to favorites or preview more
                  }}
                >
                  ⭐
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading skeleton
export function RoomCardSkeleton() {
  return (
    <div className="bg-gray-800/90 rounded-xl h-64 animate-pulse">
      <div className="h-32 bg-gray-700/50"></div>
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-700/50 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700/50 rounded w-full"></div>
        <div className="h-4 bg-gray-700/50 rounded w-1/2"></div>
      </div>
    </div>
  );
}