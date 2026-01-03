// hooks/useBackground.ts\
'use client';

import { useContext } from 'react';
import { BackgroundContext } from '@/contexts/BackgroundContext';

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackground must be used within BackgroundProvider");
  }
  return context;
};