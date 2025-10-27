"use client";

import React, { useEffect, useState } from "react";
import AnimatedSun from "../animatedLandingPages/themeComponents/animatedSun";
import TwinklingStars from "../animatedLandingPages/themeComponents/twinklingStars";
import PixelSun from "../animatedLandingPages/themeComponents/pixelSun";
import PixelMoon from "../animatedLandingPages/themeComponents/pixelMoon";
import { TIME_THEMES, getTimeOfDay } from "../animatedLandingPages/constants";
import CloudLayer from "../animatedLandingPages/themeComponents/clouds";

interface AuthBackgroundProps {
  children: React.ReactNode;
}

const AuthBackground: React.FC<AuthBackgroundProps> = ({ children }) => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [blimpTrail, setBlimpTrail] = useState<Array<{ x: number; y: number }>>(
    []
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTheme, setSelectedTheme] = useState<
    "morning" | "afternoon" | "evening" | "night"
  >(() => {
    const hour = new Date().getHours();
    return getTimeOfDay(hour);
  });

  const currentTheme = TIME_THEMES[selectedTheme];

  // Update time every minute to catch theme changes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setTimeout(() => setAnimationStarted(true), 200);

    // Only animate blimp in afternoon
    if (currentTheme.name === "afternoon") {
      let progress = 0;
      const trail: Array<{ x: number; y: number }> = [];

      const blimpAnimation = setInterval(() => {
        if (progress <= 100) {
          const x = 10 + progress * 0.7;
          const y = 40 + Math.sin(progress * 0.05) * 15 - progress * 0.2;

          trail.push({ x, y });
          if (trail.length > 30) trail.shift();

          setBlimpTrail([...trail]);
          progress += 0.5;
        } else {
          clearInterval(blimpAnimation);
        }
      }, 30);

      return () => clearInterval(blimpAnimation);
    }
  }, [currentTheme]);

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
    <div
      className={`relative w-full min-h-screen overflow-hidden ${currentTheme.bgColor}`}
    >
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

      {/* Layer 3: Static decorative element (if exists and not afternoon) */}
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

      {/* Content Layer */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 50 }}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthBackground;