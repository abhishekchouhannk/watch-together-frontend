"use client";

import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { debounce } from "@/utils/debounce";
import { useCurrentTheme } from "@/hooks/useCurrentTheme";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search rooms by name, description, or tags...",
}: SearchBarProps) {
  const theme = useCurrentTheme();
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Theme-specific classes
  const getThemeClasses = () => {
    const baseClasses = {
      morning: {
        inputBg: "bg-white/20",
        inputBorder: "border-pink-300/90",
        inputFocusBorder: "border-pink-100",
        inputFocusBg: "bg-white/30",
        text: "text-rose-900",
        placeholder: "placeholder-rose-800",
        icon: "text-rose-500",
        iconHover: "hover:text-rose-600",
      },
      afternoon: {
        inputBg: "bg-sky-800/30",
        inputBorder: "border-sky-700/50",
        inputFocusBorder: "border-yellow-400",
        inputFocusBg: "bg-sky-800/50",
        text: "text-sky-100",
        placeholder: "placeholder-sky-400",
        icon: "text-sky-400",
        iconHover: "hover:text-sky-200",
      },
      evening: {
        inputBg: "bg-purple-800/30",
        inputBorder: "border-purple-700/50",
        inputFocusBorder: "border-purple-500",
        inputFocusBg: "bg-purple-800/50",
        text: "text-purple-100",
        placeholder: "placeholder-purple-400",
        icon: "text-purple-400",
        iconHover: "hover:text-purple-200",
      },
      night: {
        inputBg: "bg-indigo-800/30",
        inputBorder: "border-indigo-700/50",
        inputFocusBorder: "border-indigo-500",
        inputFocusBg: "bg-indigo-800/50",
        text: "text-white",
        placeholder: "placeholder-indigo-400",
        icon: "text-indigo-400",
        iconHover: "hover:text-indigo-200",
      },
    };

    return baseClasses[theme.name as keyof typeof baseClasses];
  };

  const themeClasses = getThemeClasses();

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
    setSearchValue("");
    onSearch("");
  };

  return (
    <div
      className={`relative transition-all duration-300 ${
        isFocused ? "scale-105" : "scale-100"
      }`}
    >
      <div className="relative">
        <Search
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeClasses.icon}`}
          size={20}
        />
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full pl-12 pr-12 py-3 ${
            isFocused ? themeClasses.inputFocusBg : themeClasses.inputBg
          } 
                   border ${themeClasses.inputBorder} rounded-xl
                   ${themeClasses.text} ${
            themeClasses.placeholder
          } focus:outline-none
                   focus:${
                     themeClasses.inputFocusBorder
                   } transition-all duration-200 backdrop-blur-sm`}
        />
        {searchValue && (
          <button
            onClick={clearSearch}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 ${themeClasses.icon} 
                     ${themeClasses.iconHover} transition-colors`}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
