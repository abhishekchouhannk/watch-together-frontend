'use client';

// Utility
import { capitalize } from '@/utils/utilFunctions'

import { useState, useMemo } from 'react';
import { TIME_THEMES, getTimeOfDay } from '../../../theme/BackgroundConstants';
import { useBackground } from "@/components/landingPage/BackgroundProvider";

const TIME_EMOJIS: Record<keyof typeof TIME_THEMES, string> = {
  morning: '🌅',
  afternoon: '☀️',
  evening: '🌇',
  night: '🌙',
};

export default function ThemeSelector({
  currentTime,
  onThemeChange,
}: {
  currentTime: Date;
  onThemeChange: (theme: "morning" | "afternoon" | "evening" | "night") => void;
}) {
  const [selectedTime, setSelectedTime] = useState<keyof typeof TIME_THEMES | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = useMemo(() => {
    const hour = currentTime.getHours();
    const timeOfDay = getTimeOfDay(hour);
    return TIME_THEMES[timeOfDay];
  }, [currentTime]);

  const { selectedTheme, setSelectedTheme } = useBackground();
const displayTheme = TIME_THEMES[selectedTheme];


  return (
    <div className="absolute top-4 left-4">
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between bg-black/50 text-white px-3 py-1 rounded-lg text-sm w-32"
        >
          <span className="capitalize">{displayTheme.name}</span> {TIME_EMOJIS[displayTheme.name as keyof typeof TIME_EMOJIS]}
          <span className="ml-2">{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="absolute mt-1 w-full bg-black/70 rounded-lg shadow-lg overflow-hidden animate-slideDown">
            {Object.entries(TIME_THEMES)
              .filter(([key]) => key !== displayTheme.name)
              .map(([key, theme]) => (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedTime(key as keyof typeof TIME_THEMES);
                    onThemeChange(key as keyof typeof TIME_THEMES); // ← callback to parent
                    setIsOpen(false);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-black/40 transition-colors"
                >
                  {capitalize(key)} {TIME_EMOJIS[key as keyof typeof TIME_THEMES]}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Inline keyframes */}
      <style jsx>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}