import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EditorState {
  isDiffMode: boolean;
  setDiffMode: (value: boolean) => void;
  toggleDiffMode: () => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      isDiffMode: true,

      setDiffMode: (value) => {
        set({ isDiffMode: value });
      },

      toggleDiffMode: () => {
        set((state) => ({
          isDiffMode: !state.isDiffMode,
        }));
      },
    }),
    {
      name: 'editor',
      partialize: (state) => ({ isDiffMode: state.isDiffMode }),
    }
  )
);
