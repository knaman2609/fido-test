import { create } from 'zustand';

const STORAGE_KEY = 'hasVisited';

interface LandingState {
  hasVisited: boolean;
  enterApp: () => void;
  resetLanding: () => void;
}

const getInitialState = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  } catch {
    return false;
  }
};

export const useLandingStore = create<LandingState>((set) => ({
  hasVisited: getInitialState(),

  enterApp: () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // localStorage not available
    }
    set({ hasVisited: true });
  },

  resetLanding: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage not available
    }
    set({ hasVisited: false });
  },
}));
