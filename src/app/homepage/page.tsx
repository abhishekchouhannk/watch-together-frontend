// app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Users, Play, Pause, Clock, Filter, X } from 'lucide-react';

interface Room {
  _id: string;
  roomId: string;
  roomName: string;
  description?: string;
  roomType: 'gaming' | 'study' | 'entertainment';
  admin: {
    userId: string;
    username: string;
  };
  video?: {
    url?: string;
    title?: string;
    thumbnail?: string;
    currentTime: number;
    isPlaying: 'playing' | 'paused';
  };
  participants: {
    userId: string;
    username: string;
    joinedAt: Date;
  }[];
  maxParticipants: number;
  isPublic: boolean;
  tags?: string[];
  createdAt: string;
}

const HomePage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch user's joined rooms and public rooms
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      // Fetch joined rooms
      const joinedResponse = await fetch('/api/rooms/joined', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const joinedData = await joinedResponse.json();
      setJoinedRooms(joinedData.rooms || []);

      // Fetch public rooms
      const publicResponse = await fetch('/api/rooms/public', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const publicData = await publicResponse.json();
      setPublicRooms(publicData.rooms || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery && selectedType === 'all') {
      fetchRooms();
      return;
    }

    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedType !== 'all') params.append('type', selectedType);

      const response = await fetch(`/api/rooms/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setPublicRooms(data.rooms || []);
    } catch (error) {
      console.error('Error searching rooms:', error);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header with Search */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-gray-900/70 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search rooms by name, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Room Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="gaming">Gaming</option>
                <option value="study">Study</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </div>

            {/* Create Room Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create Room</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Your Rooms Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Your Rooms</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : joinedRooms.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-xl">
              <p className="text-gray-400">You haven't joined any rooms yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedRooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  isHovered={hoveredRoom === room._id}
                  onMouseEnter={() => setHoveredRoom(room._id)}
                  onMouseLeave={() => setHoveredRoom(null)}
                  onJoin={() => handleJoinRoom(room.roomId)}
                  isOwned={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* Discover Rooms Section */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Discover Rooms</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : publicRooms.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-xl">
              <p className="text-gray-400">No public rooms available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicRooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  isHovered={hoveredRoom === room._id}
                  onMouseEnter={() => setHoveredRoom(room._id)}
                  onMouseLeave={() => setHoveredRoom(null)}
                  onJoin={() => handleJoinRoom(room.roomId)}
                  isOwned={false}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Create Room Modal */}
      {showCreateModal && (
        <CreateRoomModal onClose={() => setShowCreateModal(false)} onSuccess={fetchRooms} />
      )}
    </div>
  );
};

// Room Card Component
interface RoomCardProps {
  room: Room;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onJoin: () => void;
  isOwned: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onJoin,
  isOwned
}) => {
  const typeColors = {
    gaming: 'from-purple-600 to-pink-600',
    study: 'from-blue-600 to-cyan-600',
    entertainment: 'from-orange-600 to-red-600'
  };

  const typeIcons = {
    gaming: '🎮',
    study: '📚',
    entertainment: '🎬'
  };

  return (
    <div
      className={`relative bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
        isHovered ? 'transform scale-105 shadow-2xl' : 'shadow-lg'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onJoin}
    >
      {/* Room Header */}
      <div className={`p-4 bg-gradient-to-r ${typeColors[room.roomType]} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{typeIcons[room.roomType]}</span>
            <h3 className="font-bold text-lg truncate">{room.roomName}</h3>
          </div>
          {isOwned && (
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Admin</span>
          )}
        </div>
      </div>

      {/* Room Content */}
      <div className={`p-4 transition-all duration-300 ${isHovered ? 'h-64' : 'h-32'}`}>
        {!isHovered ? (
          // Collapsed View
          <div>
            <p className="text-gray-400 text-sm mb-2 line-clamp-2">
              {room.description || 'No description available'}
            </p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Users className="w-4 h-4" />
                <span>{room.participants.length}/{room.maxParticipants}</span>
              </div>
              {room.video?.isPlaying === 'playing' && (
                <div className="flex items-center gap-1 text-green-400">
                  <Play className="w-4 h-4" />
                  <span>Live</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Expanded View
          <div className="space-y-3">
            {/* Video Preview */}
            {room.video?.thumbnail && (
              <div className="relative h-32 bg-gray-700 rounded-lg overflow-hidden">
                <img 
                  src={room.video.thumbnail} 
                  alt="Video thumbnail" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(room.video.currentTime)}
                </div>
                <div className="absolute top-2 right-2">
                  {room.video.isPlaying === 'playing' ? (
                    <Play className="w-6 h-6 text-white drop-shadow-lg" />
                  ) : (
                    <Pause className="w-6 h-6 text-white drop-shadow-lg" />
                  )}
                </div>
              </div>
            )}
            
            {/* Room Details */}
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">
                {room.description || 'No description available'}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Host: {room.admin.username}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {room.tags?.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-gray-700 px-2 py-1 rounded-full text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Join Button */}
            <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium">
              Join Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Create Room Modal Component
interface CreateRoomModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    roomName: '',
    description: '',
    roomType: 'entertainment' as 'gaming' | 'study' | 'entertainment',
    maxParticipants: 10,
    isPublic: true,
    tags: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/rooms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }),
        credentials: 'include'   // 🔑 this ensures cookies are sent
      });

      console.log(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/rooms/create`);

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Create New Room</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Room Name
            </label>
            <input
              type="text"
              required
              value={formData.roomName}
              onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Room Type
            </label>
            <select
              value={formData.roomType}
              onChange={(e) => setFormData({ ...formData, roomType: e.target.value as any })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="gaming">Gaming</option>
              <option value="study">Study</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="movie, chill, anime"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Participants
              </label>
              <input
                type="number"
                min="2"
                max="50"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">Public Room</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePage;