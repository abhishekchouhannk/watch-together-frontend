"use client";

import React, { useRef, useEffect, useState } from "react";

interface PixelSunProps {
  size?: number;
  pixelSize?: number;
  color?: string;
  zIndex?: number;
  animationDelay?: number;
}

const PixelSun: React.FC<PixelSunProps> = ({
  size = 1500,
  pixelSize = 9,
  color = "#FFEFA1",
  zIndex = 20,
  animationDelay = 1000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [canvasSize, setCanvasSize] = useState(size);

  // ✅ Responsive scaling
  useEffect(() => {
    const handleResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const newSize = Math.min(vw, vh) * 1.2;
      setCanvasSize(newSize);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🎨 Draw the sun
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaledSize = Math.floor(canvasSize / pixelSize);
    const center = scaledSize / 2;

    ctx.clearRect(0, 0, canvasSize, canvasSize);

    for (let y = 0; y < scaledSize; y++) {
      for (let x = 0; x < scaledSize; x++) {
        const dist = Math.hypot(x - center, y - center);
        if (dist <= scaledSize / 2 - 0.5) {
          ctx.fillStyle = color;
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }
  }, [canvasSize, pixelSize, color]);

  // ☀️ Start rising + glowing
  useEffect(() => {
    const riseTimer = setTimeout(() => setAnimationStarted(true), animationDelay);
    return () => clearTimeout(riseTimer);
  }, [animationDelay]);

  return (
    <div
      className={`absolute pointer-events-none transition-all duration-[3000ms] ease-[cubic-bezier(0.25,1,0.3,1)] ${
        animationStarted ? "translate-y-0 opacity-100" : "translate-y-[150vh] opacity-0"
      }`}
      style={{
        top: "30%",
        left: "80%",
        transform: "translate(0%, 0%)",
        zIndex,
        filter:
          "drop-shadow(0 0 5px rgba(255, 255, 180, 0.5)) drop-shadow(0 0 10px rgba(255, 230, 150, 0.7)) drop-shadow(0 0 15px rgba(255, 220, 120, 0.8))",
        transitionDelay: `${animationDelay}ms`,
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{
          transition: "filter 3s ease-in-out",
          maxWidth: "50vw",
          maxHeight: "50vh",
          objectFit: "contain",
          animation: animationStarted ? "glowPulse 3s ease-in-out infinite" : "none",
        }}
      />
      <style jsx>{`
        @keyframes glowPulse {
          0% {
            filter: drop-shadow(0 0 2px rgba(255, 255, 190, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 9px rgba(255, 240, 150, 0.9));
          }
          100% {
            filter: drop-shadow(0 0 2px rgba(255, 255, 190, 0.5));
          }
        }
      `}</style>
    </div>
  );
};

export default PixelSun;
