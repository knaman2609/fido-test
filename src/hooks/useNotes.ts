import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Note, BlockNoteBlock } from '../types/note';
import {
  loadNotes,
  saveNotes,
  loadLastSelectedNoteId,
  generateId,
  extractTitle,
  extractPreview,
  createDefaultNote,
} from '../utils/storage';

export interface UseNotesReturn {
  notes: Note[];
  selectedNoteId: string | null;
  selectedNote: Note | null;
  searchQuery: string;
  filteredNotes: Note[];
  createNote: () => void;
  updateNote: (id: string, content: BlockNoteBlock[]) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string) => void;
  setSearchQuery: (query: string) => void;
}

export function useNotes(): UseNotesReturn {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadedNotes = loadNotes();
    const lastSelectedId = loadLastSelectedNoteId();

    if (loadedNotes.length === 0) {
      const defaultNote = createDefaultNote();
      setNotes([defaultNote]);
      setSelectedNoteId(defaultNote.id);
    } else {
      setNotes(loadedNotes);
      if (lastSelectedId && loadedNotes.some((n) => n.id === lastSelectedId)) {
        setSelectedNoteId(lastSelectedId);
      } else {
        const sortedNotes = [...loadedNotes].sort((a, b) => b.updatedAt - a.updatedAt);
        setSelectedNoteId(sortedNotes[0]?.id || null);
      }
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      saveNotes(notes, selectedNoteId || undefined);
    }
  }, [notes, selectedNoteId, isInitialized]);

  const createNote = useCallback(() => {
    const now = Date.now();
    const newNote: Note = {
      id: generateId(),
      title: 'Untitled',
      preview: '',
      content: [],
      createdAt: now,
      updatedAt: now,
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setSearchQuery('');
  }, []);

  const updateNote = useCallback((id: string, content: BlockNoteBlock[]) => {
    setNotes((prev) => {
      const noteIndex = prev.findIndex((n) => n.id === id);
      if (noteIndex === -1) return prev;

      const updatedNote: Note = {
        ...prev[noteIndex],
        content,
        title: extractTitle(content),
        preview: extractPreview(content),
        updatedAt: Date.now(),
      };

      return [updatedNote, ...prev.slice(0, noteIndex), ...prev.slice(noteIndex + 1)];
    });
  }, []);

  const deleteNote = useCallback(
    (id: string) => {
      const noteToDelete = notes.find((n) => n.id === id);
      if (!noteToDelete) return;

      const confirmed = window.confirm(
        `Delete "${noteToDelete.title}"?`
      );
      if (!confirmed) return;

      setNotes((prev) => {
        const newNotes = prev.filter((n) => n.id !== id);

        if (selectedNoteId === id) {
          if (newNotes.length > 0) {
            const sortedNotes = [...newNotes].sort((a, b) => b.updatedAt - a.updatedAt);
            setSelectedNoteId(sortedNotes[0].id);
          } else {
            setSelectedNoteId(null);
          }
        }

        return newNotes;
      });
    },
    [notes, selectedNoteId]
  );

  const selectNote = useCallback((id: string) => {
    setSelectedNoteId(id);
  }, []);

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;

    const query = searchQuery.toLowerCase();
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.preview.toLowerCase().includes(query)
    );
  }, [notes, searchQuery]);

  const selectedNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  return {
    notes,
    selectedNoteId,
    selectedNote,
    searchQuery,
    filteredNotes,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    setSearchQuery,
  };
}
