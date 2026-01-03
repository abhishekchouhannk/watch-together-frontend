"use client";

import React, { useRef, useEffect, useState } from "react";

interface PixelMoonProps {
  size?: number;
  pixelSize?: number;
  color?: string;
  top?: string;
  left?: string;
  zIndex?: number;
  animationDelay?: number;
}

const PixelMoon: React.FC<PixelMoonProps> = ({
  size = 100,
  pixelSize = 3,
  color = "#f5f3ce",
  top = "20%",
  left = "40%",
  zIndex = 45,
  animationDelay = 1000, // delay before moon starts dropping
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [glowStarted, setGlowStarted] = useState(false);

  // Draw the pixel moon
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaledSize = Math.floor(size / pixelSize);
    const center = scaledSize / 2;

    ctx.clearRect(0, 0, size, size);

    for (let y = 0; y < scaledSize; y++) {
      for (let x = 0; x < scaledSize; x++) {
        const dist = Math.hypot(x - center, y - center);
        if (dist <= scaledSize / 2 - 0.5) {
          ctx.fillStyle = color;
          ctx.fillRect(
            x * pixelSize,
            y * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      }
    }
  }, [size, pixelSize, color]);

  // Drop down after delay
  useEffect(() => {
    const dropTimer = setTimeout(() => setAnimationStarted(true), animationDelay);

    // Start glow *after* the drop completes (2s animation)
    const glowTimer = setTimeout(() => setGlowStarted(true), animationDelay + 2000);

    return () => {
      clearTimeout(dropTimer);
      clearTimeout(glowTimer);
    };
  }, [animationDelay]);

  return (
    <div
      className={`absolute pointer-events-none transition-all duration-[3000ms] ease-[cubic-bezier(0.25,1,0.3,1)] ${
        animationStarted ? "translate-y-0 opacity-100" : "-translate-y-[150vh] opacity-0"
      }`}
      style={{
        top,
        left,
        zIndex,
        filter: glowStarted
          ? "drop-shadow(0 0 10px rgba(255, 255, 200, 0.8))"
          : "none",
        transitionDelay: `${animationDelay}ms`,
      }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          transition: "filter 2s ease-in-out",
        }}
      />
      {glowStarted && (
        <style jsx>{`
          canvas {
            animation: glowPulse 3s ease-in-out infinite;
          }
          @keyframes glowPulse {
            0% {
              filter: drop-shadow(0 0 6px rgba(255, 255, 200, 0.6));
            }
            50% {
              filter: drop-shadow(0 0 12px rgba(255, 255, 200, 0.9));
            }
            100% {
              filter: drop-shadow(0 0 6px rgba(255, 255, 200, 0.6));
            }
          }
        `}</style>
      )}
    </div>
  );
};

export default PixelMoon;
