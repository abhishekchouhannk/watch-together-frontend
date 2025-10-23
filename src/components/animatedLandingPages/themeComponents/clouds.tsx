import React, { useEffect, useState } from "react";

interface CloudLayerProps {
  srcLeft?: string;
  srcRight?: string;
  srcFull?: string;
  delay: number;
  animationStarted: boolean;
  zIndex: number;
  scrollSpeed?: number; // in seconds for full scroll
  imageWidth?: number; // natural width of the cloud image
  imageHeight?: number; // natural height of the cloud image
}

const CloudLayer: React.FC<CloudLayerProps> = ({
  srcLeft,
  srcRight,
  srcFull,
  delay,
  animationStarted,
  zIndex,
  scrollSpeed = 60,
  imageWidth = 955, // default width, adjust to your actual image
  imageHeight = 918, // default height, adjust to your actual image
}) => {
  const [showFullCloud, setShowFullCloud] = useState(false);

  useEffect(() => {
    if (animationStarted) {
      const timer = setTimeout(() => {
        setShowFullCloud(true);
      }, delay + 3200);
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
              width: `${imageWidth}px`,
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
              style={{
                width: `${imageWidth}px`,
                height: `${imageHeight}px`,
                objectFit: "none",
                objectPosition: "left center",
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
              width: `${imageWidth}px`,
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
              style={{
                width: `${imageWidth}px`,
                height: `${imageHeight}px`,
                objectFit: "none",
                objectPosition: "right center",
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
      {/* Two instances of the cloud image for seamless looping */}
      <div
        className="absolute top-0 h-full flex"
        style={{
          animation: `cloudScroll ${scrollSpeed}s linear infinite`,
          width: `${imageWidth * 2}px`,
        }}
      >
        <img
          src={srcFull}
          alt="Scrolling clouds"
          style={{
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            objectFit: "none",
          }}
        />
        <img
          src={srcFull}
          alt="Scrolling clouds duplicate"
          style={{
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            objectFit: "none",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes cloudScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-${imageWidth}px);
          }
        }
      `}</style>
    </div>
  );
};

export default CloudLayer;