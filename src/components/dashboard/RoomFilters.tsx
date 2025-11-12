import React from "react";
import { Monitor, Gamepad2, BookOpen, Coffee } from "lucide-react";
import { RoomMode } from "@/components/dashboard/types/room";

interface RoomFiltersProps {
  selectedMode: RoomMode | "all";
  onModeChange: (mode: RoomMode | "all") => void;
}

export default function RoomFilters({
  selectedMode,
  onModeChange,
}: RoomFiltersProps) {
  const filters = [
    {
      value: "all",
      label: "All Rooms",
      icon: Monitor,
      activeClass: "bg-gray-500/20 border-gray-500 text-gray-400",
      inactiveClass:
        "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600",
    },
    {
      value: "entertainment",
      label: "Entertainment",
      icon: Monitor,
      activeClass: "bg-purple-500/20 border-purple-500 text-purple-400",
      inactiveClass:
        "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600",
    },
    {
      value: "gaming",
      label: "Gaming",
      icon: Gamepad2,
      activeClass: "bg-green-500/20 border-green-500 text-green-400",
      inactiveClass:
        "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600",
    },
    {
      value: "study",
      label: "Study",
      icon: BookOpen,
      activeClass: "bg-blue-500/20 border-blue-500 text-blue-400",
      inactiveClass:
        "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600",
    },
    {
      value: "casual",
      label: "Casual",
      icon: Coffee,
      activeClass: "bg-yellow-500/20 border-yellow-500 text-yellow-400",
      inactiveClass:
        "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600",
    },
  ];

  return (
    <div className="flex gap-2 mt-4 flex-wrap">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isSelected = selectedMode === filter.value;

        return (
          <button
            key={filter.value}
            onClick={() => onModeChange(filter.value as RoomMode | "all")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
                      ${
                        isSelected ? filter.activeClass : filter.inactiveClass
                      }`}
          >
            <Icon size={16} />
            <span className="text-sm font-medium">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
}
