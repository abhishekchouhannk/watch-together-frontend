import React, { useState } from 'react';
import { X, Lock, Unlock } from 'lucide-react';
import { RoomMode } from '@/components/dashboard/types/room';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: () => void;
}

export default function CreateRoomModal({ isOpen, onClose, onRoomCreated }: CreateRoomModalProps) {
  const [roomData, setRoomData] = useState({
    roomName: '',
    description: '',
    mode: 'casual' as RoomMode,
    isPublic: true,
    maxParticipants: 10,
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/rooms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(roomData),
        credentials: 'include'   // 🔑 this ensures cookies are sent   
      });

      if (response.ok) {
        onRoomCreated();
        onClose();
        // Reset form
        setRoomData({
          roomName: '',
          description: '',
          mode: 'casual',
          isPublic: true,
          maxParticipants: 10,
          tags: [],
        });
      }
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const addTag = () => {
    if (tagInput && !roomData.tags.includes(tagInput)) {
      setRoomData({ ...roomData, tags: [...roomData.tags, tagInput] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setRoomData({ ...roomData, tags: roomData.tags.filter(t => t !== tag) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Room</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Room Name *
            </label>
            <input
              type="text"
              required
              value={roomData.roomName}
              onChange={(e) => setRoomData({ ...roomData, roomName: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                       text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              placeholder="Enter room name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={roomData.description}
              onChange={(e) => setRoomData({ ...roomData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                       text-white placeholder-gray-500 focus:outline-none focus:border-purple-500
                       resize-none"
              placeholder="What's this room about?"
              rows={3}
              maxLength={200}
            />
            <span className="text-xs text-gray-500">
              {roomData.description.length}/200 characters
            </span>
          </div>

          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
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
                              ? 'bg-purple-600 border-purple-600 text-white'
                              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Max Participants */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Participants
              </label>
              <input
                type="number"
                min="2"
                max="50"
                value={roomData.maxParticipants}
                onChange={(e) => setRoomData({ ...roomData, maxParticipants: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                         text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                         text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                placeholder="Add tags"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                         transition-colors duration-200"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {roomData.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm
                           flex items-center gap-1"
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
              className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg
                       transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !roomData.roomName}
              className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg
                       transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}