// "use client";

// import React, { useState } from "react";
// import {
//   Users,
//   MessageSquare,
//   Play,
//   Pause,
//   Volume2,
//   VolumeX,
//   Maximize,
//   Settings,
//   LogOut,
//   Home,
//   Send,
//   Smile,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";

// const WatchTogetherRoom = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [showControls, setShowControls] = useState(true);
//   const [chatMessage, setChatMessage] = useState("");
//   const [isChatCollapsed, setIsChatCollapsed] = useState(false);
//   const [selectedMode, setSelectedMode] = useState("entertainment");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [floatingEmojis, setFloatingEmojis] = useState([]);
//   const [reactionMode, setReactionMode] = useState("floating"); // 'floating' or 'highlight'
//   const [highlightedEmojis, setHighlightedEmojis] = useState({});

//   // Mock data
//   const participants = [
//     { id: 1, name: "You", status: "online", avatar: "🎮" },
//     { id: 2, name: "Alex", status: "online", avatar: "🎨" },
//     { id: 3, name: "Sam", status: "online", avatar: "🎭" },
//     { id: 4, name: "Jordan", status: "away", avatar: "🎪" },
//   ];

//   const messages = [
//     { id: 1, user: "Alex", message: "This is awesome! 🎉", time: "10:30" },
//     { id: 2, user: "Sam", message: "Love this part!", time: "10:31" },
//     { id: 3, user: "You", message: "Agreed! 😄", time: "10:32" },
//     { id: 4, user: "Alex", message: "This is so cool!", time: "10:33" },
//     { id: 5, user: "Jordan", message: "Hey everyone!", time: "10:34" },
//     { id: 6, user: "Sam", message: "Welcome back Jordan!", time: "10:35" },
//   ];

//   const modes = [
//     { id: "study", name: "Study", color: "bg-blue-500", emoji: "📚" },
//     { id: "gaming", name: "Gaming", color: "bg-purple-500", emoji: "🎮" },
//     {
//       id: "entertainment",
//       name: "Entertainment",
//       color: "bg-pink-500",
//       emoji: "🎬",
//     },
//   ];

//   const quickEmojis = ["❤️", "😂", "👍", "🔥", "😮", "👏"];

