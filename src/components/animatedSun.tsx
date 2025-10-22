// components/AnimatedSun.jsx
'use client';

import { useEffect, useState } from 'react';

export default function AnimatedSun() {
  const [isVisible, setIsVisible] = useState(false);
  const [showRays, setShowRays] = useState(false);

  useEffect(() => {
    // Trigger the drop-down animation after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Fade in rays after sun is in position (2s delay + 1.5s animation)
    const raysTimer = setTimeout(() => {
      setShowRays(true);
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(raysTimer);
    };
  }, []);

  // Generate 12 rays around the sun
  const rays = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="fixed top-0 left-0 w-full pointer-events-none" style={{ zIndex: 50 }}>
      <div
        className={`absolute left-2/9 -translate-x-1/2 transition-transform duration-[1500ms] ease-out ${
          isVisible ? 'translate-y-[15vh]' : '-translate-y-[200px]'
        }`}
        style={{ top: 0 }}
      >
        <div className="relative w-32 h-32">
          {/* Rotating rays container */}
          <div 
            className={`absolute inset-0 animate-rotate-rays transition-opacity duration-700 ${
              showRays ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {rays.map((index) => (
              <div
                key={index}
                className="absolute w-full h-full"
                style={{
                  transform: `rotate(${index * 30}deg)`,
                }}
              >
                {/* Ray positioned from center */}
                <div
                  className={`absolute top-1/2 left-47/80 -translate-y-1/2 w-8 h-1 bg-yellow-300 ray-pixelated ${
                    index % 2 === 0 ? 'animate-pulse-ray-even' : 'animate-pulse-ray-odd'
                  }`}
                  style={{
                    transformOrigin: '0 50%',
                    marginLeft: '48px',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Sun core */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-400 rounded-full shadow-lg shadow-yellow-300/50 z-10 sun-pixelated"
          >
            {/* Inner glow effect */}
            <div className="absolute inset-2 bg-yellow-200 rounded-full opacity-60" />
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Pixelated sun border effect */
        .sun-pixelated {
          box-shadow: 
            /* Main pixelated border */
            -2px -2px 0 0 #fbbf24,
            2px -2px 0 0 #fbbf24,
            -2px 2px 0 0 #fbbf24,
            2px 2px 0 0 #fbbf24,
            -3px 0 0 0 #fbbf24,
            3px 0 0 0 #fbbf24,
            0 -3px 0 0 #fbbf24,
            0 3px 0 0 #fbbf24,
            /* Outer glow */
            0 0 20px rgba(251, 191, 36, 0.5);
        }

        /* Pixelated ray border effect */
        .ray-pixelated {
          box-shadow: 
            0 -2px 0 0 #fcd34d,
            0 2px 0 0 #fcd34d,
            -2px 0 0 0 #fcd34d,
            2px 0 0 0 #fcd34d;
        }

        @keyframes rotate-rays {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-ray-even {
          0%, 100% {
            transform: translateY(-50%) scaleX(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-50%) scaleX(1.5);
            opacity: 0.8;
          }
        }

        @keyframes pulse-ray-odd {
          0%, 100% {
            transform: translateY(-50%) scaleX(1.5);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-50%) scaleX(1);
            opacity: 1;
          }
        }

        .animate-rotate-rays {
          animation: rotate-rays 20s linear infinite;
        }

        .animate-pulse-ray-even {
          animation: pulse-ray-even 2s ease-in-out infinite;
        }

        .animate-pulse-ray-odd {
          animation: pulse-ray-odd 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}