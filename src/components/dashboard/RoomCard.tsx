"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Room } from "./types/room";
import { Users, Lock, Unlock, Play, ArrowRight, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/hooks/useTheme";

interface RoomCardProps {
  room: Room;
  isOwned?: boolean;
}

export default function RoomCard({ room, isOwned = false }: RoomCardProps) {
  const theme = useTheme();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [expandDirection, setExpandDirection] = useState<"down" | "right">(
    "down"
  );
  const [isScrolling, setIsScrolling] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Theme-specific classes
  const getThemeClasses = () => {
    const baseClasses = {
      morning: {
        cardBg: "bg-white/30",
        cardBorder: "border-pink-300/70 hover:border-rose-400/80",
        headerBg: "bg-gradient-to-br from-rose-400/10 to-pink-400/30",
        text: "text-rose-900",
        textSecondary: "text-pink-900",
        textMuted: "text-rose-800/80",
        shadow: "shadow-pink-200/60",
        button:
          "bg-rose-400 hover:bg-rose-500 text-white shadow-md shadow-rose-200/40",
        buttonIcon: "text-rose-500 hover:text-rose-600",
        tagBg: "bg-rose-300/60",
        tagText: "text-stone-800",
        divider: "border-pink-200",
        videoBg: "bg-white/40",
        participantBg: "from-rose-300 to-pink-200",
        participantBorder: "border-rose-400",
        adminBadge: "bg-rose-400/30 text-rose-800 font-semibold",
      },
      afternoon: {
        cardBg: "bg-sky-800/20",
        cardBorder: "border-sky-700/50 hover:border-yellow-400/50",
        headerBg: "bg-gradient-to-br from-sky-600/20 to-yellow-600/20",
        text: "text-sky-900 dark:text-sky-100",
        textSecondary: "text-sky-700 dark:text-sky-300",
        textMuted: "text-sky-600 dark:text-sky-400",
        shadow: "shadow-yellow-500/20",
        button: theme.buttonPrimary,
        buttonIcon: "text-yellow-400 hover:text-yellow-300",
        tagBg: "bg-sky-700/50",
        tagText: "text-sky-200",
        divider: "border-sky-700",
        videoBg: "bg-black/70",
        participantBg: "from-sky-400 to-blue-400",
        participantBorder: "border-sky-900",
        adminBadge: "bg-yellow-400/30 text-yellow-300",
      },
      evening: {
        cardBg: "bg-purple-800/20",
        cardBorder: "border-purple-700/50 hover:border-purple-500/50",
        headerBg: "bg-gradient-to-br from-purple-600/20 to-pink-600/20",
        text: "text-purple-900 dark:text-purple-100",
        textSecondary: "text-purple-700 dark:text-purple-300",
        textMuted: "text-purple-600 dark:text-purple-400",
        shadow: "shadow-purple-500/20",
        button: theme.buttonPrimary,
        buttonIcon: "text-purple-400 hover:text-purple-300",
        tagBg: "bg-purple-700/50",
        tagText: "text-purple-200",
        divider: "border-purple-700",
        videoBg: "bg-black/70",
        participantBg: "from-purple-400 to-pink-400",
        participantBorder: "border-purple-900",
        adminBadge: "bg-yellow-500/20 text-yellow-400",
      },
      night: {
        cardBg: "bg-indigo-800/20",
        cardBorder: "border-indigo-700/50 hover:border-indigo-500/50",
        headerBg: "bg-gradient-to-br from-indigo-600/20 to-blue-600/20",
        text: "text-white",
        textSecondary: "text-indigo-300",
        textMuted: "text-indigo-400",
        shadow: "shadow-indigo-500/20",
        button: theme.buttonPrimary,
        buttonIcon: "text-indigo-400 hover:text-indigo-300",
        tagBg: "bg-indigo-700/50",
        tagText: "text-indigo-200",
        divider: "border-indigo-700",
        videoBg: "bg-black/70",
        participantBg: "from-indigo-400 to-blue-400",
        participantBorder: "border-indigo-900",
        adminBadge: "bg-yellow-500/20 text-yellow-400",
      },
    };

    return baseClasses[theme.name as keyof typeof baseClasses];
  };

  const themeClasses = getThemeClasses();

  // Detect scrolling in parent container
  useEffect(() => {
    const scrollContainer = cardRef.current?.closest(".overflow-y-auto");

    const handleScroll = () => {
      if (isHovered) {
        resetHoverState();
      }

      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll, {
        passive: true,
      });
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [isHovered]);

  // Global mouse tracking for detecting when mouse leaves the expanded card area
  useEffect(() => {
    if (!isHovered || !rect) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!rect) return;

      let isOutside = false;

      if (expandDirection === "down") {
        isOutside =
          e.clientX < rect.left - 20 ||
          e.clientX > rect.right + 20 ||
          e.clientY < rect.top - 20 ||
          e.clientY > rect.bottom + 270;
      } else {
        isOutside =
          e.clientX < rect.left - 20 ||
          e.clientX > rect.right + rect.width + 30 ||
          e.clientY < rect.top - 20 ||
          e.clientY > rect.bottom + 20;
      }

      if (isOutside) {
        resetHoverState();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovered, rect, expandDirection]);

  const resetHoverState = () => {
    setIsHovered(false);
    setIsExpanded(false);
    setRect(null);

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleMouseEnter = () => {
    if (isScrolling) return;

    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      setRect(cardRect);
      setIsHovered(true);

      // Calculate expansion direction
      const estimatedExpandedHeight = cardRect.height + 250;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - cardRect.bottom;

      if (spaceBelow < estimatedExpandedHeight - cardRect.height) {
        setExpandDirection("right");
      } else {
        setExpandDirection("down");
      }

      // Start expansion after delay
      hoverTimeoutRef.current = setTimeout(() => {
        setIsExpanded(true);
        if (videoRef.current && room.video?.url) {
          videoRef.current.play();
        }
      }, 500);
    }
  };

  const handleWheel = () => {
    if (isHovered) {
      resetHoverState();
    }
  };

  const handleJoinRoom = () => {
    router.push(`/room/${room.roomId}`);
  };

  const getModeColor = (mode: string) => {
    const colors = {
      casual: "bg-green-500/20 text-green-400 border-green-500/50",
      entertainment: "bg-purple-500/20 text-purple-400 border-purple-500/50",
      gaming: "bg-red-500/20 text-stone-400 border-red-500/50",
      study: "bg-blue-500/20 text-blue-400 border-blue-500/50",
    };
    return colors[mode as keyof typeof colors] || colors.casual;
  };

  // The actual card content
  const CardContent = ({
    showExpanded = false,
  }: {
    showExpanded?: boolean;
  }) => (
    <div
      className={`${
        themeClasses.cardBg
      } backdrop-blur-sm rounded-xl overflow-hidden border 
                 ${themeClasses.cardBorder} transition-all duration-300
                 ${
                   showExpanded && isExpanded && expandDirection === "right"
                     ? "flex"
                     : ""
                 }
                 ${showExpanded && isExpanded ? "h-auto" : "h-64"}
                 ${
                   showExpanded
                     ? `shadow-2xl ${themeClasses.shadow}`
                     : "shadow-lg"
                 }`}
    >
      {/* Main Card Content */}
      {/* Main Card Content */}
<div
  className={`${
    showExpanded && isExpanded && expandDirection === "right"
      ? "flex-shrink-0"
      : "w-full"
  }`}
  style={
    showExpanded && isExpanded && expandDirection === "right"
      ? { width: `${rect?.width || 0}px` }
      : undefined
  }
>
        {/* Room Header */}
        <div className={`relative h-32 ${themeClasses.headerBg}`}>
          {room.thumbnail ? (
            <img
              src={room.thumbnail}
              alt={room.roomName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-4xl">
                {room.mode === "gaming"
                  ? "🎮"
                  : room.mode === "study"
                  ? "📚"
                  : "🎬"}
              </div>
            </div>
          )}

          {/* Status Indicators */}
          <div className="absolute top-2 left-2 flex gap-2">
            <span
              className={`px-2 py-1 text-xs rounded-full border ${getModeColor(
                room.mode
              )}`}
            >
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
            {room.isPublic ? (
              <Unlock size={16} className="text-white/70" />
            ) : (
              <Lock size={16} className="text-white/70" />
            )}
          </div>

          {/* Owner Badge */}
          {isOwned && (
            <div
              className={`absolute bottom-2 right-2 ${themeClasses.adminBadge} px-2 py-1 rounded-full flex items-center gap-1`}
            >
              <Crown size={12} />
              <span className="text-xs">Admin</span>
            </div>
          )}
        </div>

        {/* Room Info */}
        <div className="p-4">
          <h3
            className={`text-lg font-semibold ${themeClasses.text} mb-1 truncate`}
          >
            {room.roomName}
          </h3>
          <p className={`text-sm ${themeClasses.textMuted} mb-3 line-clamp-2`}>
            {room.description || "No description"}
          </p>

          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-2 ${themeClasses.textMuted}`}
            >
              <Users size={16} />
              <span className="text-sm">
                {room.participants.length}/{room.maxParticipants}
              </span>
            </div>

            {!(showExpanded && isExpanded) && (
              <button
                onClick={handleJoinRoom}
                className={`${themeClasses.buttonIcon} transition-colors`}
              >
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Preview Section - Downward */}
      {showExpanded && isExpanded && expandDirection === "down" && (
        <div className={`border-t ${themeClasses.divider} animate-slideDown`}>
          <ExpandedContent />
        </div>
      )}

      {/* Right-side expanded content */}
      {showExpanded && isExpanded && expandDirection === "right" && (
        <div
          className={`w-1/2 border-l ${themeClasses.divider} animate-slideRight`}
        >
          <ExpandedContent />
        </div>
      )}
    </div>
  );

  // Expanded content component
  const ExpandedContent = () => (
    <>
      {/* Video Preview */}
      {room.video?.url && (
        <div
          className={`relative ${
            expandDirection === "right" ? "h-32" : "h-48"
          } bg-black`}
        >
          <video
            ref={videoRef}
            src={room.video.url}
            className="w-full h-full object-contain"
            muted
            loop
          />
          <div
            className={`absolute bottom-2 left-2 ${themeClasses.videoBg} px-2 py-1 rounded`}
          >
            <span className="text-xs text-white">
              {room.video.isPlaying ? "Currently Playing" : "Paused"}
            </span>
          </div>
        </div>
      )}

      {/* Participants Preview */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className={`text-sm font-medium ${themeClasses.textSecondary}`}>
            Active Participants
          </h4>
        </div>

        <div className="flex -space-x-2">
          {room.participants.slice(0, 5).map((participant) => (
            <div
              key={participant.userId}
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${themeClasses.participantBg} 
                       flex items-center justify-center text-xs text-white font-semibold
                       border-2 ${themeClasses.participantBorder}`}
              title={participant.username}
            >
              {participant.username[0].toUpperCase()}
            </div>
          ))}
          {room.participants.length > 5 && (
            <div
              className={`w-8 h-8 rounded-full ${themeClasses.cardBg} flex items-center justify-center 
                          text-xs ${themeClasses.textSecondary} border-2 ${themeClasses.participantBorder}`}
            >
              +{room.participants.length - 5}
            </div>
          )}
        </div>

        {/* Tags */}
        {room.tags && room.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {room.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-1 ${themeClasses.tagBg} ${themeClasses.tagText} rounded`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={handleJoinRoom}
            className={`flex-1 py-2 ${themeClasses.button} 
                     rounded-lg transition-colors duration-200 text-sm font-medium`}
          >
            Join Room
          </button>
          <button
            className={`px-3 py-2 ${themeClasses.cardBg} ${themeClasses.buttonIcon} 
                     rounded-lg transition-colors duration-200 border ${themeClasses.cardBorder}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            ⭐
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Placeholder card (keeps layout intact) */}
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onWheel={handleWheel}
        className="relative"
      >
        {isHovered ? (
          <div className="invisible h-64 w-full">
            <CardContent showExpanded={false} />
          </div>
        ) : (
          <CardContent showExpanded={false} />
        )}
      </div>

      {/* Floating expanded card (in portal) */}
    {/* Floating expanded card (in portal) */}
{isHovered &&
  rect &&
  createPortal(
    <motion.div
      onMouseLeave={resetHoverState}
      onWheel={handleWheel}
      initial={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        position: "fixed",
        zIndex: 50,
      }}
      animate={{
        top: rect.top - 5,
        left: rect.left - (expandDirection === "right" && isExpanded ? 5 : 0),
        width:
          expandDirection === "right" && isExpanded
            ? rect.width * 2
            : rect.width + 10,
        scale: 1.01,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="rounded-xl overflow-visible pointer-events-auto"
    >
      <CardContent showExpanded={true} />
    </motion.div>,
    document.body
  )}
    </>
  );
}
