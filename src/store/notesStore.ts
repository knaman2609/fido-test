import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Note, TicketStatus } from '@/types/note';

interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
  ticketFilter: TicketStatus | 'all';
  addNote: () => string;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleTicketStatus: (id: string) => void;
  setTicketStatus: (id: string, status: TicketStatus) => void;
  setTicketFilter: (filter: TicketStatus | 'all') => void;
  getFilteredNotes: () => Note[];
  getSelectedNote: () => Note | null;
}

const extractTitle = (content: string): string => {
  const lines = content.split('\n');
  const firstLine = lines.find(line => line.trim().length > 0);
  if (!firstLine) return 'Untitled';
  return firstLine.replace(/^#+\s*/, '').trim() || 'Untitled';
};

const createDefaultNote = (): Note => {
  const now = new Date();
  return {
    id: uuidv4(),
    title: 'Untitled',
    content: '',
    createdAt: now,
    updatedAt: now,
  };
};

const sampleNotes: Note[] = [
  {
    id: uuidv4(),
    title: 'Welcome to Notes',
    content: '# Welcome to Notes\n\nThis is a simple, Apple Notes-inspired markdown editor.\n\n## Features\n\n- **Markdown support** with live preview\n- **Clean, minimal interface**\n- **Fast search** through your notes\n- **Auto-save** to local state\n\nStart typing to create your first note!',
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: uuidv4(),
    title: 'Shopping List',
    content: '# Shopping List\n\n- [x] Milk\n- [x] Eggs\n- [ ] Bread\n- [ ] Butter\n- [ ] Coffee',
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: uuidv4(),
    title: 'Project Ideas',
    content: '# Project Ideas\n\n1. Personal website redesign\n2. Mobile app for tracking habits\n3. Browser extension for productivity\n4. Open source contribution to React\n\n## Notes\n\nFocus on projects that solve real problems.',
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 172800000),
  },
  {
    id: uuidv4(),
    title: 'Fix: Navigation Bug',
    content: '# Fix: Navigation Bug\n\n## Issue\nThe sidebar navigation does not collapse properly on mobile devices.\n\n## Steps to Reproduce\n1. Open app on mobile\n2. Click menu button\n3. Try to close sidebar\n\n## Status\nInvestigating root cause.',
    createdAt: new Date(Date.now() - 432000000),
    updatedAt: new Date(Date.now() - 432000000),
    isTicket: true,
    ticketStatus: 'open',
  },
];

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: sampleNotes,
  selectedNoteId: sampleNotes[0]?.id || null,
  searchQuery: '',

  addNote: () => {
    const newNote = createDefaultNote();
    set(state => ({
      notes: [newNote, ...state.notes],
      selectedNoteId: newNote.id,
    }));
    return newNote.id;
  },

  updateNote: (id, content) => {
    set(state => ({
      notes: state.notes.map(note =>
        note.id === id
          ? {
              ...note,
              content,
              title: extractTitle(content),
              updatedAt: new Date(),
            }
          : note
      ),
    }));
  },

  deleteNote: (id) => {
    set(state => {
      const newNotes = state.notes.filter(note => note.id !== id);
      const newSelectedId =
        state.selectedNoteId === id
          ? newNotes[0]?.id || null
          : state.selectedNoteId;
      return {
        notes: newNotes,
        selectedNoteId: newSelectedId,
      };
    });
  },

  selectNote: (id) => {
    set({ selectedNoteId: id });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  getFilteredNotes: () => {
    const { notes, searchQuery } = get();
    if (!searchQuery.trim()) return notes;
    const query = searchQuery.toLowerCase();
    return notes.filter(
      note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  },

  getSelectedNote: () => {
    const { notes, selectedNoteId } = get();
    return notes.find(note => note.id === selectedNoteId) || null;
  },
}));
