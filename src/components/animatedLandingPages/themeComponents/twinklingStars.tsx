import React, { useEffect, useState, useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  type: "normal" | "bright" | "dim";
}

interface TwinklingStarsProps {
  zIndex?: number;
  starCount?: number;
  animationStarted?: boolean;
  showShootingStars?: boolean;
  density?: "sparse" | "normal" | "dense";
}

const TwinklingStars: React.FC<TwinklingStarsProps> = ({
  zIndex = 5,
  starCount = 80,
  animationStarted = true,
  showShootingStars = false,
  density = "normal",
}) => {
  const [mounted, setMounted] = useState(false);
  const [shootingStar, setShootingStar] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Adjust star count based on density
  const adjustedStarCount = useMemo(() => {
    const multiplier =
      density === "sparse" ? 0.6 : density === "dense" ? 1.5 : 1;
    return Math.floor(starCount * multiplier);
  }, [starCount, density]);

  // Generate stars with random properties
  const stars = useMemo(() => {
    const generatedStars: Star[] = [];

    for (let i = 0; i < adjustedStarCount; i++) {
      // Determine star type (10% bright, 20% dim, 70% normal)
      const rand = Math.random();
      let type: Star["type"] = "normal";
      if (rand < 0.1) type = "bright";
      else if (rand < 0.3) type = "dim";

      generatedStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 65, // Upper 65% of screen
        size:
          type === "bright"
            ? Math.random() * 2 + 1.5
            : type === "dim"
            ? Math.random() * 0.8 + 0.3
            : Math.random() * 1.5 + 0.5,
        duration:
          type === "bright"
            ? Math.random() * 2 + 1.5
            : type === "dim"
            ? Math.random() * 4 + 3
            : Math.random() * 3 + 2,
        delay: Math.random() * 4,
        opacity:
          type === "bright"
            ? Math.random() * 0.2 + 0.8
            : type === "dim"
            ? Math.random() * 0.3 + 0.3
            : Math.random() * 0.4 + 0.6,
        type,
      });
    }

    return generatedStars;
  }, [adjustedStarCount]);

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  // Shooting star animation
  useEffect(() => {
    if (!showShootingStars || !animationStarted) return;

    const triggerShootingStar = () => {
      setShootingStar({
        x: Math.random() * 60 + 20,
        y: Math.random() * 30,
      });

      setTimeout(() => setShootingStar(null), 1500);
    };

    // Random shooting stars every 8-15 seconds
    const shootStar = () => {
      if (Math.random() > 0.5) {
        triggerShootingStar();
      }
      // Schedule next one
      setTimeout(shootStar, Math.random() * 1000 + 1000);
    };

    // Start the cycle
    const initialDelay = setTimeout(shootStar, Math.random() * 1000 + 1000);

    return () => clearTimeout(initialDelay);
  }, [showShootingStars, animationStarted]);

  const getStarColor = (type: Star["type"]) => {
    switch (type) {
      case "bright":
        return "bg-white";
      case "dim":
        return "bg-blue-100";
      default:
        return "bg-gray-100";
    }
  };

  const getStarGlow = (star: Star) => {
    const glowSize = star.size * 3;
    const glowOpacity = star.opacity * 0.6;

    if (star.type === "bright") {
      return `0 0 ${glowSize}px rgba(255, 255, 255, ${glowOpacity}), 0 0 ${
        glowSize * 1.5
      }px rgba(200, 220, 255, ${glowOpacity * 0.5})`;
    }
    return `0 0 ${glowSize}px rgba(255, 255, 255, ${glowOpacity * 0.8})`;
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex }}
    >
      {/* Regular twinkling stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className={`absolute rounded-full ${getStarColor(
            star.type
          )} transition-opacity duration-1000 ${
            mounted && animationStarted ? "opacity-100" : "opacity-0"
          }`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animation: `twinkle-${star.type} ${star.duration}s ease-in-out ${star.delay}s infinite`,
            boxShadow: getStarGlow(star),
          }}
        />
      ))}

      {/* Shooting star */}
      {shootingStar && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${shootingStar.x}%`,
            top: `${shootingStar.y}%`,
          }}
        >
          {/* Growing trail with SVG */}
          <svg
            className="absolute top-0 left-0"
            width="300"
            height="300"
            style={{
              overflow: "visible",
            }}
          >
            {/* Trail line that grows */}
            <line
              x1="0"
              y1="0"
              x2="200"
              y2="200"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
              style={{
                filter: "blur(1px)",
                animation: "draw-trail 1.2s ease-out forwards",
              }}
            />
            {/* Brighter core trail */}
            <line
              x1="0"
              y1="0"
              x2="200"
              y2="200"
              stroke="white"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="1"
              style={{
                animation: "draw-trail 1.2s ease-out forwards",
              }}
            />
          </svg>

          {/* Star head that moves */}
          <div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              boxShadow:
                "0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.6)",
              animation:
                "move-star 1.2s ease-out forwards, fade-star 1.5s ease-out forwards",
            }}
          />
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
  @keyframes twinkle-normal {
    0%, 100% {
      opacity: 0.4;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  @keyframes twinkle-bright {
    0%, 100% {
      opacity: 0.7;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.4);
    }
  }

  @keyframes twinkle-dim {
    0%, 100% {
      opacity: 0.2;
      transform: scale(0.9);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.1);
    }
  }

  @keyframes move-star {
    0% {
      transform: translate(0, 0);
    }
    80% {
      transform: translate(200px, 200px);
    }
    100% {
      transform: translate(200px, 200px);
    }
  }

  @keyframes draw-trail {
    0% {
      stroke-dasharray: 283;
      stroke-dashoffset: 283;
    }
    80% {
      stroke-dasharray: 283;
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dasharray: 283;
      stroke-dashoffset: -283;
    }
  }

  @keyframes fade-star {
    0%, 80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`}</style>
    </div>
  );
};

export default TwinklingStars;
