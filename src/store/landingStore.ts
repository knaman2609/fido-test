import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LandingState {
  hasEnteredApp: boolean;
  enterApp: () => void;
  resetLanding: () => void;
}

export const useLandingStore = create<LandingState>()(
  persist(
    (set) => ({
      hasEnteredApp: false,

      enterApp: () => {
        set({ hasEnteredApp: true });
      },

      resetLanding: () => {
        set({ hasEnteredApp: false });
      },
    }),
    {
      name: 'has-entered-app',
      partialize: (state) => ({ hasEnteredApp: state.hasEnteredApp }),
    }
  )
);
