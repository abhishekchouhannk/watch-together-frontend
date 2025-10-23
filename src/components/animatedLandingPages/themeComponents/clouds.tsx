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
      }, delay + 3200); // 2500ms is the transition duration + buffer
      return () => clearTimeout(timer);
    }
  }, [animationStarted, delay]);

  // Split cloud pieces (initial animation)
  if (!showFullCloud) {
    return (
      <>
        {srcLeft && (
          <div
            className="absolute top-0 h-full transition-transform ease-out overflow-hidden"
            style={{
              zIndex,
              left: 0,
              width: `${cloudWidth}px`,
              transitionDuration: "2500ms",
              transitionDelay: `${delay}ms`,
              transform: animationStarted
                ? "translateX(0)"
                : "translateX(-100%)",
            }}
          >
            <img
              src={srcLeft}
              alt="Clouds left"
              className="h-full w-auto"
              style={{ 
                width: `${cloudWidth}px`,
                objectFit: 'cover',
                objectPosition: 'left center'
              }}
            />
          </div>
        )}
        {srcRight && (
          <div
            className="absolute top-0 h-full transition-transform ease-out overflow-hidden"
            style={{
              zIndex,
              right: 0,
              width: `${cloudWidth}px`,
              transitionDuration: "2500ms",
              transitionDelay: `${delay}ms`,
              transform: animationStarted
                ? "translateX(0)"
                : "translateX(100%)",
            }}
          >
            <img
              src={srcRight}
              alt="Clouds right"
              className="h-full w-auto"
              style={{ 
                width: `${cloudWidth}px`,
                objectFit: 'cover',
                objectPosition: 'right center'
              }}
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
      {/* We need two instances of the cloud image for seamless looping */}
      <div
        className="absolute top-0 h-full flex"
        style={{
          animation: `cloudScroll ${scrollSpeed}s linear infinite`,
          width: `${cloudWidth * 2}px`, // Two cloud widths for seamless loop
          left: '50%',
          transform: 'translateX(-50%)', // Center the clouds initially
        }}
      >
        <img 
          src={srcFull} 
          alt="Scrolling clouds" 
          className="h-full"
          style={{
            width: `${cloudWidth}px`,
            objectFit: 'cover'
          }}
        />
        <img
          src={srcFull}
          alt="Scrolling clouds duplicate"
          className="h-full"
          style={{
            width: `${cloudWidth}px`,
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Add CSS animation via style tag */}
      <style jsx>{`
        @keyframes cloudScroll {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(calc(-50% - ${cloudWidth}px));
          }
        }
      `}</style>
    </div>
  );
};

export default CloudLayer;