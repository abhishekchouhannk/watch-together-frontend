"use client";

import React, { useEffect, useState, useMemo } from "react";
import AnimatedSun from "./themeComponents/animatedSun"; // For display in Afternoon
import TwinklingStars from "./themeComponents/twinklingStars"; // For display in Morning/Night
import AnimatedMoon from "./themeComponents/animatedMoon"; // For display in Night sky
import PixelSun from "./themeComponents/pixelSun";

// import data, helper functions
import { TIME_THEMES, getTimeOfDay } from "./constants";

// import cloud animation component
import CloudLayer from "./themeComponents/clouds";
import DevTimeSelector from "./themeComponents/timeSelector";
import PixelMoon from "./themeComponents/pixelMoon";

const AnimatedLandingPage: React.FC = () => {
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

  // useEffect(() => {
  //   console.log("Current hour:", currentTime.getHours());
  //   console.log("Time of day:", getTimeOfDay(currentTime.getHours()));
  //   console.log("Selected theme:", currentTheme.name);
  //   console.log("Sky image path:", currentTheme.skyImage);
  // }, [currentTheme, currentTime]);

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
            {/* Animated Sun for afternoon */}
            <AnimatedSun zIndex={10} />

            {/* Animated Blimp for afternoon */}
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
        // Add morning-specific animations (e.g., rising sun)
        return (
          <>
            {/* Twinkling Stars */}
            <TwinklingStars
              zIndex={5}
              starCount={700}
              animationStarted={animationStarted}
              density="sparse"
              showShootingStars={true}
            />
            < PixelSun />
            {/* <div
              className={`absolute transition-all duration-[3000ms] ${
                animationStarted ? "opacity-100" : "opacity-0"
              }`}
              style={{
                zIndex: 15,
                top: animationStarted ? "10%" : "50%",
                left: "80%",
                transform: "translateX(-50%)",
              }}
            > */}
              {/* You can add a rising sun animation or birds here */}
              {/* <div className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-2xl" />
            </div> */}
          </>
        );

      case "evening":
        // Add evening-specific animations
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
        // Add night-specific animations (e.g., twinkling stars)
        return (
          <>
            <TwinklingStars
              zIndex={5}
              starCount={1000}
              animationStarted={animationStarted}
              density="sparse"
              showShootingStars={true}
            />
            {/* <AnimatedMoon zIndex={15} /> */}
            < PixelMoon zIndex={20} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`relative w-full h-screen overflow-hidden ${currentTheme.bgColor}`}
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

      {/* UI Content */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 50 }}
      >
        <div
          className={`text-center px-6 transition-all duration-1000 transform ${
            animationStarted
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "3000ms" }}
        >
          <h1
            className={`text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl ${currentTheme.textColor}`}
          >
            Watch Together
          </h1>
          <p
            className={`text-lg md:text-2xl mb-10 drop-shadow-lg max-w-2xl mx-auto ${
              currentTheme.name === "morning"
                ? "text-gray-700/90"
                : "text-white/90"
            }`}
          >
            {currentTheme.motto}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className={`px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all shadow-xl ${currentTheme.buttonPrimary}`}
            >
              Start Watching
            </button>
            <button
              className={`backdrop-blur px-8 py-4 rounded-full font-semibold transform hover:scale-105 transition-all ${currentTheme.buttonSecondary}`}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Optional: Time indicator for testing */}
      {process.env.NODE_ENV === 'development' && (
        <DevTimeSelector currentTime={currentTime} onThemeChange={setSelectedTheme} />
      )}
    </div>
  );
};

export default AnimatedLandingPage;
