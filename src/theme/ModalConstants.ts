// ModalConstants.ts

import { TIME_THEMES } from "./BackgroundConstants";

// Theme-specific classes
export const getModalTheme = (theme: typeof TIME_THEMES[keyof typeof TIME_THEMES]) => {
  const baseClasses = {
    morning: {
      modalBg: "bg-pink-200/90 backdrop-blur-lg",
      border: "border-pink-400 dark:border-rose-700/70",
      inputBg: "bg-white/20 dark:bg-white/20",
      inputBorder: "border-pink-300 dark:border-rose-400/30",
      inputFocus: "focus:border-rose-800",
      text: "text-rose-900 dark:text-rose-800",
      textSecondary: "text-rose-800 dark:text-rose-800",
      textMuted: "text-rose-700 dark:text-rose-700",
      closeButton:
        "text-rose-500 hover:text-rose-700 dark:text-rose-700 dark:hover:text-rose-100 transition-colors",
      primaryButton:
        "bg-rose-800 hover:bg-rose-900 text-white shadow-md shadow-pink-200/40",
      secondaryButton: "bg-white/20 hover:bg-white/40 text-rose-900",
      tagBg: "bg-rose-200/80 dark:bg-rose-600/20",
      tagText: "text-rose-900 dark:text-rose-900",
      modeActive: "bg-rose-800 border-rose-300 text-white",
      modeInactive:
        "bg-white/20 border-rose-300 text-rose-700 hover:border-rose-400",
    },

    afternoon: {
      modalBg: "bg-sky-50 dark:bg-sky-950/95",
      border: "border-sky-200 dark:border-sky-800",
      inputBg: "bg-sky-100 dark:bg-sky-900/50",
      inputBorder: "border-sky-300 dark:border-sky-700",
      inputFocus: "focus:border-yellow-400",
      text: "text-sky-900 dark:text-sky-100",
      textSecondary: "text-sky-700 dark:text-sky-300",
      textMuted: "text-sky-600 dark:text-sky-400",
      closeButton:
        "text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200",
      primaryButton: theme.buttonPrimary,
      secondaryButton:
        "bg-sky-200 hover:bg-sky-300 text-sky-900 dark:bg-sky-800/50 dark:hover:bg-sky-700/50 dark:text-sky-100",
      tagBg: "bg-sky-200 dark:bg-sky-800/50",
      tagText: "text-sky-800 dark:text-sky-200",
      modeActive: "bg-yellow-400 border-yellow-400 text-sky-900",
      modeInactive:
        "bg-sky-100 border-sky-300 text-sky-600 hover:border-sky-400 dark:bg-sky-900/30 dark:border-sky-700 dark:text-sky-400",
    },
    evening: {
      modalBg: "bg-purple-50 dark:bg-purple-950/95",
      border: "border-purple-200 dark:border-purple-800",
      inputBg: "bg-purple-100 dark:bg-purple-900/50",
      inputBorder: "border-purple-300 dark:border-purple-700",
      inputFocus: "focus:border-purple-500",
      text: "text-purple-900 dark:text-purple-100",
      textSecondary: "text-purple-700 dark:text-purple-300",
      textMuted: "text-purple-600 dark:text-purple-400",
      closeButton:
        "text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200",
      primaryButton: theme.buttonPrimary,
      secondaryButton:
        "bg-purple-200 hover:bg-purple-300 text-purple-900 dark:bg-purple-800/50 dark:hover:bg-purple-700/50 dark:text-purple-100",
      tagBg: "bg-purple-200 dark:bg-purple-800/50",
      tagText: "text-purple-800 dark:text-purple-200",
      modeActive: "bg-purple-600 border-purple-600 text-white",
      modeInactive:
        "bg-purple-100 border-purple-300 text-purple-600 hover:border-purple-400 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-400",
    },
    night: {
      modalBg: "bg-indigo-50 dark:bg-indigo-950/95",
      border: "border-indigo-200 dark:border-indigo-800",
      inputBg: "bg-indigo-100 dark:bg-indigo-900/50",
      inputBorder: "border-indigo-300 dark:border-indigo-700",
      inputFocus: "focus:border-indigo-500",
      text: "text-indigo-900 dark:text-white",
      textSecondary: "text-indigo-700 dark:text-indigo-300",
      textMuted: "text-indigo-600 dark:text-indigo-400",
      closeButton:
        "text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200",
      primaryButton: theme.buttonPrimary,
      secondaryButton:
        "bg-indigo-200 hover:bg-indigo-300 text-indigo-900 dark:bg-indigo-800/50 dark:hover:bg-indigo-700/50 dark:text-indigo-100",
      tagBg: "bg-indigo-200 dark:bg-indigo-800/50",
      tagText: "text-indigo-800 dark:text-indigo-200",
      modeActive: "bg-indigo-500 border-indigo-500 text-white",
      modeInactive:
        "bg-indigo-100 border-indigo-300 text-indigo-600 hover:border-indigo-400 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400",
    },
  };

  return baseClasses[theme.name as keyof typeof baseClasses];
};
