'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

interface User {
  id: string;
  name: string;
}

interface RoomState {
  currentTime: number;
  isPlaying: boolean;
  lastUpdate: number;
}

export default function RoomPage() {
  const { id: roomId } = useParams() || {};
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userName, setUserName] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isLocalAction = useRef(false);

  const videoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';

 useEffect(() => {
    if (!roomId) return;

    const newSocket = io('http://localhost:3001', {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('room-state', (state: RoomState) => {
      if (videoRef.current && !isLocalAction.current) {
        videoRef.current.currentTime = state.currentTime;
        if (state.isPlaying) {
          videoRef.current.play().catch(console.error);
        } else {
          videoRef.current.pause();
        }
      }
    });

    newSocket.on('play', ({ currentTime }: { currentTime: number }) => {
      if (videoRef.current && !isLocalAction.current) {
        videoRef.current.currentTime = currentTime;
        videoRef.current.play().catch(console.error);
      }
    });

    newSocket.on('pause', ({ currentTime }: { currentTime: number }) => {
      if (videoRef.current && !isLocalAction.current) {
        videoRef.current.currentTime = currentTime;
        videoRef.current.pause();
      }
    });

    newSocket.on('seek', ({ currentTime }: { currentTime: number }) => {
      if (videoRef.current && !isLocalAction.current) {
        videoRef.current.currentTime = currentTime;
      }
    });

    newSocket.on('users-update', (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    newSocket.on('user-joined', ({ userName }: { userName: string }) => {
      console.log(`${userName} joined the room`);
    });

    newSocket.on('user-left', ({ userName }: { userName: string }) => {
      console.log(`${userName} left the room`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [roomId]);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim() && socket && roomId) {
      socket.emit('join-room', { roomId, userName });
      setIsJoined(true);
    }
  };

  const handlePlay = () => {
    if (socket && videoRef.current && roomId) {
      isLocalAction.current = true;
      socket.emit('play', { roomId, currentTime: videoRef.current.currentTime });
      setTimeout(() => (isLocalAction.current = false), 100);
    }
  };

  const handlePause = () => {
    if (socket && videoRef.current && roomId) {
      isLocalAction.current = true;
      socket.emit('pause', { roomId, currentTime: videoRef.current.currentTime });
      setTimeout(() => (isLocalAction.current = false), 100);
    }
  };

  const handleSeek = () => {
    if (socket && videoRef.current && roomId) {
      isLocalAction.current = true;
      socket.emit('seek', { roomId, currentTime: videoRef.current.currentTime });
      setTimeout(() => (isLocalAction.current = false), 100);
    }
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Join Room {roomId}</h1>
          <form onSubmit={handleJoinRoom} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={!isConnected}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition duration-200"
            >
              {isConnected ? 'Join Room' : 'Connecting...'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Room {roomId}</h1>
          <p className="text-gray-400">
            Connected: {isConnected ? 'Yes' : 'No'} | Users: {users.length}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full bg-black rounded-lg"
              controls
              onPlay={handlePlay}
              onPause={handlePause}
              onSeeked={handleSeek}
            />
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Users in Room</h2>
            <ul className="space-y-2">
              {users.map((user) => (
                <li key={user.id} className="text-gray-300">
                  {user.name} {user.id === socket?.id && '(You)'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
