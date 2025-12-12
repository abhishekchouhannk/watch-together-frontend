"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Plus } from "lucide-react";
import RoomCard from "@/components/dashboard/RoomCard";
import CreateRoomModal from "@/components/dashboard/CreateRoomModal";
import SearchBar from "@/components/dashboard/SearchBar";
import RoomFilters from "@/components/dashboard/RoomFilters";
import { Room, RoomMode } from "@/components/dashboard/types/room";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LogoutButton from "@/components/auth/LogoutButton";
import { useTheme } from "@/hooks/useTheme";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

// Memoized Skeleton Component - prevents unnecessary re-renders
const RoomCardSkeleton = memo(function RoomCardSkeleton({ 
  skeletonBg, 
  cardBg 
}: { 
  skeletonBg: string; 
  cardBg: string;
}) {
  return (
    <div className={`${cardBg} rounded-xl h-64 animate-pulse backdrop-blur-sm`}>
      <div className={`h-32 ${skeletonBg}`}></div>
      <div className="p-4 space-y-3">
        <div className={`h-5 ${skeletonBg} rounded w-3/4`}></div>
        <div className={`h-4 ${skeletonBg} rounded w-full`}></div>
        <div className={`h-4 ${skeletonBg} rounded w-1/2`}></div>
      </div>
    </div>
  );
});

// Memoized Room Grid to prevent re-renders during scroll
const RoomGrid = memo(function RoomGrid({ 
  rooms, 
  isOwned 
}: { 
  rooms: Room[]; 
  isOwned: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {rooms.map((room) => (
        <RoomCard
          key={room.roomId}
          room={room}
          isOwned={isOwned}
        />
      ))}
    </div>
  );
});

