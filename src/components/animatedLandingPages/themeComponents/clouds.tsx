import React, { useEffect, useState } from "react";

interface CloudLayerProps {
  srcLeft?: string;
  srcRight?: string;
  srcFull?: string;
  delay: number;
  animationStarted: boolean;
  zIndex: number;
  scrollSpeed?: number; // in seconds for full scroll
  cloudWidth?: number; // fixed width for cloud images in pixels
}

const CloudLayer: React.FC<CloudLayerProps> = ({
  srcLeft,
  srcRight,
  srcFull,
  delay,
  animationStarted,
  zIndex,
  scrollSpeed = 60,
  cloudWidth = 1920, // default to common desktop width
}) => {
  const [showFullCloud, setShowFullCloud] = useState(false);

  useEffect(() => {
    if (animationStarted) {
      // Switch to full cloud after initial animation completes
      const timer = setTimeout(() => {
        setShowFullCloud(true);
      }, delay + 2500); // Match exactly with transition duration
      return () => clearTimeout(timer);
    }
  }, [animationStarted, delay]);

  // Split cloud pieces (initial animation)
  if (!showFullCloud) {
    return (
      <>
        {srcLeft && (
          <div
            className="absolute top-0 h-full transition-transform ease-out"
            style={{
              zIndex,
              left: 0,
              transitionDuration: "2500ms",
              transitionDelay: `${delay}ms`,
              transform: animationStarted
                ? "translateX(0)"
                : `translateX(-100%)`, // Move full width off screen
            }}
          >
            <img
              src={srcLeft}
              alt="Clouds left"
              className="h-full"
            />
          </div>
        )}
        {srcRight && (
          <div
            className="absolute top-0 h-full transition-transform ease-out"
            style={{
              zIndex,
              right: 0,
              transitionDuration: "2500ms",
              transitionDelay: `${delay}ms`,
              transform: animationStarted
                ? "translateX(0)"
                : `translateX(100%)`, // Move full width off screen
            }}
          >
            <img
              src={srcRight}
              alt="Clouds right"
              className="h-full"
            />
          </div>
        )}
      </>
    );
  }

  // Full cloud with infinite scroll
  return (
    <div
      className="absolute top-0 left-0 w-full h-full overflow-hidden"
      style={{ zIndex }}
    >
      {/* Container for the scrolling clouds */}
      <div
        className="absolute top-0 h-full"
        style={{
          left: '50%',
          marginLeft: `-${cloudWidth}px`, // Start position matches where split clouds end
          width: `${cloudWidth * 3}px`, // Three widths for seamless loop (one extra for buffer)
          animation: `cloudScroll-${zIndex} ${scrollSpeed}s linear infinite`,
        }}
      >
        {/* Three instances for completely seamless scrolling */}
        <div className="flex h-full">
          <img 
            src={srcFull} 
            alt="Scrolling clouds 1"
            style={{
              height: "100%",
              width: `auto`,
              objectFit: 'cover'
            }}
          />
          <img
            src={srcFull}
            alt="Scrolling clouds 2"
            style={{
                height: "100%",
              width: `auto`,
              objectFit: 'cover'
            }}
          />
          <img
            src={srcFull}
            alt="Scrolling clouds 3"
            style={{
                height: "100%",
              width: `auto`,
              objectFit: 'cover'
            }}
          />
        </div>
      </div>

      {/* Add CSS animation via style tag */}
      <style jsx>{`
        @keyframes cloudScroll-${zIndex} {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-${cloudWidth}px);
          }
        }
      `}</style>
    </div>
  );
};

export default CloudLayer;