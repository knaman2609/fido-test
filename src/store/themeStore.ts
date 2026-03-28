import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const getSystemTheme = (): Theme => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.setAttribute('data-theme', newTheme);
      },
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.setAttribute('data-theme', theme);
      },
    }),
    {
      name: 'fido-theme',
      onRehydrateStorage: (state) => {
        if (state) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);

export const initializeTheme = () => {
  const storedTheme = localStorage.getItem('fido-theme');
  let theme: Theme;

  if (storedTheme) {
    try {
      const parsed = JSON.parse(storedTheme);
      theme = parsed.state?.theme || getSystemTheme();
    } catch {
      theme = getSystemTheme();
    }
  } else {
    theme = getSystemTheme();
  }

  document.documentElement.setAttribute('data-theme', theme);
  return theme;
};
