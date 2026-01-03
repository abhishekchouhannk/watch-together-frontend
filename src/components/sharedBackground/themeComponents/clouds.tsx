'use client';

import React, { useEffect, useState } from "react";

interface CloudLayerProps {
  srcLeft?: string;
  srcRight?: string;
  srcFull?: string;
  delay: number;
  animationStarted: boolean;
  zIndex: number;
  scrollSpeed?: number; // seconds for full scroll
}

const CloudLayer: React.FC<CloudLayerProps> = ({
  srcLeft,
  srcRight,
  srcFull,
  delay,
  animationStarted,
  zIndex,
  scrollSpeed = 60,
}) => {
  const [showFullCloud, setShowFullCloud] = useState(false);
  const [hideSnippets, setHideSnippets] = useState(false);
  const [offset, setOffset] = useState(0);
  const [useStretch, setUseStretch] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const updateOffsets = () => {
      const imgWidth = 576;
      const imgHeight = 324;
      const imgRatio = imgWidth / imgHeight;
      const scaledWidth = imgRatio * window.innerHeight;
      const browserWidth = window.innerWidth;

      // detect small screens
      setIsSmallScreen(browserWidth < imgWidth);

      if (imgWidth <= browserWidth) {
        setUseStretch(true);
        setOffset(0);
      } else {
        setUseStretch(false);
        const visibleRatio = browserWidth / imgWidth;
        const hiddenRatio = (1 - visibleRatio) / 2;
        setOffset(hiddenRatio);
      }
    };

    updateOffsets();
    window.addEventListener("resize", updateOffsets);
    return () => window.removeEventListener("resize", updateOffsets);
  }, []);

 useEffect(() => {
  if (animationStarted) {
    if (isSmallScreen) {
      // small screen → fade in full cloud after 2s
      setShowFullCloud(true); // mount immediately but keep opacity 0
      setHideSnippets(true);
      const fadeTimer = setTimeout(() => setFadeIn(true), 2000);
      return () => clearTimeout(fadeTimer);
    } else {
      // normal flow for large screens
      const fullCloudTimer = setTimeout(() => {
        setShowFullCloud(true);
        setFadeIn(true); // also fade in (so it’s smooth for large screens too)
      }, delay + 3100);

      const hideSnippetsTimer = setTimeout(() => {
        setHideSnippets(true);
      }, delay + 3200);

      return () => {
        clearTimeout(fullCloudTimer);
        clearTimeout(hideSnippetsTimer);
      };
    }
  }
}, [animationStarted, delay, isSmallScreen]);

  const leftTransform = animationStarted
    ? useStretch
      ? "translateX(0)"
      : `translateX(${(1 - offset) * 100}%)`
    : "translateX(-100%)";

  const rightTransform = animationStarted
    ? useStretch
      ? "translateX(0)"
      : `translateX(-${(1 - offset) * 100}%)`
    : "translateX(100%)";

  const imageStyle: React.CSSProperties = {
    width: useStretch ? "100vw" : "auto",
    height: "100%",
    maxWidth: useStretch ? undefined : "none",
    objectFit: useStretch ? undefined : "cover",
    // border: "1px solid red", // for testing image bounds
  };

  const imgClass = useStretch ? "w-[100vw] h-full" : "h-full w-auto";

  return (
    <>
      {/* Full Cloud - render underneath snippets when both are visible */}
      {showFullCloud && (
  <div
    className={`absolute top-0 left-0 w-full h-full overflow-hidden transition-opacity duration-[1500ms] ease-out`}
    style={{
      zIndex,
      opacity: fadeIn ? 1 : 0, // always starts at 0, fades to 1
    }}
  >
          <div
            className="absolute top-0 h-full flex will-change-transform"
            style={{
              left: 0,
              animation: `cloudScroll-${zIndex} ${scrollSpeed}s linear infinite`,
            }}
          >
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

          <style jsx>{`
            @keyframes cloudScroll-${zIndex} {
              from {
                transform: translateX(0);
              }
              to {
                transform: translateX(-50%);
              }
            }
          `}</style>
        </div>
      )}

      {/* Split Clouds - render on top with higher z-index */}
      {!hideSnippets && !isSmallScreen && (
        <>
          {srcLeft && (
            <div
              className="absolute top-0 h-full transition-transform ease-out"
              style={{
                zIndex: zIndex + 1,
                left: 0,
                transitionDuration: "2500ms",
                transitionDelay: `${delay}ms`,
                transform: leftTransform,
              }}
            >
              <img
                src={srcLeft}
                alt="Clouds left"
                className={imgClass}
                style={imageStyle}
              />
            </div>
          )}

          {srcRight && (
            <div
              className="absolute top-0 h-full transition-transform ease-out"
              style={{
                zIndex: zIndex + 1,
                right: 0,
                transitionDuration: "2500ms",
                transitionDelay: `${delay}ms`,
                transform: rightTransform,
              }}
            >
              <img
                src={srcRight}
                alt="Clouds right"
                className={imgClass}
                style={imageStyle}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CloudLayer;
