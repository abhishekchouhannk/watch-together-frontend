'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, Play, Pause, Clock, Filter } from 'lucide-react';
import  RoomCard from '@/components/dashboard/RoomCard';
import { RoomCardSkeleton } from '@/components/dashboard/RoomCard';
import CreateRoomModal from '@/components/dashboard/CreateRoomModal';
import SearchBar from '@/components/dashboard/SearchBar';
import { Room, RoomMode } from '@/components/dashboard/types/room';
import RoomFilters from '@/components/dashboard/RoomFilters';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function Dashboard() {
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<RoomMode | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const [myRoomsRes, publicRoomsRes] = await Promise.all([
        fetch(`${SERVER_URL}/api/rooms/my-rooms`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`}, credentials: 'include'
        }),
        fetch(`${SERVER_URL}/api/rooms/public`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`}, credentials: 'include'
        })
      ]);

      const myRoomsData = await myRoomsRes.json() || null;
      const publicRoomsData = await publicRoomsRes.json();
      
      // setMyRooms(myRoomsData.rooms);
      setPublicRooms(publicRoomsData.rooms);
      setFilteredRooms(publicRoomsData.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterRooms(query, selectedMode);
  };

  const handleModeFilter = (mode: RoomMode | 'all') => {
    setSelectedMode(mode);
    filterRooms(searchQuery, mode);
  };

  const filterRooms = (query: string, mode: RoomMode | 'all') => {
    let filtered = [...publicRooms];

    if (mode !== 'all') {
      filtered = filtered.filter(room => 
  room.mode?.toLowerCase() === mode.toLowerCase()
);;
    }

    if (query) {
      filtered = filtered.filter(room => 
        room.roomName.toLowerCase().includes(query.toLowerCase()) ||
        room.description?.toLowerCase().includes(query.toLowerCase()) ||
        room.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    console.log(filteredRooms)

    setFilteredRooms(filtered);
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-gray-900/70 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              Welcome back! 👋
            </h1>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 
                       text-white rounded-lg transition-colors duration-200"
            >
              <Plus size={20} />
              Create Room
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <SearchBar onSearch={handleSearch} />
        <RoomFilters 
          selectedMode={selectedMode} 
          onModeChange={handleModeFilter}
        />
      </div>

      {/* My Rooms Section */}
      {myRooms.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Your Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {myRooms.map((room) => (
              <RoomCard key={room.roomId} room={room} isOwned={true} />
            ))}
          </div>
        </section>
      )}

      {/* Public Rooms Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
        <h2 className="text-xl font-semibold text-white mb-4">
          Discover Rooms
          <span className="ml-2 text-sm text-gray-400">
            ({filteredRooms.length} rooms available)
          </span>
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <RoomCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRooms.map((room) => (
              <RoomCard key={room.roomId} room={room} isOwned={false} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No rooms found matching your criteria</p>
          </div>
        )}
      </section>

      {/* Create Room Modal */}
      <CreateRoomModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onRoomCreated={fetchRooms}
      />
    </div>
    </ProtectedRoute>
  );
}