export default function Dashboard() {
  const theme = useTheme();
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<RoomMode | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"public" | "my">("public");

  // ✅ Memoize theme classes - only recalculates when theme.name changes
  const themeClasses = useMemo(() => {
    const baseClasses = {
      morning: {
        bg: "bg-gradient-to-b from-pink-100/50 to-rose-100/30",
        headerBg: "bg-rose-300/30 backdrop-blur-md",
        border: "border-pink-300/60",
        cardBg: "bg-white/30 backdrop-blur-lg",
        skeletonBg: "bg-pink-100/50",
        text: "text-pink-900",
        textSecondary: "text-rose-700",
        textMuted: "text-rose-600",
        button: "bg-rose-700 hover:bg-rose-800 text-white shadow-sm shadow-rose-300/60",
        buttonSecondary: "bg-pink-100 hover:bg-pink-200 text-pink-900",
        toggleActive: "bg-rose-700",
        toggleInactive: "text-rose-800 hover:text-rose-400",
        scrollbar: "scrollbar-thumb-rose-400 scrollbar-track-rose-200/40",
      },
      afternoon: {
        bg: "bg-sky-50/10",
        headerBg: "bg-sky-900/20",
        border: "border-sky-800/30",
        cardBg: "bg-sky-800/20",
        skeletonBg: "bg-sky-700/10",
        text: "text-sky-100",
        textSecondary: "text-sky-300",
        textMuted: "text-sky-400",
        button: "bg-yellow-400 hover:bg-yellow-500 text-sky-900",
        buttonSecondary: "bg-sky-700 hover:bg-sky-600 text-sky-100",
        toggleActive: "bg-yellow-400 text-sky-900",
        toggleInactive: "text-sky-300 hover:text-sky-200",
        scrollbar: "scrollbar-thumb-sky-700 scrollbar-track-sky-900/20",
      },
      evening: {
        bg: "bg-purple-50/10",
        headerBg: "bg-purple-900/20",
        border: "border-purple-800/30",
        cardBg: "bg-purple-800/20",
        skeletonBg: "bg-purple-700/10",
        text: "text-purple-100",
        textSecondary: "text-purple-300",
        textMuted: "text-purple-400",
        button: "bg-purple-600 hover:bg-purple-700 text-white",
        buttonSecondary: "bg-purple-700 hover:bg-purple-600 text-purple-100",
        toggleActive: "bg-purple-600",
        toggleInactive: "text-purple-300 hover:text-purple-200",
        scrollbar: "scrollbar-thumb-purple-700 scrollbar-track-purple-900/20",
      },
      night: {
        bg: "bg-indigo-50/10",
        headerBg: "bg-indigo-900/30",
        border: "border-indigo-800/30",
        cardBg: "bg-indigo-800/20",
        skeletonBg: "bg-indigo-700/10",
        text: "text-indigo-100",
        textSecondary: "text-indigo-300",
        textMuted: "text-indigo-400",
        button: "bg-indigo-500 hover:bg-indigo-600 text-white",
        buttonSecondary: "bg-indigo-700 hover:bg-indigo-600 text-indigo-100",
        toggleActive: "bg-indigo-500",
        toggleInactive: "text-indigo-300 hover:text-indigo-200",
        scrollbar: "scrollbar-thumb-indigo-700 scrollbar-track-indigo-900/20",
      },
    };
    return baseClasses[theme.name as keyof typeof baseClasses] || baseClasses.night;
  }, [theme.name]); // Only depends on theme name, not entire theme object

  // ✅ CRITICAL FIX: Use useMemo instead of state + useEffect for filtered rooms
  const filteredRooms = useMemo(() => {
    const currentRooms = viewMode === "public" ? publicRooms : myRooms;

    if (!currentRooms || currentRooms.length === 0) {
      return [];
    }

    let filtered = currentRooms;

    // Filter by mode
    if (selectedMode !== "all") {
      filtered = filtered.filter((room) => room.mode === selectedMode);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (room) =>
          room.roomName.toLowerCase().includes(lowerQuery) ||
          room.description?.toLowerCase().includes(lowerQuery) ||
          room.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    }

    return filtered;
  }, [publicRooms, myRooms, viewMode, selectedMode, searchQuery]);

  // ✅ Memoize fetchRooms to prevent recreation
  const fetchRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      const [myRoomsRes, publicRoomsRes] = await Promise.all([
        fetch(`${SERVER_URL}/api/rooms/my-rooms`, { credentials: "include" }),
        fetch(`${SERVER_URL}/api/rooms/public`, { credentials: "include" }),
      ]);

      if (!publicRoomsRes.ok) {
        throw new Error("Failed to fetch public rooms");
      }

      const myRoomsData = myRoomsRes.ok ? await myRoomsRes.json() : { rooms: [] };
      const publicRoomsData = await publicRoomsRes.json();

      setMyRooms(myRoomsData.rooms || []);
      setPublicRooms(publicRoomsData.rooms || []);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setPublicRooms([]);
      setMyRooms([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // ✅ Memoize all event handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleModeFilter = useCallback((mode: RoomMode | "all") => {
    setSelectedMode(mode);
  }, []);

  const handleViewToggle = useCallback((view: "public" | "my") => {
    setViewMode(view);
    setSelectedMode("all");
    setSearchQuery("");
  }, []);

  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {/* Header */}
        <header
          className={`sticky top-0 z-40 backdrop-blur-lg ${themeClasses.headerBg} border-b ${themeClasses.border}`}
        >
          <div className="relative">
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <LogoutButton />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <h1 className={`text-2xl font-bold ${themeClasses.text}`}>
                  Welcome back! 👋
                </h1>
                <button
                  onClick={openCreateModal}
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
        </div>

        {/* Rooms Section with Toggle */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${themeClasses.text}`}>
              {viewMode === "public" ? "Discover Rooms" : "My Rooms"}
              <span className={`ml-2 text-sm ${themeClasses.textSecondary}`}>
                ({filteredRooms.length} rooms available)
              </span>
            </h2>

            <div
              className={`flex items-center gap-3 ${themeClasses.cardBg} backdrop-blur-sm rounded-full p-1`}
            >
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

          {/* ✅ Scrollable container - Use CSS for scroll containment, removed JS handler */}
          <div
            className={`overflow-y-auto max-h-[60vh] pr-2 scrollbar-thin ${themeClasses.scrollbar} rounded-lg overscroll-contain`}
            style={{ willChange: 'scroll-position' }}
          >
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <RoomCardSkeleton 
                    key={i} 
                    skeletonBg={themeClasses.skeletonBg}
                    cardBg={themeClasses.cardBg}
                  />
                ))}
              </div>
            ) : filteredRooms.length > 0 ? (
              <RoomGrid rooms={filteredRooms} isOwned={viewMode === "my"} />
            ) : (
              <div className="text-center py-12">
                <p className={themeClasses.textSecondary}>
                  {viewMode === "my"
                    ? "You haven't created any rooms yet"
                    : selectedMode !== "all"
                    ? `No ${selectedMode} rooms found`
                    : "No rooms found matching your criteria"}
                </p>
              </div>
            )}
          </div>
        </section>

        <CreateRoomModal
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onRoomCreated={fetchRooms}
        />
      </div>
    </ProtectedRoute>
  );
}

export { RoomCardSkeleton };