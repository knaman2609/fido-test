import type { Note } from '@/types/note';

const STORAGE_KEY = 'notes-app-data';

interface StoredNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface StoredData {
  notes: StoredNote[];
  selectedNoteId: string | null;
}

export const saveNotes = (notes: Note[], selectedNoteId: string | null): void => {
  try {
    const serialized: StoredData = {
      notes: notes.map(note => ({
        ...note,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
      })),
      selectedNoteId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded. Notes cannot be saved.');
    } else {
      console.error('Failed to save notes to localStorage:', error);
    }
  }
};

export const loadNotes = (): { notes: Note[]; selectedNoteId: string | null } | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed: StoredData = JSON.parse(stored);

    if (!parsed.notes || !Array.isArray(parsed.notes)) {
      console.error('Invalid data structure in localStorage: notes array missing');
      return null;
    }

    const deserialized: Note[] = parsed.notes.map(note => ({
      ...note,
      createdAt: new Date(note.createdAt),
      updatedAt: new Date(note.updatedAt),
    }));

    return {
      notes: deserialized,
      selectedNoteId: parsed.selectedNoteId,
    };
  } catch (error) {
    console.error('Failed to load notes from localStorage:', error);
    return null;
  }
};

export const clearNotes = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear notes from localStorage:', error);
  }
};
