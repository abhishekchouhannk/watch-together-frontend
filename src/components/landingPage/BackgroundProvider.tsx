"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getTimeOfDay } from "./constants";

interface BackgroundContextType {
  animationStarted: boolean;
  blimpTrail: Array<{ x: number; y: number }>;
  selectedTheme: "morning" | "afternoon" | "evening" | "night";
  setSelectedTheme: React.Dispatch<
    React.SetStateAction<"morning" | "afternoon" | "evening" | "night">
  >;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(
  undefined
);

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackground must be used within BackgroundProvider");
  }
  return context;
};

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [blimpTrail, setBlimpTrail] = useState<Array<{ x: number; y: number }>>(
    []
  );
  const [selectedTheme, setSelectedTheme] = useState<
    "morning" | "afternoon" | "evening" | "night"
  >("night"); // stable default

  useEffect(() => {
    const hour = new Date().getHours();
    setSelectedTheme(getTimeOfDay(hour));
  }, []);

  // Start animations only once on mount
  useEffect(() => {
    setTimeout(() => setAnimationStarted(true), 200);
  }, []);

  // Handle blimp animation for afternoon theme
  useEffect(() => {
    if (selectedTheme !== "afternoon") return;

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
  }, [selectedTheme]);

  // Update theme based on time periodically
  useEffect(() => {
    const timer = setInterval(() => {
      const hour = new Date().getHours();
      setSelectedTheme(getTimeOfDay(hour));
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <BackgroundContext.Provider
      value={{
        animationStarted,
        blimpTrail,
        selectedTheme,
        setSelectedTheme,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};
