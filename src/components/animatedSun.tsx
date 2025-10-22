// components/AnimatedSun.jsx
'use client';

import { useEffect, useState } from 'react';

export default function AnimatedSun() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the drop-down animation after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Generate 12 rays around the sun
  const rays = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div
      className={`fixed top-0 left-2/9 -translate-x-1/2 transition-transform duration-[1500ms] ease-out ${
        isVisible ? 'translate-y-[15vh]' : '-translate-y-full'
      }`}
      style={{ zIndex: 10 }}
    >
      <div className="relative w-32 h-32">
        {/* Rotating rays container */}
        <div className="absolute inset-0 animate-rotate-rays">
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
                className={`absolute top-1/2 left-1/2 -translate-y-1/2 w-8 h-1 bg-yellow-500 ${
                  index % 2 === 0 ? 'animate-pulse-ray-even' : 'animate-pulse-ray-odd'
                }`}
                style={{
                  transformOrigin: '0 50%',
                  marginLeft: '48px', // Distance from center (adjust as needed)
                }}
              />
            </div>
          ))}
        </div>

        {/* Sun core */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-400 rounded-full pixelated-border shadow-lg shadow-yellow-300/50 z-10"
          style={{ animation: 'pulse 0.4s ease-in-out infinite'
          }}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-2 bg-yellow-200 rounded-full opacity-60" />
        </div>
      </div>

      <style jsx>{`
        .pixelated-border {
          box-shadow: 
            0 0 0 1px rgba(0, 0, 0, 0.1),
            inset 0 0 0 1px rgba(255, 255, 255, 0.2);
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