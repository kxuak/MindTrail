import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserProgress } from '../types';

interface AppContextValue {
  progress: UserProgress;
  completeVideo: (videoId: string) => void;
  isCompleted: (videoId: string) => boolean;
}

const STORAGE_KEY = 'trail_progress';

const defaultProgress: UserProgress = {
  completedVideoIds: [],
  totalScore: 0,
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeVideo = (videoId: string) => {
    setProgress((prev) => {
      if (prev.completedVideoIds.includes(videoId)) return prev;
      return {
        completedVideoIds: [...prev.completedVideoIds, videoId],
        totalScore: prev.totalScore + 100,
      };
    });
  };

  const isCompleted = (videoId: string) =>
    progress.completedVideoIds.includes(videoId);

  return (
    <AppContext.Provider value={{ progress, completeVideo, isCompleted }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
