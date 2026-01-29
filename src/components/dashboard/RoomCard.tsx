// components/dashboard/RoomCard.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  ArrowRight,
  Users,
  Lock,
  Unlock,
  Crown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Room } from "./types/room";
import { useCurrentTheme } from "@/hooks/useCurrentTheme";

interface RoomCardProps {
  room: Room;
  isOwned?: boolean;
}

function prefersDesktopPointer() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  try {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  } catch {
    return false;
  }
}

function RoomCardInner({ room, isOwned = false }: RoomCardProps) {
  const theme = useCurrentTheme();
  const router = useRouter();

  const [isDetailsMode, setIsDetailsMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hoverPlayTimeout = useRef<number | null>(null);

  const canAutoplayOnHover = useMemo(() => prefersDesktopPointer(), []);

  const themeClasses = useMemo(() => {
    const base = {
      cardBg: "bg-white/6 backdrop-blur-sm",
      cardBorder: "border-gray-200/10",
      headerBg: "bg-gray-800/10",
      text: "text-white",
      textMuted: "text-gray-300",
      buttonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white",
      buttonGhost: "bg-transparent border",
      adminBadge: "bg-yellow-400/20 text-yellow-300",
    };

    return {
      ...base,
      ...(theme
        ? theme.buttonPrimary
          ? { buttonPrimary: theme.buttonPrimary }
          : {}
        : {}),
    };
  }, [theme]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsVideoReady(true);
    video.addEventListener("canplay", handleCanPlay);
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovered && canAutoplayOnHover && room.video?.url) {
      hoverPlayTimeout.current = window.setTimeout(() => {
        video.play().catch(() => {});
        setIsPreviewPlaying(true);
      }, 180);
    } else {
      if (hoverPlayTimeout.current) {
        clearTimeout(hoverPlayTimeout.current);
        hoverPlayTimeout.current = null;
      }
      video.pause();
      try {
        video.currentTime = 0;
      } catch {}
      setIsPreviewPlaying(false);
    }
    return () => {
      if (hoverPlayTimeout.current) {
        clearTimeout(hoverPlayTimeout.current);
        hoverPlayTimeout.current = null;
      }
    };
  }, [isHovered, canAutoplayOnHover, room.video?.url]);

  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);
  const handleToggleDetails = useCallback(
    () => setIsDetailsMode((s) => !s),
    [],
  );

  const handleJoin = useCallback(() => {
    router.push(`/room/${room.roomId}`);
  }, [router, room.roomId]);

  const handlePreviewClick = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isPreviewPlaying) {
      v.pause();
      setIsPreviewPlaying(false);
      try {
        v.currentTime = 0;
      } catch {}
    } else {
      v.play().catch(() => {});
      setIsPreviewPlaying(true);
    }
  }, [isPreviewPlaying]);

  const modeBadge = useMemo(() => {
    const colors: Record<string, string> = {
      casual: "bg-green-600/20 text-green-300 border-green-600/40",
      entertainment: "bg-purple-600/20 text-purple-300 border-purple-600/40",
      gaming: "bg-red-600/20 text-red-300 border-red-600/40",
      study: "bg-blue-600/20 text-blue-300 border-blue-600/40",
    };
    return colors[room.mode] || colors.casual;
  }, [room.mode]);

  return (
    <div
      className={`rounded-xl overflow-hidden border ${themeClasses.cardBorder} ${themeClasses.cardBg} shadow-sm flex flex-col`}
      style={{ minHeight: isDetailsMode ? "auto" : "280px" }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {!isDetailsMode ? (
        <>
          {/* Thumbnail / Video header — fixed height, no shrink */}
          <div
            className={`relative h-36 flex-shrink-0 ${themeClasses.headerBg} w-full overflow-hidden`}
          >
            {room.video?.url ? (
              <video
                ref={videoRef}
                src={room.video.url}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-800/20">
                {room.thumbnail ? (
                  <img
                    src={room.thumbnail}
                    alt={room.roomName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-4xl">
                    {room.mode === "gaming"
                      ? "🎮"
                      : room.mode === "study"
                        ? "📚"
                        : "🎬"}
                  </div>
                )}
              </div>
            )}

            {/* Mode badge + LIVE indicator — constrained to not overflow */}
            <div className="absolute top-2 left-2 flex gap-1.5 z-10 max-w-[calc(100%-2rem)] overflow-hidden">
              <span
                className={`px-2 py-0.5 text-xs rounded-full border whitespace-nowrap flex-shrink-0 ${modeBadge}`}
              >
                {room.mode}
              </span>
              {room.video?.isPlaying && (
                <span className="px-2 py-0.5 text-xs bg-red-600/80 text-white rounded-full flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                  <Play size={10} />
                  LIVE
                </span>
              )}
            </div>

            {/* Privacy icon — pinned top-right */}
            <div className="absolute top-2 right-2 z-10">
              {room.isPublic ? (
                <Unlock size={16} className="text-white/80" />
              ) : (
                <Lock size={16} className="text-white/80" />
              )}
            </div>

            {/* Admin badge — pinned bottom-right, horizontal layout */}
            {isOwned && (
              <div
                className={`absolute bottom-2 right-2 z-10 ${themeClasses.adminBadge} px-2 py-0.5 rounded-full text-xs flex items-center gap-1 whitespace-nowrap`}
              >
                <Crown size={12} />
                <span>Admin</span>
              </div>
            )}
          </div>

          {/* Content body — grows to fill remaining card height */}
          <div className="p-4 flex flex-col flex-1 min-w-0">
            {/* Title */}
            <h3
              className={`text-lg font-semibold truncate ${themeClasses.text}`}
            >
              {room.roomName}
            </h3>

            {/* Description — exactly 2 lines, then clips */}
            <p
              className={`text-sm mt-1 line-clamp-2 ${themeClasses.textMuted}`}
            >
              {room.description || "No description"}
            </p>

            {/* Spacer: pushes the bottom row to the card's base */}
            <div className="flex-1" />

            {/* Bottom row: participants + tags on left, actions on right */}
            <div className="flex items-center justify-between gap-2 mt-3">
              {/* Left group: participants count, then scrollable tag strip */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Participant count — never shrinks */}
                <div className="flex items-center gap-1 text-xs text-gray-300 flex-shrink-0 whitespace-nowrap">
                  <Users size={14} />
                  <span>
                    {room.participants.length}/{room.maxParticipants}
                  </span>
                </div>

                {/* Tags — scroll horizontally if too many, clip at container edge */}
                <div
                  className="flex gap-1 overflow-x-auto flex-1"
                  style={{ scrollbarWidth: "none" }}
                >
                  {(room.tags || []).slice(0, 4).map((t, i) => (
                    <span
                      key={`${room.roomId}-tag-${i}`}
                      className="text-xs px-2 py-0.5 rounded bg-gray-700/30 whitespace-nowrap flex-shrink-0 text-gray-300"
                    >
                      {`#${t}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right group: action buttons — never shrink, never wrap */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {!canAutoplayOnHover && room.video?.url && (
                  <button
                    onClick={handlePreviewClick}
                    className="p-1.5 rounded border border-gray-600/40 hover:bg-gray-700/20 transition-colors"
                    aria-pressed={isPreviewPlaying}
                    title="Preview"
                  >
                    <Play size={14} className="text-gray-300" />
                  </button>
                )}

                <button
                  onClick={handleJoin}
                  title="Join Room"
                  className="p-1.5 rounded border border-gray-600/40 hover:bg-gray-700/20 transition-colors"
                >
                  <ArrowRight size={16} className="text-gray-300" />
                </button>

                <button
                  onClick={handleToggleDetails}
                  className="p-1.5 rounded border border-gray-600/40 hover:bg-gray-700/20 transition-colors"
                  title="More details"
                >
                  <ChevronDown size={16} className="text-gray-300" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* DETAILS VIEW — replaces card content in-place */
        <div className="flex flex-col flex-1 min-w-0">
          {/* Details header: keep the thumbnail small but present */}
          <div
            className={`relative h-24 flex-shrink-0 ${themeClasses.headerBg} w-full overflow-hidden`}
          >
            {room.video?.url ? (
              <video
                src={room.video.url}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                muted
                loop
                playsInline
                controls={false}
                preload="metadata"
              />
            ) : room.thumbnail ? (
              <img
                src={room.thumbnail}
                alt={room.roomName}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800/20">
                <div className="text-3xl opacity-60">
                  {room.mode === "gaming"
                    ? "🎮"
                    : room.mode === "study"
                      ? "📚"
                      : "🎬"}
                </div>
              </div>
            )}

            {/* Overlay gradient so text below is readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />

            {/* Mode badge positioned at bottom-left of this header */}
            <div className="absolute bottom-2 left-3 z-10">
              <span
                className={`px-2 py-0.5 text-xs rounded-full border ${modeBadge}`}
              >
                {room.mode}
              </span>
            </div>

            {/* Close/back chevron at top-right */}
            <button
              onClick={handleToggleDetails}
              className="absolute top-2 right-2 z-10 p-1 rounded hover:bg-gray-700/30 transition-colors"
              title="Close details"
            >
              <ChevronUp size={16} className="text-white/80" />
            </button>
          </div>

          {/* Details body */}
          <div className="p-4 flex flex-col gap-3 min-w-0">
            {/* Title */}
            <h3
              className={`text-lg font-semibold truncate ${themeClasses.text}`}
            >
              {room.roomName}
            </h3>

            {/* Description — no line-clamp here, show full text */}
            <p className={`text-sm leading-relaxed ${themeClasses.textMuted}`}>
              {room.description || "No description"}
            </p>

            {/* Meta row: participants + privacy */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-300">
                <Users size={15} />
                <span>
                  {room.participants.length} / {room.maxParticipants} members
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-400 text-xs">
                {room.isPublic ? (
                  <>
                    <Unlock size={13} />
                    <span>Public</span>
                  </>
                ) : (
                  <>
                    <Lock size={13} />
                    <span>Private</span>
                  </>
                )}
              </div>
              {isOwned && (
                <div
                  className={`flex items-center gap-1 text-xs ${themeClasses.adminBadge} px-2 py-0.5 rounded-full`}
                >
                  <Crown size={12} />
                  <span>Admin</span>
                </div>
              )}
            </div>

            {/* Tags — wrapping grid so they never overflow */}
            {room.tags && room.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {room.tags.map((t, i) => (
                  <span
                    key={`${room.roomId}-detail-tag-${i}`}
                    className="text-xs px-2.5 py-0.5 rounded-full bg-gray-700/30 text-gray-300"
                  >
                    {`#${t}`}
                  </span>
                ))}
              </div>
            )}

            {/* Action: Join button — full width at the bottom */}
            <div className="mt-auto pt-2">
              <button
                onClick={handleJoin}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${themeClasses.buttonPrimary}`}
              >
                <ArrowRight size={16} />
                Join Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(RoomCardInner);
