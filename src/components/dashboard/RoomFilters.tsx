import React from 'react';
import { Monitor, Gamepad2, BookOpen, Coffee } from 'lucide-react';
import { RoomMode } from '@/components/dashboard/types/room';

interface RoomFiltersProps {
  selectedMode: RoomMode | 'all';
  onModeChange: (mode: RoomMode | 'all') => void;
}

export default function RoomFilters({ selectedMode, onModeChange }: RoomFiltersProps) {
  const filters = [
    { value: 'all', label: 'All Rooms', icon: Monitor, color: 'gray' },
    { value: 'entertainment', label: 'Entertainment', icon: Monitor, color: 'purple' },
    { value: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'green' },
    { value: 'study', label: 'Study', icon: BookOpen, color: 'blue' },
    { value: 'casual', label: 'Casual', icon: Coffee, color: 'yellow' },
  ];

  return (
    <div className="flex gap-2 mt-4 flex-wrap">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isSelected = selectedMode === filter.value;
        
        return (
          <button
            key={filter.value}
            onClick={() => onModeChange(filter.value as RoomMode | 'all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
                      ${isSelected 
                        ? `bg-${filter.color}-500/20 border-${filter.color}-500 text-${filter.color}-400` 
                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'}`}
          >
            <Icon size={16} />
            <span className="text-sm font-medium">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}