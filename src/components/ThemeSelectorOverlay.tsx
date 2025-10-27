"use client";

import React from "react";
import ThemeSelector from "@/components/landingPage/themeComponents/ThemeSelector";
import { useBackground } from "@/components/landingPage/BackgroundProvider";

/**
 * Small wrapper which reads/writes background theme from context
 * and places the DevTimeSelector in a top-most overlay so it is clickable.
 */
export default function ThemeSelectorOverlay() {
  const { setSelectedTheme } = useBackground();

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div
      className="fixed top-2 right-2 z-[9999] pointer-events-auto"
      style={{ isolation: "isolate" }}
    >
      {/* Pass in the setter from context */}
      <ThemeSelector currentTime={new Date()} onThemeChange={setSelectedTheme} />
    </div>
  );
}
