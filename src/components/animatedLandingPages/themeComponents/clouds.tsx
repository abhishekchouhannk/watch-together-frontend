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
      }, delay + 3200); // 2500ms is the transition duration
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
                : "translateX(-100%)",
            }}
          >
            <img
              src={srcLeft}
              alt="Clouds left"
              className="w-[100vw] h-full"
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
                : "translateX(100%)",
            }}
          >
            <img
              src={srcRight}
              alt="Clouds right"
              className="w-[100vw] h-full"
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
      {/* Container that holds both images side by side */}
      <div
        className="absolute top-0 h-full flex will-change-transform"
        style={{
          left: 0,
          animation: `cloudScroll ${scrollSpeed}s linear infinite`,
        }}
      >
        {/* First image */}
        <div className="h-full flex-shrink-0">
          <img 
            src={srcFull} 
            alt="Scrolling clouds" 
            className="h-full block"
            style={{
              width: "auto",
              minWidth: "100vw",
              maxWidth: "none",
              objectFit: "cover",
            }}
          />
        </div>
        {/* Second image - exact duplicate */}
        <div className="h-full flex-shrink-0">
          <img
            src={srcFull}
            alt="Scrolling clouds duplicate"
            className="h-full block"
            style={{
              width: "auto",
              minWidth: "100vw",
              maxWidth: "none",
              objectFit: "cover",
            }}
          />
        </div>
      </div>

      {/* Add CSS animation via style tag */}
      <style jsx>{`
        @keyframes cloudScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default CloudLayer;