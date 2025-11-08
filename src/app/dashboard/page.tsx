'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, Play, Pause, Clock, Filter } from 'lucide-react';
import RoomCard from '@/components/dashboard/RoomCard';
import CreateRoomModal from '@/components/dashboard/CreateRoomModal';
import SearchBar from '@/components/dashboard/SearchBar';
import RoomFilters from '@/components/dashboard/RoomFilters';
import { RoomCardSkeleton } from '@/components/dashboard/RoomCard';
import { Room, RoomMode } from '@/components/dashboard/types/room';
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<RoomMode | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  // Re-apply filters whenever publicRooms, selectedMode, or searchQuery changes
  useEffect(() => {
    filterRooms(searchQuery, selectedMode);
  }, [publicRooms, selectedMode, searchQuery]);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch public rooms
      const publicRoomsRes = await fetch(`${SERVER_URL}/api/rooms/public`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
        }, 
        credentials: 'include'
      });

      if (!publicRoomsRes.ok) {
        throw new Error('Failed to fetch public rooms');
      }

      const publicRoomsData = await publicRoomsRes.json();
      console.log('Public rooms data:', publicRoomsData); // Debug log
      
      setPublicRooms(publicRoomsData.rooms || []);

      // Fetch user's rooms if authenticated
      if (token) {
        try {
          const myRoomsRes = await fetch(`${SERVER_URL}/api/rooms/my-rooms`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
            }, 
            credentials: 'include'
          });

          if (myRoomsRes.ok) {
            const myRoomsData = await myRoomsRes.json();
            console.log('My rooms data:', myRoomsData); // Debug log
            setMyRooms(myRoomsData.rooms || []);
          }
        } catch (error) {
          console.error('Error fetching my rooms:', error);
          // Continue even if my-rooms fails
        }
      }
      
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleModeFilter = (mode: RoomMode | 'all') => {
    console.log('Filter selected:', mode); // Debug log
    setSelectedMode(mode);
  };

  const filterRooms = (query: string, mode: RoomMode | 'all') => {
    console.log('Filtering rooms:', { query, mode, totalRooms: publicRooms.length }); // Debug log
    
    let filtered = [...publicRooms];

    // Filter by mode
    if (mode !== 'all') {
      filtered = filtered.filter(room => {
        console.log(`Room ${room.roomName} mode: ${room.mode}, looking for: ${mode}`); // Debug log
        return room.mode === mode;
      });
      console.log(`After mode filter (${mode}):`, filtered.length); // Debug log
    }

    // Filter by search query
    if (query && query.trim() !== '') {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(room => 
        room.roomName?.toLowerCase().includes(lowerQuery) ||
        room.description?.toLowerCase().includes(lowerQuery) ||
        room.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
      console.log(`After search filter (${query}):`, filtered.length); // Debug log
    }

    setFilteredRooms(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-gray-900/70 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              Welcome back 👋
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
        
        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-800/50 rounded text-xs text-gray-400">
            Debug: Mode: {selectedMode} | Search: "{searchQuery}" | 
            Public: {publicRooms.length} | Filtered: {filteredRooms.length}
          </div>
        )}
      </div>

      {/* My Rooms Section */}
      {myRooms.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Your Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {myRooms.map((room) => (
              <RoomCard 
                key={room.roomId || room._id} 
                room={room} 
                isOwned={true} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Public Rooms Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
        <h2 className="text-xl font-semibold text-white mb-4">
          Discover Rooms
          <span className="ml-2 text-sm text-gray-400">
            ({filteredRooms.length} {selectedMode !== 'all' ? `${selectedMode} ` : ''}rooms available)
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
              <RoomCard 
                key={room.roomId || room._id} 
                room={room} 
                isOwned={false} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {selectedMode !== 'all' 
                ? `No ${selectedMode} rooms found${searchQuery ? ` matching "${searchQuery}"` : ''}`
                : searchQuery 
                  ? `No rooms found matching "${searchQuery}"`
                  : 'No rooms available'}
            </p>
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
  );
}