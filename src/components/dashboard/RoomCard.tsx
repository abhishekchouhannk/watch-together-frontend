// components/dashboard/RoomCard.tsx
'use client';


import React, { useState, useRef } from 'react';
import { Users, Play, Pause, Lock, Unlock, Crown, ArrowRight } from 'lucide-react';
import { Room } from '@/components/dashboard/types/room';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';

interface RoomCardProps {
  room: Room;
  isOwned: boolean;
}

export default function RoomCard({ room, isOwned }: RoomCardProps) {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
  setIsHovered(true);
  hoverTimeout.current = setTimeout(() => {
    setIsExpanded(true);
    if (videoRef.current && room.video?.url) {
      videoRef.current.play();
    }
  }, 500);
};

const handleMouseLeave = () => {
  setIsHovered(false);
  setIsExpanded(false);
  if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  if (videoRef.current) videoRef.current.pause();
};

  const handleJoinRoom = () => {
    router.push(`/room/${room.roomId}`);
  };

const getModeColor = (mode: string) => {
    const colors = {
      morning: {
        casual: 'bg-orange-500/20 text-orange-300 border-orange-500',
        entertainment: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
        gaming: 'bg-red-500/20 text-red-300 border-red-500',
        study: 'bg-blue-500/20 text-blue-300 border-blue-500',
      },
      afternoon: {
        casual: 'bg-sky-500/20 text-sky-300 border-sky-500',
        entertainment: 'bg-yellow-400/20 text-yellow-300 border-yellow-400',
        gaming: 'bg-orange-500/20 text-orange-300 border-orange-500',
        study: 'bg-blue-500/20 text-blue-300 border-blue-500',
      },
      evening: {
        casual: 'bg-purple-500/20 text-purple-300 border-purple-500',
        entertainment: 'bg-pink-500/20 text-pink-300 border-pink-500',
        gaming: 'bg-red-500/20 text-red-300 border-red-500',
        study: 'bg-indigo-500/20 text-indigo-300 border-indigo-500',
      },
      night: {
        casual: 'bg-indigo-500/20 text-indigo-300 border-indigo-500',
        entertainment: 'bg-purple-500/20 text-purple-300 border-purple-500',
        gaming: 'bg-red-500/20 text-red-300 border-red-500',
        study: 'bg-blue-400/20 text-blue-300 border-blue-400',
      },
    };

    return colors[theme.name as keyof typeof colors][mode as keyof typeof colors.morning] || 
           colors[theme.name as keyof typeof colors].casual;
  };

  const getGradientForTheme = () => {
    const gradients = {
      morning: 'from-orange-600/20 to-yellow-600/20',
      afternoon: 'from-sky-600/20 to-blue-600/20',
      evening: 'from-purple-600/20 to-pink-600/20',
      night: 'from-indigo-600/20 to-blue-900/20',
    };
    return gradients[theme.name as keyof typeof gradients];
  };

  return (
    <div
      className={`relative transition-all duration-500 ease-in-out transform
                  ${isExpanded ? 'scale-105 z-30' : 'scale-100 z-10'}
                  ${isHovered ? `shadow-2xl ${theme.name === 'morning' ? 'shadow-orange-500/20' : 
                                               theme.name === 'afternoon' ? 'shadow-sky-500/20' :
                                               theme.name === 'evening' ? 'shadow-purple-500/20' :
                                               'shadow-indigo-500/20'}` : 'shadow-lg'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`backdrop-blur-sm rounded-xl overflow-hidden border-2 
                       transition-all duration-300
                       ${isExpanded ? 'h-auto' : 'h-64'}`}
           style={{
             backgroundColor: theme.name === 'night' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(0, 0, 0, 0.2)',
             borderColor: isHovered ? 
               (theme.name === 'morning' ? 'rgba(251, 146, 60, 0.5)' :
                theme.name === 'afternoon' ? 'rgba(56, 189, 248, 0.5)' :
                theme.name === 'evening' ? 'rgba(168, 85, 247, 0.5)' :
                'rgba(129, 140, 248, 0.5)') : 'rgba(107, 114, 128, 0.3)'
           }}>
        
        {/* Room Header */}
        <div className={`relative h-32 bg-gradient-to-br ${getGradientForTheme()}`}>
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
            <span className={`px-2 py-1 text-xs rounded-full border backdrop-blur-sm ${getModeColor(room.mode)}`}>
              {room.mode}
            </span>
            {room.video?.isPlaying && (
              <span className="px-2 py-1 text-xs bg-red-500/80 text-white rounded-full flex items-center gap-1 backdrop-blur-sm">
                <Play size={10} fill="white" />
                LIVE
              </span>
            )}
          </div>

          {/* Privacy Indicator */}
          <div className="absolute top-2 right-2 backdrop-blur-sm bg-black/30 p-1 rounded-full">
            {room.isPublic ? <Unlock size={16} className="text-white/90" /> : <Lock size={16} className="text-white/90" />}
          </div>

          {/* Owner Badge */}
          {isOwned && (
            <div className="absolute bottom-2 right-2 bg-yellow-500/30 backdrop-blur-sm text-yellow-300 px-2 py-1 rounded-full flex items-center gap-1 border border-yellow-500/50">
              <Crown size={12} />
              <span className="text-xs font-medium">Admin</span>
            </div>
          )}
        </div>

        {/* Room Info */}
        <div className="p-4">
          <h3 className={`text-lg font-semibold ${theme.textColor} mb-1 truncate`}>{room.roomName}</h3>
          <p className={`text-sm ${theme.textColor} opacity-70 mb-3 line-clamp-2`}>
            {room.description || 'No description'}
          </p>
          
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${theme.textColor} opacity-80`}>
              <Users size={16} />
              <span className="text-sm">{room.participants.length}/{room.maxParticipants}</span>
            </div>
            
            {!isExpanded && (
              <button
                onClick={handleJoinRoom}
                className={`transition-colors ${
                  theme.name === 'morning' ? 'text-orange-400 hover:text-orange-300' :
                  theme.name === 'afternoon' ? 'text-sky-400 hover:text-sky-300' :
                  theme.name === 'evening' ? 'text-purple-400 hover:text-purple-300' :
                  'text-indigo-400 hover:text-indigo-300'
                }`}
              >
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Expanded Preview Section */}
        {isExpanded && (
          <div className="border-t animate-slideDown"
               style={{ borderColor: 'rgba(107, 114, 128, 0.3)' }}>
            {/* Video Preview */}
            {room.video?.url && (
              <div className="relative h-48 bg-black">
                <video
                  ref={videoRef}
                  src={room.video.url}
                  className="w-full h-full object-contain"
                  muted
                  loop
                />
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded">
                  <span className="text-xs text-white">
                    {room.video.isPlaying ? 'Currently Playing' : 'Paused'}
                  </span>
                </div>
              </div>
            )}

            {/* Participants Preview */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-medium ${theme.textColor}`}>Active Participants</h4>
                <span className={`text-xs ${theme.textColor} opacity-60`}>
                  {/* {new Date(room.createdAt).toLocaleDateString()} */}
                </span>
              </div>
              
              <div className="flex -space-x-2">
                {room.participants.slice(0, 5).map((participant) => (
                  <div
                    key={participant.userId}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-semibold
                             border-2`}
                    title={participant.username}
                    style={{
                      background: theme.name === 'morning' ? 'linear-gradient(to br, #fb923c, #fbbf24)' :
                                  theme.name === 'afternoon' ? 'linear-gradient(to br, #38bdf8, #3b82f6)' :
                                  theme.name === 'evening' ? 'linear-gradient(to br, #a855f7, #ec4899)' :
                                  'linear-gradient(to br, #818cf8, #6366f1)',
                      borderColor: theme.name === 'night' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {participant.username[0].toUpperCase()}
                  </div>
                ))}
                {room.participants.length > 5 && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                                text-xs ${theme.textColor} border-2`}
                       style={{
                         backgroundColor: 'rgba(107, 114, 128, 0.3)',
                         borderColor: theme.name === 'night' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0, 0, 0, 0.3)'
                       }}>
                    +{room.participants.length - 5}
                  </div>
                )}
              </div>

              {/* Tags */}
              {room.tags && room.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {room.tags.map((tag, idx) => (
                    <span key={idx} 
                          className={`text-xs px-2 py-1 rounded ${theme.textColor} opacity-70`}
                          style={{ backgroundColor: 'rgba(107, 114, 128, 0.2)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleJoinRoom}
                  className={`flex-1 py-2 ${theme.buttonPrimary} rounded-lg transition-colors duration-200 text-sm font-medium`}
                >
                  Join Room
                </button>
                <button
                  className={`px-3 py-2 ${theme.buttonSecondary} rounded-lg transition-colors duration-200`}
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