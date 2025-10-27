import React, { useEffect, useRef, useState, useMemo } from "react";

interface Star {
  x: number;
  y: number;
  baseSize: number;
  currentSize: number;
  baseOpacity: number;
  currentOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  type: 'bright' | 'dim' | 'normal';
}

interface TwinklingStarsProps {
  zIndex?: number;
  starCount?: number;
  animationStarted?: boolean;
  showShootingStars?: boolean;
  density?: 'sparse' | 'normal' | 'dense';
}

const TwinklingStars: React.FC<TwinklingStarsProps> = ({
  zIndex = 5,
  starCount = 80,
  animationStarted = true,
  showShootingStars = false,
  density = "normal",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  const starsRef = useRef<Star[]>([]);
  const [shootingStar, setShootingStar] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Adjust star count based on density
  const adjustedStarCount = useMemo(() => {
    const multiplier = density === "sparse" ? 0.6 : density === "dense" ? 1.5 : 1;
    return Math.floor(starCount * multiplier);
  }, [starCount, density]);

  // Initialize stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initStars = () => {
      const stars: Star[] = [];
      
      for (let i = 0; i < adjustedStarCount; i++) {
        const rand = Math.random();
        let type: Star["type"] = "normal";
        if (rand < 0.1) type = "bright";
        else if (rand < 0.3) type = "dim";

        const baseSize = type === "bright" 
          ? Math.random() * 2 + 1
          : type === "dim"
          ? Math.random() * 0.8 + 0.3
          : Math.random() * 1.5 + 0.5;

        const baseOpacity = type === "bright"
          ? Math.random() * 0.2 + 0.6
          : type === "dim"
          ? Math.random() * 0.3 + 0.3
          : Math.random() * 0.4 + 0.4;

        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.65), // Upper 65% of screen
          baseSize,
          currentSize: baseSize,
          baseOpacity,
          currentOpacity: baseOpacity,
          twinkleSpeed: Math.random() * 0.02 + 0.005, // Speed of twinkling
          twinklePhase: Math.random() * Math.PI * 2, // Random starting phase
          type,
        });
      }
      
      starsRef.current = stars;
    };

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [adjustedStarCount]);

  // Animation loop for canvas stars
  useEffect(() => {
    if (!animationStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw each star
      starsRef.current.forEach((star) => {
        // Update twinkle phase
        star.twinklePhase += star.twinkleSpeed;
        
        // Calculate current opacity and size with sine wave for smooth twinkling
        const twinkleFactor = (Math.sin(star.twinklePhase) + 1) / 2; // 0 to 1
        star.currentOpacity = star.baseOpacity * (0.3 + twinkleFactor * 0.7);
        star.currentSize = star.baseSize * (0.8 + twinkleFactor * 0.2);

        // Draw star with glow effect
        ctx.save();
        
        // Draw glow for bright stars
        if (star.type === 'bright') {
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.currentSize * 4
          );
          gradient.addColorStop(0, `rgba(255, 255, 255, ${star.currentOpacity * 0.8})`);
          gradient.addColorStop(0.5, `rgba(200, 220, 255, ${star.currentOpacity * 0.3})`);
          gradient.addColorStop(1, 'rgba(200, 220, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(
            star.x - star.currentSize * 4,
            star.y - star.currentSize * 4,
            star.currentSize * 8,
            star.currentSize * 8
          );
        }

        // Draw star core
        ctx.globalAlpha = star.currentOpacity;
        ctx.fillStyle = star.type === 'bright' ? '#ffffff' 
          : star.type === 'dim' ? '#e0e7ff' 
          : '#f3f4f6';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.currentSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animationStarted]);

  // Shooting star animation (original SVG logic)
  useEffect(() => {
    if (!showShootingStars || !animationStarted) return;

    const triggerShootingStar = () => {
      setShootingStar({
        x: Math.random() * 60 + 20,
        y: Math.random() * 30,
      });

      setTimeout(() => setShootingStar(null), 1500); // Matches the total animation time
    };

    // Random shooting stars every 8-15 seconds
    const shootStar = () => {
      if (Math.random() > 0.5) {
        triggerShootingStar();
      }
      // Schedule next one
      setTimeout(shootStar, Math.random() * 1000 + 2000);
    };

    // Start the cycle
    const initialDelay = setTimeout(shootStar, Math.random() * 5000 + 3000);

    return () => clearTimeout(initialDelay);
  }, [showShootingStars, animationStarted]);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex }}
    >
      {/* Canvas for regular twinkling stars */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

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