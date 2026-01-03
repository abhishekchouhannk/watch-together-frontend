// hooks/useCurrentTheme.ts
'use client';

import { TIME_THEMES } from '@/theme/Background';
import { useBackground } from '@/hooks/useBackground';

// returns the current theme based on the selected theme in context
/**
 * 
 * @returns an object of the type
 * morning: {
    name: "morning",
    motto: "Start your day watching together, anywhere.",
    bgColor: "bg-gradient-to-b from-pink-200 via-rose-100 to-blue-200",
    skyImage: "/assets/morning/sky.png",
    farClouds: {
      left: "/assets/morning/farLayer/left.png",
      right: "/assets/morning/farLayer/right.png",
      full: "/assets/morning/farLayer/full.png",
    },
    elementImage: "/assets/morning/element.png",
    nearClouds: {
      left: "/assets/morning/nearLayer/left.png",
      right: "/assets/morning/nearLayer/right.png",
      full: "/assets/morning/nearLayer/full.png",
    },
    textColor: "text-rose-900",
    buttonPrimary: "bg-rose-500 hover:bg-rose-600 text-white",
    buttonSecondary: "bg-rose-100/80 hover:bg-rose-200/90 text-rose-900",
  }, etc.
 */
export function useCurrentTheme() {
  const { selectedTheme } = useBackground();
  const theme = TIME_THEMES[selectedTheme];
  
  return theme;
}