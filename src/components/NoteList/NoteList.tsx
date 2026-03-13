import React from 'react';
import type { Note } from '@/types/note';
import { NoteItem } from '@/components/NoteItem/NoteItem';
import './NoteList.css';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
}) => {
  if (notes.length === 0) {
    return (
      <div className="note-list note-list--empty">
        <p className="note-list__empty-text">No notes found</p>
      </div>
    );
  }

  return (
    <div className="note-list">
      {notes.map(note => (
        <NoteItem
          key={note.id}
          note={note}
          isSelected={note.id === selectedNoteId}
          onSelect={onSelectNote}
          onDelete={onDeleteNote}
        />
      ))}
    </div>
  );
};
