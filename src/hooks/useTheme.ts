// hooks/useTheme.ts
'use client';

import { useMemo } from 'react';
import { TIME_THEMES, getTimeOfDay } from '@/theme/BackgroundConstants';
import { useBackground } from '@/components/landingPage/BackgroundProvider';

export function useTheme() {
  const { selectedTheme } = useBackground();
  const theme = TIME_THEMES[selectedTheme];
  
  return theme;
}