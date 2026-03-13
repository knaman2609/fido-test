import { useCallback, useRef } from 'react';
import { useNotesStore } from '@/store/notesStore';

export const useNotes = () => {
  const store = useNotesStore();
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateNoteWithDebounce = useCallback(
    (id: string, content: string) => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      updateTimeoutRef.current = setTimeout(() => {
        store.updateNote(id, content);
      }, 300);
    },
    [store]
  );

  return {
    notes: store.notes,
    filteredNotes: store.getFilteredNotes(),
    selectedNote: store.getSelectedNote(),
    selectedNoteId: store.selectedNoteId,
    searchQuery: store.searchQuery,
    addNote: store.addNote,
    updateNote: updateNoteWithDebounce,
    deleteNote: store.deleteNote,
    selectNote: store.selectNote,
    setSearchQuery: store.setSearchQuery,
  };
};
