'use client';

import { useState } from 'react';
import { X, Lock, Unlock } from 'lucide-react';
import { RoomMode } from './types/room';
import { useTheme } from '@/hooks/useTheme';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: () => void;
}

export default function CreateRoomModal({ isOpen, onClose, onRoomCreated }: CreateRoomModalProps) {
  const theme = useTheme();
  const [isCreating, setIsCreating] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [roomData, setRoomData] = useState({
    roomName: '',
    description: '',
    mode: 'casual' as RoomMode,
    isPublic: true,
    maxParticipants: 10,
    tags: [] as string[],
  });

  if (!isOpen) return null;

  // Theme-specific classes
  const getThemeClasses = () => {
    const baseClasses = {
      morning: {
  modalBg: 'bg-pink-200/90 backdrop-blur-lg',
  border: 'border-pink-400 dark:border-rose-700/70',
  inputBg: 'bg-white/20 dark:bg-white/20',
  inputBorder: 'border-pink-300 dark:border-rose-400/30',
  inputFocus: 'focus:border-rose-800',
  text: 'text-rose-900 dark:text-rose-800',
  textSecondary: 'text-rose-800 dark:text-rose-800',
  textMuted: 'text-rose-700 dark:text-rose-700',
  closeButton:
    'text-rose-500 hover:text-rose-700 dark:text-rose-700 dark:hover:text-rose-100 transition-colors',
  primaryButton:
    'bg-rose-800 hover:bg-rose-900 text-white shadow-md shadow-pink-200/40',
  secondaryButton:
    'bg-white/20 hover:bg-white/40 text-rose-900',
  tagBg: 'bg-rose-200/80 dark:bg-rose-600/20',
  tagText: 'text-rose-900 dark:text-rose-900',
  modeActive: 'bg-rose-800 border-rose-300 text-white',
  modeInactive:
    'bg-white/20 border-rose-300 text-rose-700 hover:border-rose-400',
},

      afternoon: {
        modalBg: 'bg-sky-50 dark:bg-sky-950/95',
        border: 'border-sky-200 dark:border-sky-800',
        inputBg: 'bg-sky-100 dark:bg-sky-900/50',
        inputBorder: 'border-sky-300 dark:border-sky-700',
        inputFocus: 'focus:border-yellow-400',
        text: 'text-sky-900 dark:text-sky-100',
        textSecondary: 'text-sky-700 dark:text-sky-300',
        textMuted: 'text-sky-600 dark:text-sky-400',
        closeButton: 'text-sky-600 hover:text-sky-800 dark:text-sky-400 dark:hover:text-sky-200',
        primaryButton: theme.buttonPrimary,
        secondaryButton: 'bg-sky-200 hover:bg-sky-300 text-sky-900 dark:bg-sky-800/50 dark:hover:bg-sky-700/50 dark:text-sky-100',
        tagBg: 'bg-sky-200 dark:bg-sky-800/50',
        tagText: 'text-sky-800 dark:text-sky-200',
        modeActive: 'bg-yellow-400 border-yellow-400 text-sky-900',
        modeInactive: 'bg-sky-100 border-sky-300 text-sky-600 hover:border-sky-400 dark:bg-sky-900/30 dark:border-sky-700 dark:text-sky-400',
      },
      evening: {
        modalBg: 'bg-purple-50 dark:bg-purple-950/95',
        border: 'border-purple-200 dark:border-purple-800',
        inputBg: 'bg-purple-100 dark:bg-purple-900/50',
        inputBorder: 'border-purple-300 dark:border-purple-700',
        inputFocus: 'focus:border-purple-500',
        text: 'text-purple-900 dark:text-purple-100',
        textSecondary: 'text-purple-700 dark:text-purple-300',
        textMuted: 'text-purple-600 dark:text-purple-400',
        closeButton: 'text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200',
        primaryButton: theme.buttonPrimary,
        secondaryButton: 'bg-purple-200 hover:bg-purple-300 text-purple-900 dark:bg-purple-800/50 dark:hover:bg-purple-700/50 dark:text-purple-100',
        tagBg: 'bg-purple-200 dark:bg-purple-800/50',
        tagText: 'text-purple-800 dark:text-purple-200',
        modeActive: 'bg-purple-600 border-purple-600 text-white',
        modeInactive: 'bg-purple-100 border-purple-300 text-purple-600 hover:border-purple-400 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-400',
      },
      night: {
        modalBg: 'bg-indigo-50 dark:bg-indigo-950/95',
        border: 'border-indigo-200 dark:border-indigo-800',
        inputBg: 'bg-indigo-100 dark:bg-indigo-900/50',
        inputBorder: 'border-indigo-300 dark:border-indigo-700',
        inputFocus: 'focus:border-indigo-500',
        text: 'text-indigo-900 dark:text-white',
        textSecondary: 'text-indigo-700 dark:text-indigo-300',
        textMuted: 'text-indigo-600 dark:text-indigo-400',
        closeButton: 'text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200',
        primaryButton: theme.buttonPrimary,
        secondaryButton: 'bg-indigo-200 hover:bg-indigo-300 text-indigo-900 dark:bg-indigo-800/50 dark:hover:bg-indigo-700/50 dark:text-indigo-100',
        tagBg: 'bg-indigo-200 dark:bg-indigo-800/50',
        tagText: 'text-indigo-800 dark:text-indigo-200',
        modeActive: 'bg-indigo-500 border-indigo-500 text-white',
        modeInactive: 'bg-indigo-100 border-indigo-300 text-indigo-600 hover:border-indigo-400 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-400',
      },
    };

    return baseClasses[theme.name as keyof typeof baseClasses];
  };

  const themeClasses = getThemeClasses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    // Your submit logic here
    setTimeout(() => {
      setIsCreating(false);
      onRoomCreated();
      onClose();
    }, 1000);
  };

  const addTag = () => {
    if (tagInput.trim() && !roomData.tags.includes(tagInput.trim())) {
      setRoomData({ ...roomData, tags: [...roomData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setRoomData({ ...roomData, tags: roomData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className={`${themeClasses.modalBg} rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto border ${themeClasses.border}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Create New Room</h2>
          <button
            onClick={onClose}
            className={`${themeClasses.closeButton} transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Name */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
              Room Name *
            </label>
            <input
              type="text"
              required
              value={roomData.roomName}
              onChange={(e) => setRoomData({ ...roomData, roomName: e.target.value })}
              className={`w-full px-4 py-2 ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-lg
                       ${themeClasses.text} placeholder-gray-500 focus:outline-none ${themeClasses.inputFocus}`}
              placeholder="Enter room name"
            />
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
              Description
            </label>
            <textarea
              value={roomData.description}
              onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
              className={`w-full px-4 py-2 ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-lg
                       ${themeClasses.text} placeholder-gray-500 focus:outline-none ${themeClasses.inputFocus}
                       resize-none`}
              placeholder="What's this room about?"
              rows={3}
              maxLength={200}
            />
            <span className={`text-xs ${themeClasses.textMuted}`}>
              {roomData.description.length}/200 characters
            </span>
          </div>

          {/* Mode Selection */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
              Room Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['casual', 'entertainment', 'gaming', 'study'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setRoomData({ ...roomData, mode: mode as RoomMode })}
                  className={`py-2 px-4 rounded-lg border transition-all duration-200 capitalize
                            ${roomData.mode === mode
                              ? themeClasses.modeActive
                              : themeClasses.modeInactive}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Max Participants */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                Privacy
              </label>
              <button
                type="button"
                onClick={() => setRoomData({ ...roomData, isPublic: !roomData.isPublic })}
                className={`w-full py-2 px-4 rounded-lg border flex items-center justify-center gap-2
                          transition-all duration-200
                          ${roomData.isPublic
                            ? 'bg-green-500/20 border-green-500 text-green-400'
                            : 'bg-red-500/20 border-red-500 text-red-400'}`}
              >
                {roomData.isPublic ? <Unlock size={18} /> : <Lock size={18} />}
                {roomData.isPublic ? 'Public' : 'Private'}
              </button>
            </div>

            <div>
              <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
                Max Participants
              </label>
              <input
                type="number"
                min="2"
                max="50"
                value={roomData.maxParticipants}
                onChange={(e) => setRoomData({ ...roomData, maxParticipants: parseInt(e.target.value) })}
                className={`w-full px-4 py-2 ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-lg
                         ${themeClasses.text} focus:outline-none ${themeClasses.inputFocus}`}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className={`flex-1 px-4 py-2 ${themeClasses.inputBg} border ${themeClasses.inputBorder} rounded-lg
                         ${themeClasses.text} placeholder-gray-500 focus:outline-none ${themeClasses.inputFocus}`}
                placeholder="Add tags"
              />
              <button
                type="button"
                onClick={addTag}
                className={`px-4 py-2 ${themeClasses.primaryButton} rounded-lg transition-colors duration-200`}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {roomData.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 ${themeClasses.tagBg} ${themeClasses.tagText} rounded-full text-sm
                           flex items-center gap-1`}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-2 ${themeClasses.secondaryButton} rounded-lg
                       transition-colors duration-200`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !roomData.roomName}
              className={`flex-1 py-2 ${themeClasses.primaryButton} rounded-lg
                       transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isCreating ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}