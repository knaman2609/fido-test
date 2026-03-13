import { Note } from '../types/note';

const STORAGE_KEY = 'notes-app-data';

export function getNotes(): Record<string, Note> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveNote(note: Note): void {
  const notes = getNotes();
  notes[note.id] = note;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function deleteNote(id: string): void {
  const notes = getNotes();
  delete notes[id];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
