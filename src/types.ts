import type { Block } from "@blocknote/core";

export interface Note {
  id: string;
  title: string;
  content: Block[];
  createdAt: number;
  updatedAt: number;
}

export type NotesCollection = Note[];

export interface NoteStorage {
  loadAllNotes(): NotesCollection;
  getNote(id: string): Note | null;
  saveNote(note: Note): void;
  createNote(): Note;
  deleteNote(id: string): boolean;
}

export interface NoteListItem {
  id: string;
  title: string;
  preview: string;
  updatedAt: number;
}

export interface SaveStatusElement {
  showSaved(): void;
  showError(message: string): void;
  showSaving(): void;
}

// Legacy types for migration
export type Document = Block[];
export interface DocumentStorage {
  load(): Document | null;
  save(document: Document): void;
}
