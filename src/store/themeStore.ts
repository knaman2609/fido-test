import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  try {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored;
    }
  } catch {
    // localStorage not available (e.g., Safari private mode)
  }
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('theme', newTheme);
      } catch {
        // localStorage not available (e.g., Safari private mode)
      }
      return { theme: newTheme };
    });
  },
  
  setTheme: (theme) => {
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // localStorage not available (e.g., Safari private mode)
    }
    set({ theme });
  },
}));
