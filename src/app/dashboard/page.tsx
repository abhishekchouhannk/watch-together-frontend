"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import RoomCard from "@/components/dashboard/RoomCard";
import CreateRoomModal from "@/components/dashboard/CreateRoomModal";
import SearchBar from "@/components/dashboard/SearchBar";
import RoomFilters from "@/components/dashboard/RoomFilters";
import { Room, RoomMode } from "@/components/dashboard/types/room";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LogoutButton from "@/components/auth/LogoutButton";
import { useBackground } from "@/components/landingPage/BackgroundProvider";
import { TIME_THEMES } from "@/components/ThemeConstants";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function Dashboard() {
  // Get the current theme
  const { selectedTheme } = useBackground();
  const theme = TIME_THEMES[selectedTheme];

  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<RoomMode | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"public" | "my">("public");

  // Theme-specific classes
  const headerBg = selectedTheme === 'night' 
    ? 'bg-gray-900/70 border-gray-800' 
    : 'bg-white/70 border-gray-200';
  
  const containerBg = selectedTheme === 'night'
    ? 'bg-gray-800/50'
    : 'bg-white/50';
  
  const toggleActiveBg = selectedTheme === 'night'
    ? 'bg-purple-600'
    : theme.buttonPrimary.split(' ')[0]; // Extract just the bg-color class
  
  const toggleInactiveText = selectedTheme === 'night'
    ? 'text-gray-400 hover:text-gray-300'
    : 'text-gray-600 hover:text-gray-500';
  
  const scrollbarClasses = selectedTheme === 'night'
    ? 'scrollbar-thumb-gray-700 scrollbar-track-gray-900'
    : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100';
  
  const emptyStateText = selectedTheme === 'night'
    ? 'text-gray-400'
    : 'text-gray-600';
  
  const metaText = selectedTheme === 'night'
    ? 'text-gray-500'
    : 'text-gray-600';

  /** Fetch rooms on mount */
  useEffect(() => {
    fetchRooms();
  }, []);

  /** Re-filter whenever data, mode, search query, or view changes */
  useEffect(() => {
    if (!isLoading) {
      filterRooms(searchQuery, selectedMode);
    }
  }, [publicRooms, myRooms, selectedMode, searchQuery, viewMode, isLoading]);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);

      const [myRoomsRes, publicRoomsRes] = await Promise.all([
        fetch(`${SERVER_URL}/api/rooms/my-rooms`, { credentials: "include" }),
        fetch(`${SERVER_URL}/api/rooms/public`, { credentials: "include" }),
      ]);

      if (!publicRoomsRes.ok) {
        throw new Error("Failed to fetch public rooms");
      }

      const myRoomsData = myRoomsRes.ok
        ? await myRoomsRes.json()
        : { rooms: [] };
      const publicRoomsData = await publicRoomsRes.json();

      console.log("Fetched public rooms:", publicRoomsData.rooms);

      setMyRooms(myRoomsData.rooms || []);
      setPublicRooms(publicRoomsData.rooms || []);
      
      setFilteredRooms(viewMode === "public" ? publicRoomsData.rooms || [] : myRoomsData.rooms || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setPublicRooms([]);
      setMyRooms([]);
      setFilteredRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleModeFilter = (mode: RoomMode | "all") => {
    setSelectedMode(mode);
  };

  const filterRooms = (query: string, mode: RoomMode | "all") => {
    const currentRooms = viewMode === "public" ? publicRooms : myRooms;
    
    if (!currentRooms || currentRooms.length === 0) {
      setFilteredRooms([]);
      return;
    }

    let filtered = [...currentRooms];

    if (mode !== "all") {
      filtered = filtered.filter((room) => room.mode === mode);
    }

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (room) =>
          room.roomName.toLowerCase().includes(lowerQuery) ||
          room.description?.toLowerCase().includes(lowerQuery) ||
          room.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredRooms(filtered);
  };

  const handleScrollBubble = (e: React.WheelEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtTop = target.scrollTop === 0;
    const isAtBottom =
      Math.ceil(target.scrollTop + target.clientHeight) >= target.scrollHeight;

    if (
      (isAtTop && e.deltaY < 0) ||
      (isAtBottom && e.deltaY > 0)
    ) {
      return;
    }

    e.stopPropagation();
  };

  const handleViewToggle = (view: "public" | "my") => {
    setViewMode(view);
    setSelectedMode("all");
    setSearchQuery("");
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen">
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-lg ${headerBg} border-b`}>
        <div className="relative">
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <LogoutButton />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className={`text-2xl font-bold ${theme.textColor}`}>Welcome back! 👋</h1>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${theme.buttonPrimary}`}
              >
                <Plus size={20} />
                Create Room
              </button>
            </div>
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

        <div className={`mt-4 text-sm ${metaText}`}>
          Total rooms: {viewMode === "public" ? publicRooms.length : myRooms.length} | 
          Filtered: {filteredRooms.length} | Mode: {selectedMode}
        </div>
      </div>

      {/* Rooms Section with Toggle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-semibold ${theme.textColor}`}>
            {viewMode === "public" ? "Discover Rooms" : "My Rooms"}
            <span className={`ml-2 text-sm ${metaText}`}>
              ({filteredRooms.length} rooms available)
            </span>
          </h2>
          
          {/* Toggle Switch */}
          <div className={`flex items-center gap-3 ${containerBg} backdrop-blur-sm rounded-full p-1`}>
            <button
              onClick={() => handleViewToggle("public")}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                viewMode === "public"
                  ? `${toggleActiveBg} text-white`
                  : toggleInactiveText
              }`}
            >
              Public Rooms
            </button>
            <button
              onClick={() => handleViewToggle("my")}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                viewMode === "my"
                  ? `${toggleActiveBg} text-white`
                  : toggleInactiveText
              }`}
            >
              My Rooms
            </button>
          </div>
        </div>

        {/* Scrollable container */}
        <div
          className={`overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin ${scrollbarClasses} rounded-lg`}
          onWheel={(e) => handleScrollBubble(e)}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <RoomCardSkeleton key={i} theme={theme} selectedTheme={selectedTheme} />
              ))}
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredRooms.map((room) => (
                <RoomCard 
                  key={room.roomId} 
                  room={room} 
                  isOwned={viewMode === "my"} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={emptyStateText}>
                {viewMode === "my" 
                  ? "You haven't created any rooms yet"
                  : selectedMode !== "all"
                    ? `No ${selectedMode} rooms found`
                    : "No rooms found matching your criteria"
                }
              </p>
            </div>
          )}
        </div>
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

// Room Card Skeleton Component
export function RoomCardSkeleton({ theme, selectedTheme }: { theme: any, selectedTheme: string }) {
  const skeletonBg = selectedTheme === 'night' ? 'bg-gray-800/90' : 'bg-white/90';
  const skeletonShimmer = selectedTheme === 'night' ? 'bg-gray-700/50' : 'bg-gray-200/50';
  
  return (
    <div className={`${skeletonBg} rounded-xl h-64 animate-pulse`}>
      <div className={`h-32 ${skeletonShimmer}`}></div>
      <div className="p-4 space-y-3">
        <div className={`h-5 ${skeletonShimmer} rounded w-3/4`}></div>
        <div className={`h-4 ${skeletonShimmer} rounded w-full`}></div>
        <div className={`h-4 ${skeletonShimmer} rounded w-1/2`}></div>
      </div>
    </div>
  );
}