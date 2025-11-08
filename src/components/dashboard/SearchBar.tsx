import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '@/utils/debounce';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchValue('');
    onSearch('');
  };

  return (
    <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search rooms by name, description, or tags..."
          className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl
                   text-white placeholder-gray-500 focus:outline-none focus:border-purple-500
                   focus:bg-gray-800/70 transition-all duration-200"
        />
        {searchValue && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 
                     hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}