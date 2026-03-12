import type { Block } from "@blocknote/core";
import type { Note, NotesCollection, NoteStorage } from "./types.js";

const STORAGE_KEY = "blocknote-notes";
const LEGACY_STORAGE_KEY = "blocknote-document";

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try {
      return crypto.randomUUID();
    } catch {
      // Fall through to fallback implementation
    }
  }
  // Fallback UUID v4 implementation
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function isValidBlock(obj: unknown): obj is Block {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  const block = obj as Record<string, unknown>;
  return (
    typeof block.id === "string" &&
    typeof block.type === "string" &&
    typeof block.props === "object" &&
    block.props !== null &&
    (block.children === undefined || Array.isArray(block.children)) &&
    (block.content === undefined || Array.isArray(block.content))
  );
}

function isValidBlockArray(data: unknown): data is Block[] {
  return Array.isArray(data) && data.every(isValidBlock);
}

function isValidNote(obj: unknown): obj is Note {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  const note = obj as Record<string, unknown>;
  return (
    typeof note.id === "string" &&
    typeof note.title === "string" &&
    typeof note.createdAt === "number" &&
    typeof note.updatedAt === "number" &&
    Array.isArray(note.content) &&
    note.content.every(isValidBlock)
  );
}

function isValidNotesCollection(data: unknown): data is NotesCollection {
  return Array.isArray(data) && data.every(isValidNote);
}

function getDefaultContent(): Block[] {
  return [
    {
      id: "default",
      type: "paragraph",
      props: {
        backgroundColor: "default",
        textColor: "default",
        textAlignment: "left",
      },
      content: [],
      children: [],
    },
  ];
}

function migrateLegacyDocument(): NotesCollection {
  try {
    const stored = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored) as unknown;
    if (isValidBlockArray(parsed)) {
      const note: Note = {
        id: generateUUID(),
        title: "Untitled Note",
        content: parsed,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return [note];
    }
    return [];
  } catch {
    return [];
  }
}

class NoteStorageImpl implements NoteStorage {
  loadAllNotes(): NotesCollection {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const migrated = migrateLegacyDocument();
        if (migrated.length > 0) {
          this.saveAllNotes(migrated);
        }
        return migrated;
      }
      const parsed = JSON.parse(stored) as unknown;
      if (isValidNotesCollection(parsed)) {
        return parsed;
      }
      return [];
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to load notes from localStorage:", e);
      return [];
    }
  }

  private saveAllNotes(notes: NotesCollection): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to save notes to localStorage:", e);
      throw new Error("Storage may be full or disabled", { cause: e });
    }
  }

  getNote(id: string): Note | null {
    const notes = this.loadAllNotes();
    return notes.find((note) => note.id === id) ?? null;
  }

  saveNote(note: Note): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const updatedNote = { ...note, updatedAt: Date.now() };
      if (!stored) {
        this.saveAllNotes([updatedNote]);
        return;
      }
      const notes = JSON.parse(stored) as NotesCollection;
      const index = notes.findIndex((n) => n.id === note.id);
      if (index >= 0) {
        notes[index] = updatedNote;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } else {
        notes.push(updatedNote);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to save note to localStorage:", e);
      throw new Error("Storage may be full or disabled", { cause: e });
    }
  }

  createNote(): Note {
    const note: Note = {
      id: generateUUID(),
      title: "New Note",
      content: getDefaultContent(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const notes = JSON.parse(stored) as NotesCollection;
        notes.push(note);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([note]));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to create note in localStorage:", e);
      throw new Error("Storage may be full or disabled", { cause: e });
    }
    return note;
  }

  deleteNote(id: string): boolean {
    const notes = this.loadAllNotes();
    const index = notes.findIndex((n) => n.id === id);
    if (index >= 0) {
      notes.splice(index, 1);
      this.saveAllNotes(notes);
      return true;
    }
    return false;
  }
}

export const noteStorage = new NoteStorageImpl();
