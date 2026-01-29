// WatchTogetherRoom.tsx (Updated with socket integration)
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Home,
  LogOut,
  Users,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  MessageSquare,
  Send,
  Smile,
} from 'lucide-react';
// import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LogoutButton from '@/components/auth/LogoutButton';
import VideoPlayer from '@/components/videoPlayerA';

interface User {
  id: string;
  name: string;
  status: 'online' | 'away';
  avatar: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  time: string;
  roomId: string;
}

interface FloatingEmoji {
  id: number;
  emoji: string;
  left: number;
}

const WatchTogetherRoom = () => {
  // Socket state
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const roomId = '1'; // Hardcoded for MVP

  // UI state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [selectedMode, setSelectedMode] = useState("entertainment");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [reactionMode, setReactionMode] = useState("floating");
  const [highlightedEmojis, setHighlightedEmojis] = useState<{[key: number]: boolean}>({});

  // Data from server
  const [participants, setParticipants] = useState<User[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const modes = [
    { id: "study", name: "Study", color: "bg-blue-500", emoji: "📚" },
    { id: "gaming", name: "Gaming", color: "bg-purple-500", emoji: "🎮" },
    { id: "entertainment", name: "Entertainment", color: "bg-pink-500", emoji: "🎬" },
  ];

  const quickEmojis = ["❤️", "😂", "👍", "🔥", "😮", "👏"];

  // Initialize socket connection
  useEffect(() => {
    const storedName = sessionStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
      connectToRoom(storedName);
    } else {
      // Show name prompt
      const name = prompt('Enter your name to join the watch party:');
      if (name) {
        sessionStorage.setItem('userName', name);
        setUserName(name);
        connectToRoom(name);
      }
    }

    // Handle page visibility for away status
    const handleVisibilityChange = () => {
      if (socket && isJoined) {
        if (document.hidden) {
          socket.emit('user-away', { roomId });
        } else {
          socket.emit('user-back', { roomId });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const connectToRoom = (name: string) => {
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      newSocket.emit('join-room', { roomId, userName: name });
      setIsJoined(true);
    });

    // Handle user updates
    newSocket.on('users-update', (users: User[]) => {
      setParticipants(users);
    });

    // Handle user join/leave messages
    newSocket.on('user-joined', ({ message }) => {
      if (message) {
        setMessages(prev => [...prev, message]);
      }
    });

    newSocket.on('user-left',({ message }) => {
      if (message) {
        setMessages(prev => [...prev, message]);
      }
    });

    // Handle chat messages
    newSocket.on('chat-history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    newSocket.on('new-message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    // Handle emoji reactions
    newSocket.on('emoji-reaction', ({ userId, userName, emoji }) => {
      // Show floating emoji
      if (userId !== newSocket.id) {
        handleRemoteEmojiReaction(emoji);
      }
    });

    // Handle room state
    newSocket.on('room-state', (state) => {
      setIsPlaying(state.isPlaying);
      setSelectedMode(state.mode);
      if (videoRef.current) {
        videoRef.current.currentTime = state.currentTime;
        if (state.isPlaying) {
          videoRef.current.play().catch(console.error);
        } else {
          videoRef.current.pause();
        }
      }
    });

    // Handle mode changes
    newSocket.on('mode-changed', ({ mode }) => {
      setSelectedMode(mode);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    setSocket(newSocket);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getModeTheme = () => {
    switch (selectedMode) {
      case "study":
        return "from-blue-50 to-blue-100";
      case "gaming":
        return "from-purple-50 to-purple-100";
      case "entertainment":
        return "from-pink-50 to-pink-100";
      default:
        return "from-gray-50 to-gray-100";
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim() && socket) {
      socket.emit('send-message', { roomId, message: chatMessage });
      setChatMessage("");
    }
  };

  const handleModeChange = (modeId: string) => {
    if (socket) {
      socket.emit('change-mode', { roomId, mode: modeId });
    }
  };

  const handleEmojiReaction = (emoji: string, index: number) => {
    if (socket) {
      socket.emit('emoji-reaction', { roomId, emoji });
    }

    if (reactionMode === 'floating') {
      const id = Date.now();
      setFloatingEmojis(prev => [...prev, { id, emoji, left: Math.random() * 80 + 10 }]);
      setTimeout(() => {
        setFloatingEmojis(prev => prev.filter(e => e.id !== id));
      }, 3000);
    } else {
      setHighlightedEmojis(prev => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setHighlightedEmojis(prev => ({ ...prev, [index]: false }));
      }, 400);
    }
  };

  const handleRemoteEmojiReaction = (emoji: string) => {
    const id = Date.now();
    setFloatingEmojis(prev => [...prev, { id, emoji, left: Math.random() * 80 + 10 }]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 3000);
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsJoined(false);
      setParticipants([]);
      setMessages([]);
      sessionStorage.removeItem('userName');
      // Redirect to dashboard or home
      window.location.href = '/dashboard';
    }
  };

  // Show loading or name entry if not joined
  if (!isJoined || !socket) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-white text-xl">Connecting to watch party...</div>
        </div>
    );
  }

  return (
      <div className={`min-h-screen bg-gradient-to-br ${getModeTheme()} transition-colors duration-500`}>
        {/* Top Navigation Bar */}
        <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Movie Night 🍿</h1>
              <p className="text-xs text-gray-500">
                {participants.length} watching • {isConnected ? 
                  <span className="text-green-600">Connected</span> : 
                  <span className="text-red-600">Disconnected</span>
                }
              </p>
            </div>
          </div>

          {/* Mode Selector - Desktop Only */}
          <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full p-1">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleModeChange(mode.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
                  ${selectedMode === mode.id
                    ? `${mode.color} text-white shadow-lg scale-105`
                    : "text-gray-600 hover:bg-gray-200"
                  }`}
              >
                <span>{mode.emoji}</span>
                <span className="hidden lg:inline">{mode.name}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={handleLeaveRoom}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </nav>

        {/* Main Content Area */}
        <div className="lg:flex lg:gap-4 lg:p-4 max-w-[2000px] mx-auto">
          {/* Left Section: Video + Participants */}
          <div className="flex-1 lg:flex lg:flex-col lg:gap-4">
            {/* Participants Bar - Desktop */}
            <div className="hidden lg:flex items-center gap-2 bg-white rounded-xl p-3 shadow-lg">
              <Users className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-700 mr-2">Watching:</span>
              <div className="flex gap-2 flex-1 overflow-x-auto">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5"
                  >
                    <span className="text-xl">{participant.avatar}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {participant.name}
                      {participant.id === socket?.id && ' (You)'}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        participant.status === "online"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    ></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Section */}
            <div className="lg:static sticky top-[61px] z-40 bg-white lg:bg-transparent">
              {socket && (
                <VideoPlayer 
                  socket={socket} 
                  roomId={roomId}
                  floatingEmojis={floatingEmojis}
                  reactionMode={reactionMode}
                  setReactionMode={setReactionMode}
                  highlightedEmojis={highlightedEmojis}
                  quickEmojis={quickEmojis}
                  handleEmojiReaction={handleEmojiReaction}
                />
              )}

              {/* Participants Bar - Mobile */}
              <div className="lg:hidden bg-white p-3 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-700">Watching Now</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex flex-col items-center gap-1 min-w-fit"
                    >
                      <div className="relative">
                        <span className="text-2xl">{participant.avatar}</span>
                        <span
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            participant.status === "online"
                              ? "bg-green-500"
                              : "bg-yellow-500"
                          }`}
                        ></span>
                      </div>
                      <span className="text-xs text-gray-600">
                        {participant.name}
                        {participant.id === socket?.id && ' (You)'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mode Selector - Mobile */}
              <div className="md:hidden flex gap-2 bg-white p-3 shadow-md overflow-x-auto border-t border-gray-100">
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                      ${selectedMode === mode.id
                        ? `${mode.color} text-white shadow-lg`
                        : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    <span>{mode.emoji}</span>
                    <span>{mode.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section: Chat Panel */}
          <div className="lg:w-96 lg:rounded-xl lg:shadow-2xl bg-white flex flex-col lg:h-[calc(100vh-120px)] lg:sticky lg:top-[85px]">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 lg:rounded-t-xl flex-shrink-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h2 className="font-bold text-gray-800">Live Chat</h2>
                <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {messages.length}
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{
                height: "calc(100vh - 61px - 56.25vw - 90px - 120px - 80px)",
                maxHeight: "calc(100vh - 61px - 56.25vw - 90px - 120px - 80px)",
              }}
            >
              {messages.map((message) => (
                <div key={message.id} className="flex gap-3 animate-fade-in">
                  {message.userId === 'system' ? (
                    <div className="w-full text-center">
                      <span className="text-xs text-gray-500 italic">{message.message}</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {message.userName[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-gray-800">
                            {message.userName}
                            {message.userId === socket?.id && ' (You)'}
                          </span>
                          <span className="text-xs text-gray-400">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                          {message.message}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 lg:rounded-b-xl flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                >
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-2 flex-shrink-0"
                  disabled={!chatMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Emoji Picker */}
              {showEmojiPicker && (
                <div className="mt-2 flex gap-2 animate-fade-in flex-wrap">
                  {quickEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setChatMessage(chatMessage + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-2xl hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add required styles */}
        <style jsx>{`
          @keyframes float-up {
            0% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translateY(-200px) scale(1.5);
              opacity: 0;
            }
          }
          .animate-float-up {
            animation: float-up 3s ease-out forwards;
          }
          .emoji-highlight {
            animation: highlight 0.4s ease-out;
          }
          @keyframes highlight {
            0% {
              transform: scale(1);
              background-color: rgba(255, 255, 255, 0.2);
            }
            50% {
              transform: scale(1.3);
              background-color: rgba(255, 255, 255, 0.5);
            }
            100% {
              transform: scale(1);
              background-color: rgba(255, 255, 255, 0.2);
            }
          }
        `}</style>
      </div>
  );
};

export default WatchTogetherRoom;