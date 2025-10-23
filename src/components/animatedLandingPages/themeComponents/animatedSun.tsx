// components/AnimatedSun.jsx

import { useEffect, useState } from 'react';

export default function AnimatedSun({ zIndex }: { zIndex: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [raysVisible, setRaysVisible] = useState(false);

  useEffect(() => {
    // Trigger the drop-down animation after 2 seconds
    const dropTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    // Show rays after sun is in position (2s delay + 1.5s animation)
    const raysTimer = setTimeout(() => {
      setRaysVisible(true);
    }, 3500);

    return () => {
      clearTimeout(dropTimer);
      clearTimeout(raysTimer);
    };
  }, []);

  // Generate 12 rays around the sun
  const rays = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div
      className={`fixed left-2/9 -translate-x-1/2 transition-all duration-[1500ms] ease-out blur-xs ${
        isVisible ? 'top-[15vh]' : '-top-40'
      }`}
      style={{ zIndex: zIndex }}
    >
      <div className="relative w-32 h-32">
        {/* Rotating rays container */}
        <div className={`absolute inset-0 animate-rotate-rays transition-opacity duration-1000 ${
          raysVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          {rays.map((index) => {
            const angle = (index * 30 * Math.PI) / 180;
            const distance = 60;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            return (
              <div
                key={index}
                className={`absolute w-8 h-1 ${
                  index % 2 === 0 ? 'animate-pulse-ray-even' : 'animate-pulse-ray-odd'
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(${x}px, ${y - 0.5}px) rotate(${index * 30}deg)`,
                  transformOrigin: 'left center',
                  background: '#fde047',
                  boxShadow: `
                    1px 0 0 #fbbf24,
                    -1px 0 0 #fbbf24,
                    0 1px 0 #fbbf24,
                    0 -1px 0 #fbbf24,
                    4px 0 0 #f59e0b,
                    -2px 0 0 #f59e0b,
                    0 2px 0 #f59e0b,
                    0 -2px 0 #f59e0b
                  `,
                }}
              />
            );
          })}
        </div>

        {/* Sun core with pixelated effect */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 z-10"
          style={{
            background: '#fbbf24',
            borderRadius: '50%',
            boxShadow: `
              0 0 0 2px #fbbf24,
              0 0 0 4px #f59e0b,
              0 0 0 6px #fbbf24,
              0 0 0 8px #f59e0b,
              0 0 20px 10px rgba(251, 191, 36, 0.3),
              
              /* Pixelated border effect */
              -4px -4px 0 #f59e0b,
              4px -4px 0 #f59e0b,
              -4px 4px 0 #f59e0b,
              4px 4px 0 #f59e0b,
              -8px 0 0 #f59e0b,
              8px 0 0 #f59e0b,
              0 -8px 0 #f59e0b,
              0 8px 0 #f59e0b
            `,
          }}
        >
          {/* Inner glow */}
          <div 
            className="absolute inset-2 opacity-60"
            style={{
              background: '#fde68a',
              borderRadius: '50%',
              boxShadow: `
                -1px -1px 0 #fcd34d,
                1px -1px 0 #fcd34d,
                -1px 1px 0 #fcd34d,
                1px 1px 0 #fcd34d
              `,
            }}
          />
        </div>
      </div>

      <style jsx>{`
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
            width: 32px;
            opacity: 1;
          }
          50% {
            width: 48px;
            opacity: 0.7;
          }
        }

        @keyframes pulse-ray-odd {
          0%, 100% {
            width: 48px;
            opacity: 0.7;
          }
          50% {
            width: 32px;
            opacity: 1;
          }
        }

        .animate-rotate-rays {
          animation: rotate-rays 50s linear infinite;
        }

        .animate-pulse-ray-even {
          animation: pulse-ray-even 4s ease-in-out infinite;
        }

        .animate-pulse-ray-odd {
          animation: pulse-ray-odd 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}