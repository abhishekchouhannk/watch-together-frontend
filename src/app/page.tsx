"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socket";
import AnimatedLandingPage from '@/components/animatedLandingPages/animatedLandingPage';

export default function HomePage() {
  // placeholder data
  const recentRooms = [
    { id: "123", name: "Movie Night" },
    { id: "456", name: "Anime Marathon" },
    { id: "789", name: "Lecture Study" },
  ];

  const handleCreateRoom = () => {
    console.log("Create Room clicked"); // replace with real navigation / logic
  };

  const handleJoinRoom = () => {
    console.log("Join Room clicked"); // replace with real navigation / logic
  };

  // setting up a basic socket connection
  useEffect(() => {
    socket.connect();

    socket.emit("join_room", { roomId: "123" });

    socket.on("message", (data) => console.log(data));

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <AnimatedLandingPage />
    // <main className="bg-background text-white min-h-screen">
    //   {/* Hero Section */}
    //   <section className="bg-surface p-12 rounded-b-3xl text-center shadow-md">
    //     <h1 className="text-5xl font-bold text-primary mb-4">Watch Together</h1>
    //     <p className="text-gray-300 mb-6">
    //       Watch movies, anime, and lectures with friends in real time
    //     </p>
    //     <div className="flex justify-center gap-4 flex-wrap">
    //       <button
    //         onClick={handleCreateRoom}
    //         className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition"
    //       >
    //         Create Room
    //       </button>
    //       <button
    //         onClick={handleJoinRoom}
    //         className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-lg transition"
    //       >
    //         Join Room
    //       </button>
    //     </div>
    //   </section>

    //   {/* Features Section */}
    //   <section className="mt-12 px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
    //     <div className="bg-surface p-6 rounded-lg shadow hover:shadow-lg transition">
    //       <h3 className="text-primary font-semibold mb-2">
    //         Synchronized Playback
    //       </h3>
    //       <p className="text-gray-300">
    //         Everyone watches the video at the same time, no lag.
    //       </p>
    //     </div>
    //     <div className="bg-surface p-6 rounded-lg shadow hover:shadow-lg transition">
    //       <h3 className="text-primary font-semibold mb-2">Real-Time Chat</h3>
    //       <p className="text-gray-300">
    //         Talk while watching without leaving the room.
    //       </p>
    //     </div>
    //     <div className="bg-surface p-6 rounded-lg shadow hover:shadow-lg transition">
    //       <h3 className="text-primary font-semibold mb-2">Easy Room Codes</h3>
    //       <p className="text-gray-300">
    //         Join any room quickly with a simple code.
    //       </p>
    //     </div>
    //   </section>

    //   {/* Recent Rooms Section */}
    //   <section className="mt-12 px-6 md:px-12">
    //     <h2 className="text-accent text-2xl font-bold mb-4">Recent Rooms</h2>
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //       {recentRooms.map((room) => (
    //         <div
    //           key={room.id}
    //           className="bg-surface p-4 rounded-lg shadow hover:shadow-lg transition flex flex-col justify-between"
    //         >
    //           <h3 className="text-primary font-semibold text-lg">
    //             {room.name}
    //           </h3>
    //           <p className="text-gray-400 mt-2">Room ID: {room.id}</p>
    //           <button
    //             onClick={() => console.log("Join", room.id)}
    //             className="mt-4 bg-secondary hover:bg-secondary-dark text-white px-4 py-2 rounded transition"
    //           >
    //             Join
    //           </button>
    //         </div>
    //       ))}
    //     </div>
    //   </section>

    //   {/* Call-to-Action Section */}
    //   <section className="mt-12 px-6 md:px-12 text-center py-12">
    //     <h2 className="text-3xl font-bold text-primary mb-4">
    //       Start Watching With Friends Now
    //     </h2>
    //     <button
    //       onClick={handleCreateRoom}
    //       className="bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-lg text-lg transition"
    //     >
    //       Create Your First Room
    //     </button>
    //   </section>

    //   {/* Footer */}
    //   <footer className="bg-surface mt-12 p-6 text-center text-gray-400">
    //     &copy; {new Date().getFullYear()} Watch Together. All rights reserved.
    //   </footer>
    // </main>
  );
}
