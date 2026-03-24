import { useCallback, useRef } from 'react';
import { useNotesStore } from '@/store/notesStore';
import type { TicketStatus } from '@/types/note';

export const useNotes = () => {
  const store = useNotesStore();
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    ticketFilter: store.ticketFilter,
    addNote: store.addNote,
    updateNote: updateNoteWithDebounce,
    deleteNote: store.deleteNote,
    selectNote: store.selectNote,
    setSearchQuery: store.setSearchQuery,
    toggleTicketStatus: store.toggleTicketStatus,
    setTicketStatus: store.setTicketStatus,
    setTicketFilter: store.setTicketFilter,
  };
};
