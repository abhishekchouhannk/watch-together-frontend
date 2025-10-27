"use client";

import React from "react";
import { useBackground } from "./BackgroundProvider";
import { TIME_THEMES } from "./constants";
import AnimatedSun from "./themeComponents/animatedSun";
import TwinklingStars from "./themeComponents/twinklingStars";
import PixelSun from "./themeComponents/pixelSun";
import PixelMoon from "./themeComponents/pixelMoon";
import CloudLayer from "./themeComponents/clouds";
import DevTimeSelector from "./themeComponents/ThemeSelector";

const SharedBackground: React.FC = () => {
  const { animationStarted, blimpTrail, selectedTheme, setSelectedTheme } = useBackground();
  const currentTheme = TIME_THEMES[selectedTheme];

  // Render time-specific animated elements
  const renderAnimatedElement = () => {
    switch (currentTheme.name) {
      case "afternoon":
        return (
          <>
            <AnimatedSun zIndex={10} />
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 20 }}
            >
              {blimpTrail.map((point, i) => (
                <circle
                  key={i}
                  cx={`${point.x}%`}
                  cy={`${point.y}%`}
                  r={2 + i * 0.1}
                  fill="white"
                  opacity={0.1 + (i / blimpTrail.length) * 0.2}
                />
              ))}

              {blimpTrail.length > 0 && (
                <g>
                  <ellipse
                    cx={`${blimpTrail[blimpTrail.length - 1].x}%`}
                    cy={`${blimpTrail[blimpTrail.length - 1].y}%`}
                    rx="6"
                    ry="2.5"
                    fill="#FFA500"
                    opacity="0.9"
                  />
                </g>
              )}
            </svg>
          </>
        );

      case "morning":
        return (
          <>
            <TwinklingStars
              zIndex={5}
              starCount={700}
              animationStarted={animationStarted}
              density="sparse"
              showShootingStars={true}
            />
            <PixelSun />
          </>
        );

      case "evening":
        return (
          <>
            <TwinklingStars
              zIndex={5}
              starCount={700}
              animationStarted={animationStarted}
              density="sparse"
              showShootingStars={true}
            />
          </>
        );

      case "night":
        return (
          <>
            <TwinklingStars
              zIndex={5}
              starCount={1000}
              animationStarted={animationStarted}
              density="sparse"
              showShootingStars={true}
            />
            <PixelMoon zIndex={20} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 w-full h-full overflow-hidden ${currentTheme.bgColor} -z-10`}>
      {/* Layer 1: Sky Background */}
      <div
        className={`absolute inset-0 transition-all duration-[1000ms] ${
          animationStarted ? "opacity-100" : "opacity-0"
        }`}
        style={{ zIndex: 0 }}
      >
        <img
          src={currentTheme.skyImage}
          alt="Sky"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Layer 2: Time-specific animated elements */}
      {renderAnimatedElement()}

      {/* Layer 3: Static decorative element */}
      {currentTheme.elementImage && currentTheme.name !== "afternoon" && (
        <div
          className={`absolute inset-0 transition-all duration-[2000ms] ${
            animationStarted ? "opacity-100" : "opacity-0"
          }`}
          style={{ zIndex: 25 }}
        >
          <img
            src={currentTheme.elementImage}
            alt="Decorative Element"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Layer 4: Far Clouds */}
      <CloudLayer
        srcLeft={currentTheme.farClouds.left}
        srcRight={currentTheme.farClouds.right}
        srcFull={currentTheme.farClouds.full}
        delay={500}
        animationStarted={animationStarted}
        zIndex={30}
        scrollSpeed={80}
      />

      {/* Layer 5: Near Clouds */}
      <CloudLayer
        srcLeft={currentTheme.nearClouds.left}
        srcRight={currentTheme.nearClouds.right}
        srcFull={currentTheme.nearClouds.full}
        delay={1000}
        animationStarted={animationStarted}
        zIndex={40}
        scrollSpeed={40}
      />

      {/* Optional: Time indicator for testing
      {process.env.NODE_ENV === 'development' && (
        <DevTimeSelector currentTime={new Date()} onThemeChange={setSelectedTheme} />
      )} */}
    </div>
  );
};

export default SharedBackground;