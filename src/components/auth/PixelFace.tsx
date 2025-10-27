"use client";

import React from "react";

interface PixelFaceProps {
  isError: boolean;
}

const PixelFace: React.FC<PixelFaceProps> = ({ isError }) => {

  const errorRed = "#8B0000";
  const normal = "#000000";

  return (
    <div
      className={`
        relative w-24 h-24 flex items-center justify-center rounded-lg
        transition-all duration-300
        ${isError ? "bg-red-500/10 animate-vibrate" : "bg-transparent"}
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
        <rect x="24" y="8" width="32" height="8" fill={isError ? errorRed : normal} />
        <rect x="16" y="16" width="8" height="8" fill={isError ? errorRed : normal} />
        <rect x="56" y="16" width="8" height="8" fill={isError ? errorRed : normal} />
        <rect x="8" y="24" width="8" height="32" fill={isError ? errorRed : normal} />
        <rect x="64" y="24" width="8" height="32" fill={isError ? errorRed : normal} />
        <rect x="16" y="56" width="8" height="8" fill={isError ? errorRed : normal} />
        <rect x="56" y="56" width="8" height="8" fill={isError ? errorRed : normal} />
        <rect x="24" y="64" width="32" height="8" fill={isError ? errorRed : normal} />

        {/* Left eye */}
        <rect x="24" y="28" width="8" height="8" fill={isError ? errorRed : normal} />
        <rect x="24" y="36" width="8" height="8" fill={isError ? errorRed : normal} />

        {/* Right eye */}
        <rect x="48" y="28" width="8" height="8" fill={isError ? errorRed : normal} />
        <rect x="48" y="36" width="8" height="8" fill={isError ? errorRed : normal} />

        {/* Nose */}
        <rect x="36" y="40" width="8" height="8" fill={isError ? errorRed : normal} />

        {/* Mouth - neutral/slight smile */}
        <rect x="28" y="52" width="8" height="4" fill={isError ? errorRed : normal} />
        <rect x="36" y="52" width="8" height="4" fill={isError ? errorRed : normal} />
        <rect x="44" y="52" width="8" height="4" fill={isError ? errorRed : normal} />
      </svg>
    </div>
  );
};

export default PixelFace;