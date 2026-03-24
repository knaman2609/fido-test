import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Note } from '@/types/note';

interface NotesState {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
  addNote: () => string;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  getFilteredNotes: () => Note[];
  getSelectedNote: () => Note | null;
}

const WELCOME_NOTE_CONTENT = `# Welcome to Notes

This is a simple, Apple Notes-inspired markdown editor.

## Features

- **Markdown support** with live preview
- **Clean, minimal interface**
- **Fast search** through your notes
- **Auto-save** to local state

Start typing to create your first note!`;

const SHOPPING_LIST_CONTENT = `# Shopping List

- [x] Milk
- [x] Eggs
- [ ] Bread
- [ ] Butter
- [ ] Coffee`;

const PROJECT_IDEAS_CONTENT = `# Project Ideas

1. Personal website redesign
2. Mobile app for tracking habits
3. Browser extension for productivity
4. Open source contribution to React

## Notes

Focus on projects that solve real problems.`;

const TEST_DOCUMENT_CONTENT = `# Test Document

This is a **test document** to demonstrate various markdown features.

## Formatting Examples

- **Bold text** for emphasis
- *Italic text* for style
- \`inline code\` for technical terms

## Lists

### Ordered List
1. First item
2. Second item
3. Third item

### Unordered List
- Bullet point one
- Bullet point two
- Bullet point three

## Blockquote

> This is a blockquote to test the styling.

---

*Created for testing purposes*`;

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

const createSampleNotes = (): Note[] => [
  {
    id: uuidv4(),
    title: 'Welcome to Notes',
    content: WELCOME_NOTE_CONTENT,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 3600000),
  },
  {
    id: uuidv4(),
    title: 'Shopping List',
    content: SHOPPING_LIST_CONTENT,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: uuidv4(),
    title: 'Project Ideas',
    content: PROJECT_IDEAS_CONTENT,
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 172800000),
  },
  {
    id: uuidv4(),
    title: 'Test Document',
    content: TEST_DOCUMENT_CONTENT,
    createdAt: new Date(Date.now() - 345600000),
    updatedAt: new Date(Date.now() - 259200000),
  },
];

const getInitialNotes = (): Note[] => {
  if (import.meta.env.DEV) {
    return createSampleNotes();
  }
  return [];
};

const initialNotes = getInitialNotes();

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: initialNotes,
  selectedNoteId: initialNotes[0]?.id || null,
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
