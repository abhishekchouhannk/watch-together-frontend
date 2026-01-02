// components/dashboard/RoomCard.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Play, ArrowRight, Users, Lock, Unlock, Crown } from "lucide-react";
import { Room } from "./types/room";
import { useTheme } from "@/hooks/useTheme";

/**
 * Lightweight, optimized RoomCard
 *
 * - No heavy expansion logic, no portal
 * - "View Details" toggles an in-place details view
 * - Video preview is mounted in-card; autoplay on hover ONLY when likely allowed (desktop),
 *   otherwise user must press "Preview" (controlled by the 'maybe' policy)
 * - Minimal effects and no global scroll/mouse listeners
 * - Exported as React.memo for stability
 */

interface RoomCardProps {
  room: Room;
  isOwned?: boolean;
}

function prefersDesktopPointer() {
  // best-effort check for pointer/hover capability (desktop-like)
  if (typeof window === "undefined" || !window.matchMedia) return false;
  try {
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  } catch {
    return false;
  }
}

function RoomCardInner({ room, isOwned = false }: RoomCardProps) {
  const theme = useTheme();
  const router = useRouter();

  // Card local UI state
  const [isDetailsMode, setIsDetailsMode] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hoverPlayTimeout = useRef<number | null>(null);

  // Decide autoplay behavior for the "maybe" policy:
  // - autoplay on hover for desktop-like devices (pointer: fine & hover: hover)
  // - on mobile/touch, require explicit Preview button
  const canAutoplayOnHover = useMemo(() => prefersDesktopPointer(), []);

  // Theme classes memoized (small mapping)
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

    // merge with useTheme output if needed (your useTheme provides colors)
    return {
      ...base,
      ...(theme ? (theme.buttonPrimary ? { buttonPrimary: theme.buttonPrimary } : {}) : {}),
    };
  }, [theme]);

  // Video: attach simple 'canplay' listener
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsVideoReady(true);
    video.addEventListener("canplay", handleCanPlay);
    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  // Play/pause preview on hover (only if autoplay allowed)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isHovered && canAutoplayOnHover && room.video?.url) {
      // small delay so micro-hovers don't trigger heavy work
      hoverPlayTimeout.current = window.setTimeout(() => {
        video.play().catch(() => {
          /* autoplay blocked — ignore */
        });
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
      } catch {
        /* ignore */
      }
      setIsPreviewPlaying(false);
    }
    // cleanup on unmount
    return () => {
      if (hoverPlayTimeout.current) {
        clearTimeout(hoverPlayTimeout.current);
        hoverPlayTimeout.current = null;
      }
    };
  }, [isHovered, canAutoplayOnHover, room.video?.url]);

  const handleEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleToggleDetails = useCallback(() => {
    setIsDetailsMode((s) => !s);
  }, []);

  const handleJoin = useCallback(() => {
    router.push(`/room/${room.roomId}`);
  }, [router, room.roomId]);

  const handlePreviewClick = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    // toggle play/pause
    if (isPreviewPlaying) {
      v.pause();
      setIsPreviewPlaying(false);
      try { v.currentTime = 0; } catch {}
    } else {
      v.play().catch(() => {});
      setIsPreviewPlaying(true);
    }
  }, [isPreviewPlaying]);

  // small helpers
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
      className={`rounded-xl overflow-hidden border ${themeClasses.cardBorder} ${themeClasses.cardBg} shadow-sm`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      // keep pointer events normal; virtualization/grid will handle layout
    >
      {/* CARD VIEW */}
      {!isDetailsMode ? (
        <>
          {/* header area: thumbnail / video */}
          <div className={`relative h-36 ${themeClasses.headerBg} w-full`}>
            {room.video?.url ? (
              // Video is always in the DOM for preview, but muted and small
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
              // Thumbnail fallback
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-800/20">
                {room.thumbnail ? (
                  <img src={room.thumbnail} alt={room.roomName} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="text-4xl">{room.mode === "gaming" ? "🎮" : room.mode === "study" ? "📚" : "🎬"}</div>
                )}
              </div>
            )}

            {/* overlays: mode, live, privacy, owner */}
            <div className="absolute top-2 left-2 flex gap-2 z-10">
              <span className={`px-2 py-1 text-xs rounded-full border ${modeBadge}`}>{room.mode}</span>
              {room.video?.isPlaying && (
                <span className="px-2 py-1 text-xs bg-red-600/80 text-white rounded-full flex items-center gap-1">
                  <Play size={10} />
                  LIVE
                </span>
              )}
            </div>

            <div className="absolute top-2 right-2 z-10">
              {room.isPublic ? <Unlock size={16} className="text-white/80" /> : <Lock size={16} className="text-white/80" />}
            </div>

            {isOwned && (
              <div className={`absolute bottom-2 right-2 z-10 ${themeClasses.adminBadge} px-2 py-1 rounded-full text-xs`}>
                <Crown size={12} />
                <span className="ml-1">Admin</span>
              </div>
            )}
          </div>

          {/* content */}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1 truncate">{room.roomName}</h3>
            <p className={`text-sm mb-3 line-clamp-2 ${themeClasses.textMuted}`}>{room.description || "No description"}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-xs text-gray-300">
                  <Users size={16} />
                  <span>{room.participants.length}/{room.maxParticipants}</span>
                </div>
                {/* tags preview (up to 3) */}
                <div className="flex gap-1">
                  {(room.tags || []).slice(0, 3).map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded bg-gray-700/30">{`#${t}`}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Preview button (for mobile/when autoplay is not allowed) */}
                {!canAutoplayOnHover && room.video?.url && (
                  <button
                    onClick={handlePreviewClick}
                    className="px-2 py-1 rounded border text-xs"
                    aria-pressed={isPreviewPlaying}
                    title="Preview"
                  >
                    <Play size={14} />
                  </button>
                )}

                <button onClick={handleJoin} title="Join" className="p-2 rounded hover:bg-gray-700/10">
                  <ArrowRight size={20} />
                </button>

                <button onClick={handleToggleDetails} className="px-3 py-1 rounded text-sm border">
                  Details
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* DETAILS VIEW (in-place replacement) */
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold mb-1">{room.roomName}</h3>
              <p className={`text-sm mb-3 ${themeClasses.textMuted}`}>{room.description || "No description"}</p>

              <div className="flex items-center gap-2 mb-3 text-sm">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{room.participants.length}/{room.maxParticipants}</span>
                </div>
                <div className="flex gap-1">
                  {(room.tags || []).map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded bg-gray-700/30">{`#${t}`}</span>
                  ))}
                </div>
              </div>

              {/* action buttons */}
              <div className="flex gap-2">
                <button onClick={handleJoin} className={`${themeClasses.buttonPrimary} px-4 py-2 rounded`}>
                  Join Room
                </button>
                <button onClick={handleToggleDetails} className="px-3 py-2 border rounded">
                  Back
                </button>
              </div>
            </div>

            {/* right column: larger preview area */}
            <div className="w-40 flex-shrink-0">
              {room.video?.url ? (
                <div className="w-full h-24 bg-black/40 overflow-hidden rounded">
                  <video
                    src={room.video.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    controls={false}
                    preload="metadata"
                  />
                </div>
              ) : (
                <div className="w-full h-24 bg-gray-800/20 rounded flex items-center justify-center">
                  {room.thumbnail ? <img src={room.thumbnail} alt={room.roomName} className="w-full h-full object-cover" /> : <div className="text-2xl">🎬</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// memoize export - prevents parent-caused re-renders when props are referentially equal
export default React.memo(RoomCardInner);