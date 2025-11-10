'use client';

import { useTheme } from '@/hooks/useTheme';
import { RoomMode } from './types/room';

interface RoomFiltersProps {
  selectedMode: RoomMode | 'all';
  onModeChange: (mode: RoomMode | 'all') => void;
}

export default function RoomFilters({ selectedMode, onModeChange }: RoomFiltersProps) {
  const theme = useTheme();
  
  const modes: (RoomMode | 'all')[] = ['all', 'casual', 'entertainment', 'gaming', 'study'];
  
  const getModeEmoji = (mode: RoomMode | 'all') => {
    const emojis = {
      all: '🌐',
      casual: '💬',
      entertainment: '🎬',
      gaming: '🎮',
      study: '📚',
    };
    return emojis[mode];
  };

  return (
    <div className="flex gap-2 mt-4 flex-wrap">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 capitalize
                    flex items-center gap-2 border-2 backdrop-blur-sm
                    ${selectedMode === mode
                      ? `${theme.buttonPrimary} border-transparent shadow-lg`
                      : `${theme.buttonSecondary} border-transparent opacity-70 hover:opacity-100`}`}
        >
          <span>{getModeEmoji(mode)}</span>
          <span>{mode}</span>
        </button>
      ))}
    </div>
  );
}