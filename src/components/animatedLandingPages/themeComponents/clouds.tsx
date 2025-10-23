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
  const [offset, setOffset] = useState(0);
  const [useStretch, setUseStretch] = useState(false);

  useEffect(() => {
    const updateOffsets = () => {
      const imgWidth = 576;
      const imgHeight = 324;
      const imgRatio = imgWidth / imgHeight;
      const scaledWidth = imgRatio * window.innerHeight;
      const browserWidth = window.innerWidth;

      console.log(`browserWidth: ${window.innerWidth}`);
      console.log(`scaledWidth: ${scaledWidth}`);

      if (imgWidth <= browserWidth) {
        // Stretch case — just slide both sides 100%
        setUseStretch(true);
        setOffset(0);
      } else {
        setUseStretch(false);
        // Calculate the percentage of the image visible within the browser
        const visibleRatio = browserWidth / imgWidth; // e.g. 0.8 if only 80% visible
        // Calculate offset so both halves meet at center (50%)
        const hiddenRatio = (1 - visibleRatio) / 2;
        setOffset(hiddenRatio); // e.g. 0.1 means each side hides 10% offscreen
      }
    };

    updateOffsets();
    window.addEventListener("resize", updateOffsets);
    2;
    return () => window.removeEventListener("resize", updateOffsets);
  }, []);

  useEffect(() => {
    if (animationStarted) {
      const timer = setTimeout(() => {
        setShowFullCloud(true);
      }, delay + 3200); // after transition
      return () => clearTimeout(timer);
    }
  }, [animationStarted, delay]);

  // === Split Clouds Animation ===
  if (!showFullCloud) {
    const leftTransform = animationStarted
      ? useStretch
        ? "translateX(0)" // normal slide
        : `translateX(${(1 - offset) * 100}%)` // partial reveal
      : "translateX(-100%)";

    const rightTransform = animationStarted
      ? useStretch
        ? "translateX(0)"
        : `translateX(-${(1 - offset) * 100}%)`
      : "translateX(100%)";

    const imgClass = useStretch ? "w-[100vw] h-full" : "h-full w-auto";

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
              transform: leftTransform,
            }}
          >
            <img
              src={srcLeft}
              alt="Clouds left"
              className={imgClass}
              style={{ objectFit: "cover" }}
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
              transform: rightTransform,
            }}
          >
            <img
              src={srcRight}
              alt="Clouds right"
              className={imgClass}
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </>
    );
  }

  // === Full Cloud (unchanged) ===
  return (
    <div
      className="absolute top-0 left-0 w-full h-full overflow-hidden"
      style={{ zIndex }}
    >
      <div
        className="absolute top-0 h-full flex will-change-transform"
        style={{
          left: 0,
          animation: `cloudScroll ${scrollSpeed}s linear infinite`,
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
              ...(useStretch
                ? {}
                : { transform: `translateX(-${offset * 100}%)` }),
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
              ...(useStretch
                ? {}
                : { transform: `translateX(${(1 - offset) * 100}%)` }),
            }}
          />
        </div>
      </div>

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
