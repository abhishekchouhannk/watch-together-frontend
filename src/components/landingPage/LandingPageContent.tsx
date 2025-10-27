"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useBackground } from "./BackgroundProvider";
import { TIME_THEMES } from "./constants";

const LandingPageContent: React.FC = () => {
  const router = useRouter();
  const { animationStarted, selectedTheme } = useBackground();
  const currentTheme = TIME_THEMES[selectedTheme];

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <div
        className={`text-center px-6 transition-all duration-1000 transform ${
          animationStarted
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
        style={{ transitionDelay: "1500ms" }}
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
            onClick={() => router.push('/auth')}
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
  );
};

export default LandingPageContent;