"use client";

import React from "react";

interface PixelFaceProps {
  state: "neutral" | "success" | "error"; // neutral (poker face), success (smile), error (sad)
}

const PixelFace: React.FC<PixelFaceProps> = ({ state }) => {
  // Determine colors based on state
  const faceColor = state === "error" ? "#8B0000" : "#000000";
  const bgClass = state === "error" ? "bg-red-500/10" : state === "success" ? "bg-green-500/10" : "bg-transparent";
  const animationClass = state === "error" ? "animate-vibrate" : "";

  // Render mouth based on state
  const renderMouth = () => {
    if (state === "success") {
      // Smiley face - curved upward smile
      return (
        <>
          {/* Left side of smile (going up) */}
          <rect x="24" y="52" width="4" height="4" fill={faceColor} />
          <rect x="28" y="50" width="4" height="4" fill={faceColor} />
          {/* Middle of smile */}
          <rect x="32" y="50" width="4" height="4" fill={faceColor} />
          <rect x="36" y="50" width="4" height="4" fill={faceColor} />
          <rect x="40" y="50" width="4" height="4" fill={faceColor} />
          <rect x="44" y="50" width="4" height="4" fill={faceColor} />
          {/* Right side of smile (going up) */}
          <rect x="48" y="50" width="4" height="4" fill={faceColor} />
          <rect x="52" y="52" width="4" height="4" fill={faceColor} />
        </>
      );
    } else if (state === "error") {
      // Sad face - curved downward frown
      return (
        <>
          {/* Left side of frown (going down) */}
          <rect x="24" y="50" width="4" height="4" fill={faceColor} />
          <rect x="28" y="52" width="4" height="4" fill={faceColor} />
          {/* Middle of frown */}
          <rect x="32" y="54" width="4" height="4" fill={faceColor} />
          <rect x="36" y="54" width="4" height="4" fill={faceColor} />
          <rect x="40" y="54" width="4" height="4" fill={faceColor} />
          <rect x="44" y="54" width="4" height="4" fill={faceColor} />
          {/* Right side of frown (going down) */}
          <rect x="48" y="52" width="4" height="4" fill={faceColor} />
          <rect x="52" y="50" width="4" height="4" fill={faceColor} />
        </>
      );
    } else {
      // Neutral face - straight line (poker face)
      return (
        <>
          <rect x="28" y="52" width="8" height="4" fill={faceColor} />
          <rect x="36" y="52" width="8" height="4" fill={faceColor} />
          <rect x="44" y="52" width="8" height="4" fill={faceColor} />
        </>
      );
    }
  };

  return (
    <div
      className={`
        relative w-24 h-24 flex items-center justify-center rounded-lg
        transition-all duration-300
        ${bgClass} ${animationClass}
      `}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-300"
      >
        {/* Face outline - pixelated circle */}
        <rect x="24" y="8" width="32" height="8" fill={faceColor} />
        <rect x="16" y="16" width="8" height="8" fill={faceColor} />
        <rect x="56" y="16" width="8" height="8" fill={faceColor} />
        <rect x="8" y="24" width="8" height="32" fill={faceColor} />
        <rect x="64" y="24" width="8" height="32" fill={faceColor} />
        <rect x="16" y="56" width="8" height="8" fill={faceColor} />
        <rect x="56" y="56" width="8" height="8" fill={faceColor} />
        <rect x="24" y="64" width="32" height="8" fill={faceColor} />

        {/* Left eye */}
        <rect x="24" y="28" width="8" height="8" fill={faceColor} />
        <rect x="24" y="36" width="8" height="8" fill={faceColor} />

        {/* Right eye */}
        <rect x="48" y="28" width="8" height="8" fill={faceColor} />
        <rect x="48" y="36" width="8" height="8" fill={faceColor} />

        {/* Nose */}
        <rect x="36" y="40" width="8" height="8" fill={faceColor} />

        {/* Mouth - changes based on state */}
        {renderMouth()}
      </svg>
    </div>
  );
};

export default PixelFace;