//   const getModeTheme = () => {
//     switch (selectedMode) {
//       case "study":
//         return "from-blue-50 to-blue-100";
//       case "gaming":
//         return "from-purple-50 to-purple-100";
//       case "entertainment":
//         return "from-pink-50 to-pink-100";
//       default:
//         return "from-gray-50 to-gray-100";
//     }
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (chatMessage.trim()) {
//       // Handle message send
//       setChatMessage("");
//     }
//   };

//   const handleEmojiReaction = (emoji, index) => {
//   if (reactionMode === 'floating') {
//     const id = Date.now();
//     setFloatingEmojis(prev => [...prev, { id, emoji, left: Math.random() * 80 + 10 }]);
//     setTimeout(() => {
//       setFloatingEmojis(prev => prev.filter(e => e.id !== id));
//     }, 3000);
//   } else {
//     // Highlight mode
//     setHighlightedEmojis(prev => ({ ...prev, [index]: true }));
//     setTimeout(() => {
//       setHighlightedEmojis(prev => ({ ...prev, [index]: false }));
//     }, 400);
//   }
// };

// // Expose function for testing in Chrome Dev Tools
// React.useEffect(() => {
//   window.triggerEmojiReaction = (emojiIndex) => {
//     if (emojiIndex >= 0 && emojiIndex < quickEmojis.length) {
//       handleEmojiReaction(quickEmojis[emojiIndex], emojiIndex);
//     } else {
//       console.log('Valid emoji indices: 0-5');
//       console.log('Usage: triggerEmojiReaction(0) for ❤️');
//       console.log('quickEmojis:', quickEmojis);
//     }
//   };
  
//   return () => {
//     delete window.triggerEmojiReaction;
//   };
// }, [reactionMode, quickEmojis]);

//   return (
//     <div
//       className={`min-h-screen bg-gradient-to-br ${getModeTheme()} transition-colors duration-500`}
//     >
//       {/* Top Navigation Bar */}
//       <nav className="bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
//         <div className="flex items-center gap-4">
//           <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
//             <Home className="w-5 h-5 text-gray-700" />
//           </button>
//           <div>
//             <h1 className="text-xl font-bold text-gray-800">Movie Night 🍿</h1>
//             <p className="text-xs text-gray-500">
//               {participants.length} watching
//             </p>
//           </div>
//         </div>

//         {/* Mode Selector - Desktop Only */}
//         <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-full p-1">
//           {modes.map((mode) => (
//             <button
//               key={mode.id}
//               onClick={() => setSelectedMode(mode.id)}
//               className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2
//                 ${
//                   selectedMode === mode.id
//                     ? `${mode.color} text-white shadow-lg scale-105`
//                     : "text-gray-600 hover:bg-gray-200"
//                 }`}
//             >
//               <span>{mode.emoji}</span>
//               <span className="hidden lg:inline">{mode.name}</span>
//             </button>
//           ))}
//         </div>

//         <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
//           <LogOut className="w-4 h-4" />
//           <span className="hidden sm:inline">Leave</span>
//         </button>
//       </nav>

//       {/* Main Content Area */}
//       <div className="lg:flex lg:gap-4 lg:p-4 max-w-[2000px] mx-auto">
//         {/* Left Section: Video + Participants */}
//         <div className="flex-1 lg:flex lg:flex-col lg:gap-4">
//           {/* Participants Bar - Desktop */}
//           <div className="hidden lg:flex items-center gap-2 bg-white rounded-xl p-3 shadow-lg">
//             <Users className="w-5 h-5 text-gray-600" />
//             <span className="font-semibold text-gray-700 mr-2">Watching:</span>
//             <div className="flex gap-2 flex-1 overflow-x-auto">
//               {participants.map((participant) => (
//                 <div
//                   key={participant.id}
//                   className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5"
//                 >
//                   <span className="text-xl">{participant.avatar}</span>
//                   <span className="text-sm font-medium text-gray-700">
//                     {participant.name}
//                   </span>
//                   <span
//                     className={`w-2 h-2 rounded-full ${
//                       participant.status === "online"
//                         ? "bg-green-500"
//                         : "bg-yellow-500"
//                     }`}
//                   ></span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Video Section - Sticky on Mobile */}
//           <div className="lg:static sticky top-[61px] z-40 bg-white lg:bg-transparent">
//             {/* Video Player */}
//             <div
//               className="relative bg-black lg:rounded-xl overflow-hidden shadow-2xl aspect-video group"
//               onMouseEnter={() => setShowControls(true)}
//               onMouseLeave={() => setShowControls(false)}
//             >
//               {/* Video Placeholder */}
//               <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
//                 <div className="text-center">
//                   <Play className="w-20 h-20 text-white/50 mx-auto mb-4" />
//                   <p className="text-white/70">Video Player Area</p>
//                 </div>
//               </div>

//               {/* Floating Emojis - Only show in floating mode */}
// {reactionMode === 'floating' && floatingEmojis.map(emoji => (
//   <div
//     key={emoji.id}
//     className="absolute bottom-20 text-3xl md:text-4xl animate-float-up pointer-events-none z-30"
//     style={{ left: `${emoji.left}%` }}
//   >
//     {emoji.emoji}
//   </div>
// ))}

//               {/* Video Controls Overlay */}
//               <div
//                 className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 transition-opacity duration-300 ${
//                   showControls ? "opacity-100" : "opacity-0"
//                 }`}
//               >
//                 {/* Play/Pause Center Button */}
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <button
//                     onClick={() => setIsPlaying(!isPlaying)}
//                     className="w-16 h-16 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all hover:scale-110"
//                   >
//                     {isPlaying ? (
//                       <Pause className="w-8 h-8 text-white" />
//                     ) : (
//                       <Play className="w-8 h-8 text-white ml-1" />
//                     )}
//                   </button>
//                 </div>

//                 {/* Bottom Controls */}
//                 <div className="absolute bottom-0 left-0 right-0 p-4">
//                   {/* Progress Bar */}
//                   <div className="w-full h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer hover:h-2 transition-all">
//                     <div className="h-full w-1/3 bg-red-500 rounded-full relative">
//                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
//                     </div>
//                   </div>

//                   {/* Control Buttons */}
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <button
//                         onClick={() => setIsPlaying(!isPlaying)}
//                         className="text-white hover:scale-110 transition-transform"
//                       >
//                         {isPlaying ? (
//                           <Pause className="w-6 h-6" />
//                         ) : (
//                           <Play className="w-6 h-6" />
//                         )}
//                       </button>
//                       <button
//                         onClick={() => setIsMuted(!isMuted)}
//                         className="text-white hover:scale-110 transition-transform"
//                       >
//                         {isMuted ? (
//                           <VolumeX className="w-6 h-6" />
//                         ) : (
//                           <Volume2 className="w-6 h-6" />
//                         )}
//                       </button>
//                       <div className="text-white text-sm font-medium">
//                         12:34 / 45:67
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <button className="text-white hover:scale-110 transition-transform">
//                         <Settings className="w-6 h-6" />
//                       </button>
//                       <button className="text-white hover:scale-110 transition-transform">
//                         <Maximize className="w-6 h-6" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Quick Emoji Reactions */}
// <div className="absolute bottom-20 md:bottom-24 right-2 flex flex-col gap-2 z-20">
//   {/* Toggle Button */}
//   <button
//     onClick={() => setReactionMode(prev => prev === 'floating' ? 'highlight' : 'floating')}
//     className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg mb-1"
//     title={reactionMode === 'floating' ? 'Switch to Highlight Mode' : 'Switch to Floating Mode'}
//   >
//     <span className="text-lg">
//       {reactionMode === 'floating' ? '✨' : '💫'}
//     </span>
//   </button>
  
//   {/* Emoji Buttons */}
//   {quickEmojis.map((emoji, index) => (
//     <button
//       key={index}
//       onClick={() => handleEmojiReaction(emoji, index)}
//       className={`w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-xl transition-all hover:scale-110
//         ${highlightedEmojis[index] ? 'emoji-highlight' : ''}`}
//     >
//       {emoji}
//     </button>
//   ))}
// </div>
//             </div>

//             {/* Participants Bar - Mobile (Below Video, part of sticky section) */}
//             <div className="lg:hidden bg-white p-3 shadow-md">
//               <div className="flex items-center gap-2 mb-2">
//                 <Users className="w-5 h-5 text-gray-600" />
//                 <span className="font-semibold text-gray-700">
//                   Watching Now
//                 </span>
//               </div>
//               <div className="flex gap-2 overflow-x-auto pb-2">
//                 {participants.map((participant) => (
//                   <div
//                     key={participant.id}
//                     className="flex flex-col items-center gap-1 min-w-fit"
//                   >
//                     <div className="relative">
//                       <span className="text-2xl">{participant.avatar}</span>
//                       <span
//                         className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
//                           participant.status === "online"
//                             ? "bg-green-500"
//                             : "bg-yellow-500"
//                         }`}
//                       ></span>
//                     </div>
//                     <span className="text-xs text-gray-600">
//                       {participant.name}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Mode Selector - Mobile (part of sticky section) */}
//             <div className="md:hidden flex gap-2 bg-white p-3 shadow-md overflow-x-auto border-t border-gray-100">
//               {modes.map((mode) => (
//                 <button
//                   key={mode.id}
//                   onClick={() => setSelectedMode(mode.id)}
//                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 whitespace-nowrap
//                     ${
//                       selectedMode === mode.id
//                         ? `${mode.color} text-white shadow-lg`
//                         : "bg-gray-100 text-gray-600"
//                     }`}
//                 >
//                   <span>{mode.emoji}</span>
//                   <span>{mode.name}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right Section: Chat Panel */}
//         {/* Desktop: Fixed sidebar, Mobile: Takes remaining viewport height */}
//         <div className="lg:w-96 lg:rounded-xl lg:shadow-2xl bg-white flex flex-col lg:h-[calc(100vh-120px)] lg:sticky lg:top-[85px]">
//           {/* Chat Header */}
//           <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 lg:rounded-t-xl flex-shrink-0">
//             <div className="flex items-center gap-2">
//               <MessageSquare className="w-5 h-5 text-purple-600" />
//               <h2 className="font-bold text-gray-800">Live Chat</h2>
//               <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
//                 {messages.length}
//               </span>
//             </div>
//           </div>

//           {/* Chat Messages - Dynamically sized to fit viewport */}
//           <div
//             className="flex-1 overflow-y-auto p-4 space-y-3"
//             style={{
//               // Mobile: Calculate height based on viewport minus sticky elements
//               height: "calc(100vh - 61px - 56.25vw - 90px - 120px - 80px)", // topbar - video aspect ratio - participants - mode selector - chat input
//               maxHeight: "calc(100vh - 61px - 56.25vw - 90px - 120px - 80px)",
//             }}
//           >
//             {messages.map((message) => (
//               <div key={message.id} className="flex gap-3 animate-fade-in">
//                 <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
//                   {message.user[0]}
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className="font-semibold text-sm text-gray-800">
//                       {message.user}
//                     </span>
//                     <span className="text-xs text-gray-400">
//                       {message.time}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
//                     {message.message}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Chat Input - Always visible at bottom */}
//           <div className="p-4 border-t border-gray-200 bg-gray-50 lg:rounded-b-xl flex-shrink-0">
//             <form onSubmit={handleSendMessage} className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                 className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
//               >
//                 <Smile className="w-5 h-5 text-gray-600" />
//               </button>
//               <input
//                 type="text"
//                 value={chatMessage}
//                 onChange={(e) => setChatMessage(e.target.value)}
//                 placeholder="Type a message..."
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//               />
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-2 flex-shrink-0"
//               >
//                 <Send className="w-4 h-4" />
//               </button>
//             </form>

//             {/* Quick Emoji Picker */}
//             {showEmojiPicker && (
//               <div className="mt-2 flex gap-2 animate-fade-in flex-wrap">
//                 {quickEmojis.map((emoji, index) => (
//                   <button
//                     key={index}
//                     onClick={() => {
//                       setChatMessage(chatMessage + emoji);
//                       setShowEmojiPicker(false);
//                     }}
//                     className="text-2xl hover:scale-125 transition-transform"
//                   >
//                     {emoji}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Custom CSS for animations */}
//       <style jsx>{`
//   @keyframes float-up {
//     0% {
//       transform: translateY(0) scale(1);
//       opacity: 1;
//     }
//     100% {
//       transform: translateY(-200px) scale(1.5);
//       opacity: 0;
//     }
//   }

//   .animate-float-up {
//     animation: float-up 3s ease-out forwards;
//   }

//   @keyframes fade-in {
//     from {
//       opacity: 0;
//       transform: translateY(10px);
//     }
//     to {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   }

//   .animate-fade-in {
//     animation: fade-in 0.3s ease-out;
//   }

//   @keyframes emoji-pulse {
//     0% {
//       transform: scale(1);
//       background-color: rgba(255, 255, 255, 0.2);
//     }
//     50% {
//       transform: scale(1.4);
//       background-color: rgba(147, 197, 253, 0.9);
//       box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
//     }
//     100% {
//       transform: scale(1);
//       background-color: rgba(255, 255, 255, 0.2);
//     }
//   }

//   .emoji-highlight {
//     animation: emoji-pulse 0.4s ease-in-out;
//   }

//   /* Hide scrollbar for Chrome, Safari and Opera */
//   .overflow-y-auto::-webkit-scrollbar {
//     width: 6px;
//   }

//   .overflow-y-auto::-webkit-scrollbar-track {
//     background: #f1f1f1;
//   }

//   .overflow-y-auto::-webkit-scrollbar-thumb {
//     background: #888;
//     border-radius: 3px;
//   }

//   .overflow-y-auto::-webkit-scrollbar-thumb:hover {
//     background: #555;
//   }

//   /* For desktop - override mobile height calculation */
//   @media (min-width: 1024px) {
//     .overflow-y-auto {
//       height: auto !important;
//       max-height: none !important;
//     }
//   }
// `}</style>
//     </div>
//   );
// };

// export default WatchTogetherRoom;
