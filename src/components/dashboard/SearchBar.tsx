'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchValue('');
    onSearch('');
  };

  const getBorderColor = () => {
    const colors = {
      morning: 'focus:ring-orange-500/50',
      afternoon: 'focus:ring-sky-500/50',
      evening: 'focus:ring-purple-500/50',
      night: 'focus:ring-indigo-500/50',
    };
    return colors[theme.name as keyof typeof colors];
  };

  return (
    <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}>
      <div className="relative">
        <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme.textColor} opacity-60`} size={20} />
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search rooms by name, description, or tags..."
          className={`w-full pl-12 pr-12 py-3 backdrop-blur-sm rounded-xl
                   ${theme.textColor} placeholder-gray-500 focus:outline-none
                   focus:ring-2 ${getBorderColor()} transition-all duration-200 border-2`}
          style={{
            backgroundColor: theme.name === 'night' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(0, 0, 0, 0.2)',
            borderColor: isFocused ? 
              (theme.name === 'morning' ? 'rgba(251, 146, 60, 0.5)' :
               theme.name === 'afternoon' ? 'rgba(56, 189, 248, 0.5)' :
               theme.name === 'evening' ? 'rgba(168, 85, 247, 0.5)' :
               'rgba(129, 140, 248, 0.5)') : 'rgba(107, 114, 128, 0.3)'
          }}
        />
        {searchValue && (
          <button
            onClick={clearSearch}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${theme.textColor} 
                     opacity-60 hover:opacity-100 transition-opacity`}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}