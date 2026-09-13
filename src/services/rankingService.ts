import type { RankingUser } from '../types';

const mockUsers: RankingUser[] = [
  { id: 'current', name: 'Você', emoji: '🦊', score: 0, completedVideos: 0 },
  { id: '2', name: 'Ana Lima', emoji: '🐯', score: 850, completedVideos: 7 },
  { id: '3', name: 'Carlos Melo', emoji: '🦁', score: 720, completedVideos: 6 },
  { id: '4', name: 'Beatriz Santos', emoji: '🐺', score: 640, completedVideos: 5 },
  { id: '5', name: 'Diego Rocha', emoji: '🦅', score: 580, completedVideos: 5 },
  { id: '6', name: 'Fernanda Costa', emoji: '🦋', score: 460, completedVideos: 4 },
  { id: '7', name: 'Gustavo Nunes', emoji: '🐉', score: 380, completedVideos: 3 },
  { id: '8', name: 'Helena Cruz', emoji: '🦚', score: 320, completedVideos: 3 },
  { id: '9', name: 'Igor Alves', emoji: '🐸', score: 210, completedVideos: 2 },
  { id: '10', name: 'Julia Mendes', emoji: '🦊', score: 120, completedVideos: 1 },
];

export const rankingService = {
  async getRanking(currentUserScore: number): Promise<RankingUser[]> {
    return new Promise((resolve) => {
      const updated = mockUsers.map((u) =>
        u.id === 'current' ? { ...u, score: currentUserScore, completedVideos: Math.floor(currentUserScore / 100) } : u
      );
      const sorted = [...updated].sort((a, b) => b.score - a.score);
      setTimeout(() => resolve(sorted), 300);
    });
  },
};
