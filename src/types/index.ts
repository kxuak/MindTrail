export interface Video {
  id: string;
  videoId: string;
  title: string;
  description: string;
  category: string;
  subject: string;
  order: number;
  durationMin: number;
}

export type NodeStatus = 'locked' | 'available' | 'completed';

export interface TrailNode extends Video {
  status: NodeStatus;
}

export interface RankingUser {
  id: string;
  name: string;
  emoji: string;
  score: number;
  completedVideos: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface StudySpace {
  id: string;
  name: string;
  type: 'library' | 'cafe' | 'coworking' | 'study_room';
  address: string;
  hours: string;
  rating: number;
  lat: number;
  lng: number;
  description: string;
}

export interface UserProgress {
  completedVideoIds: string[];
  totalScore: number;
}

// Escape Room
export type EscapeStageStatus = 'locked' | 'active' | 'solved' | 'failed';

export interface EscapeStage {
  id: string;
  subject: 'matematica' | 'portugues' | 'logica' | 'geral' | 'enigma' | 'colaborativo';
  title: string;
  narrative: string;
  type: 'multiple_choice' | 'text_input' | 'sequence' | 'collaborative';
  question: string;
  hint?: string;
  options?: string[];
  answer: string;
  points: number;
  requiresPhysical?: boolean; // flags stages that need real-world interaction
}
