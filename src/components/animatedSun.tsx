import React from 'react';

const AnimatedSun = ({ size = 80, spokeCount = 8 }) => {
  const sunRadius = size / 2;
  const spokeLength = size * 0.25;
  const spokeWidth = size * 0.05;
  const spokeOffset = sunRadius * 1.3; // Gap between sun and spokes

  return (
    <div className="flex items-center justify-center p-8 ">
      <div 
        className="relative"
        style={{ width: size, height: size, zIndex: 20 }}
      >
        {/* Central Sun Circle */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400"
          style={{ 
            width: sunRadius * 2, 
            height: sunRadius * 2,
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)'
          }}
        />

        {/* Rotating Spokes Container */}
        <div className="absolute inset-0 animate-spin-slow">
          {[...Array(spokeCount)].map((_, index) => {
            const angle = (360 / spokeCount) * index;
            
            return (
              <div
                key={index}
                className="absolute top-1/2 left-1/2 origin-left"
                style={{
                  transform: `rotate(${angle}deg) translateX(${spokeOffset}px)`,
                  transformOrigin: 'left center',
                }}
              >
                {/* Individual Spoke */}
                <div
                  className="bg-yellow-400 rounded-full animate-pulse-grow"
                  style={{
                    width: spokeLength,
                    height: spokeWidth,
                    animationDelay: `${index * 0.1}s`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-grow {
          0%, 100% {
            transform: scaleX(1);
            opacity: 1;
          }
          50% {
            transform: scaleX(1.4);
            opacity: 0.8;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-pulse-grow {
          animation: pulse-grow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AnimatedSun;