export type RoomMode = 'study' | 'gaming' | 'entertainment' | 'casual';

export interface Room {
  _id: string;
  roomId: string;
  roomName: string;
  description?: string;
  thumbnail?: string;
  mode: RoomMode;
  isPublic: boolean;
  maxParticipants: number;
  admin: {
    userId: string;
    username: string;
  };
  video?: {
    url?: string;
    title?: string;
    currentTime: number;
    duration?: number;
    isPlaying: boolean;
  };
  participants: Participant[];
  tags?: string[];
  status: 'active' | 'idle' | 'ended';
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  userId: string;
  username: string;
  avatar?: string;
  joinedAt: string;
  isActive: boolean;
}