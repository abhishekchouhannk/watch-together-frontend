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
import { useTheme } from "@/hooks/useTheme"; // Import the new hook
import HoverExpandCard from "@/components/dashboard/HoverExpandCard";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export default function Dashboard() {
  const theme = useTheme(); // Get current theme
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<RoomMode | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"public" | "my">("public");

  // ... (keep all your existing useEffect and function logic) ...

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

  // Dynamic theme classes based on current theme
  const getThemeClasses = () => {
    const baseClasses = {
      morning: {
        bg: 'bg-orange-50/10',
        headerBg: 'bg-orange-900/20',
        border: 'border-orange-800/30',
        cardBg: 'bg-orange-800/20',
        skeletonBg: 'bg-orange-700/10',
        text: theme.textColor,
        textSecondary: 'text-orange-300',
        textMuted: 'text-orange-400',
        button: theme.buttonPrimary,
        buttonSecondary: theme.buttonSecondary,
        toggleActive: 'bg-orange-500',
        toggleInactive: 'text-orange-300 hover:text-orange-200',
        scrollbar: 'scrollbar-thumb-orange-700 scrollbar-track-orange-900/20',
      },
      afternoon: {
        bg: 'bg-sky-50/10',
        headerBg: 'bg-sky-900/20',
        border: 'border-sky-800/30',
        cardBg: 'bg-sky-800/20',
        skeletonBg: 'bg-sky-700/10',
        text: theme.textColor,
        textSecondary: 'text-sky-300',
        textMuted: 'text-sky-400',
        button: theme.buttonPrimary,
        buttonSecondary: theme.buttonSecondary,
        toggleActive: 'bg-yellow-400 text-sky-900',
        toggleInactive: 'text-sky-300 hover:text-sky-200',
        scrollbar: 'scrollbar-thumb-sky-700 scrollbar-track-sky-900/20',
      },
      evening: {
        bg: 'bg-purple-50/10',
        headerBg: 'bg-purple-900/20',
        border: 'border-purple-800/30',
        cardBg: 'bg-purple-800/20',
        skeletonBg: 'bg-purple-700/10',
        text: theme.textColor,
        textSecondary: 'text-purple-300',
        textMuted: 'text-purple-400',
        button: theme.buttonPrimary,
        buttonSecondary: theme.buttonSecondary,
        toggleActive: 'bg-purple-600',
        toggleInactive: 'text-purple-300 hover:text-purple-200',
        scrollbar: 'scrollbar-thumb-purple-700 scrollbar-track-purple-900/20',
      },
      night: {
        bg: 'bg-indigo-50/10',
        headerBg: 'bg-indigo-900/30',
        border: 'border-indigo-800/30',
        cardBg: 'bg-indigo-800/20',
        skeletonBg: 'bg-indigo-700/10',
        text: theme.textColor,
        textSecondary: 'text-indigo-300',
        textMuted: 'text-indigo-400',
        button: theme.buttonPrimary,
        buttonSecondary: theme.buttonSecondary,
        toggleActive: 'bg-indigo-500',
        toggleInactive: 'text-indigo-300 hover:text-indigo-200',
        scrollbar: 'scrollbar-thumb-indigo-700 scrollbar-track-indigo-900/20',
      },
    };

    return baseClasses[theme.name as keyof typeof baseClasses];
  };

  const themeClasses = getThemeClasses();

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header */}
        <header className={`sticky top-0 z-40 backdrop-blur-lg ${themeClasses.headerBg} border-b ${themeClasses.border}`}>
          <div className="relative">
            {/* Logout button */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <LogoutButton />
            </div>
            
            {/* Main header content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <h1 className={`text-2xl font-bold ${themeClasses.text}`}>
                  Welcome back! 👋
                </h1>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className={`flex items-center gap-2 px-4 py-2 ${themeClasses.button} rounded-lg transition-colors duration-200`}
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

          {/* <div className={`mt-4 text-sm ${themeClasses.textMuted}`}>
            Total rooms: {viewMode === "public" ? publicRooms.length : myRooms.length} | 
            Filtered: {filteredRooms.length} | Mode: {selectedMode}
          </div> */}
        </div>

        {/* Rooms Section with Toggle */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
          {/* Toggle and Title Container */}
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${themeClasses.text}`}>
              {viewMode === "public" ? "Discover Rooms" : "My Rooms"}
              <span className={`ml-2 text-sm ${themeClasses.textSecondary}`}>
                ({filteredRooms.length} rooms available)
              </span>
            </h2>
            
            {/* Toggle Switch */}
            <div className={`flex items-center gap-3 ${themeClasses.cardBg} backdrop-blur-sm rounded-full p-1`}>
              <button
                onClick={() => handleViewToggle("public")}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  viewMode === "public"
                    ? themeClasses.toggleActive + " text-white"
                    : themeClasses.toggleInactive
                }`}
              >
                Public Rooms
              </button>
              <button
                onClick={() => handleViewToggle("my")}
                className={`px-4 py-2 rounded-full transition-all duration-200 ${
                  viewMode === "my"
                    ? themeClasses.toggleActive + " text-white"
                    : themeClasses.toggleInactive
                }`}
              >
                My Rooms
              </button>
            </div>
          </div>

          {/* Scrollable container */}
          <div
            className={`overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin ${themeClasses.scrollbar} rounded-lg`}
            onWheel={(e) => handleScrollBubble(e)}
          >
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <RoomCardSkeleton key={i} theme={themeClasses} />
                ))}
              </div>
            ) : filteredRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredRooms.map((room) => (
                  <HoverExpandCard key={room.roomId}>
      <RoomCard room={room} isOwned={viewMode === "my"} />
    </HoverExpandCard>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className={themeClasses.textSecondary}>
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
export function RoomCardSkeleton({ theme }: { theme: any }) {
  return (
    <div className={`${theme.cardBg} rounded-xl h-64 animate-pulse backdrop-blur-sm`}>
      <div className={`h-32 ${theme.skeletonBg}`}></div>
      <div className="p-4 space-y-3">
        <div className={`h-5 ${theme.skeletonBg} rounded w-3/4`}></div>
        <div className={`h-4 ${theme.skeletonBg} rounded w-full`}></div>
        <div className={`h-4 ${theme.skeletonBg} rounded w-1/2`}></div>
      </div>
    </div>
  );
}