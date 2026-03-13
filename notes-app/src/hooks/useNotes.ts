import { useState, useEffect, useCallback } from 'react';
import { Note } from '../types/note';
import { getNotes, saveNote, deleteNote, generateId } from '../utils/storage';

interface UseNotesReturn {
  notes: Note[];
  selectedNoteId: string | null;
  selectedNote: Note | null;
  selectNote: (id: string | null) => void;
  createNote: () => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNoteById: (id: string) => void;
}

export function useNotes(): UseNotesReturn {
  const [notesMap, setNotesMap] = useState<Record<string, Note>>({});
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  useEffect(() => {
    setNotesMap(getNotes());
  }, []);

  const notes = Object.values(notesMap).sort((a, b) => b.updatedAt - a.updatedAt);
  const selectedNote = selectedNoteId ? notesMap[selectedNoteId] || null : null;

  const selectNote = useCallback((id: string | null) => {
    setSelectedNoteId(id);
  }, []);

  const createNote = useCallback((): string => {
    const now = Date.now();
    const newNote: Note = {
      id: generateId(),
      title: '',
      content: '',
      createdAt: now,
      updatedAt: now,
    };
    saveNote(newNote);
    setNotesMap((prev) => ({ ...prev, [newNote.id]: newNote }));
    setSelectedNoteId(newNote.id);
    return newNote.id;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    const existingNote = notesMap[id];
    if (!existingNote) return;

    const updatedNote: Note = {
      ...existingNote,
      ...updates,
      updatedAt: Date.now(),
    };
    saveNote(updatedNote);
    setNotesMap((prev) => ({ ...prev, [id]: updatedNote }));
  }, [notesMap]);

  const deleteNoteById = useCallback((id: string) => {
    deleteNote(id);
    setNotesMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  }, [selectedNoteId]);

  return {
    notes,
    selectedNoteId,
    selectedNote,
    selectNote,
    createNote,
    updateNote,
    deleteNoteById,
  };
}
