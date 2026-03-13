import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Note } from '@/types/note';
import { formatFullDate } from '@/utils/date';
import { MilkdownEditor } from './MilkdownEditor';
import './Editor.css';

interface EditorProps {
  note: Note;
  onUpdateNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

export const Editor: React.FC<EditorProps> = ({
  note,
  onUpdateNote,
  onDeleteNote,
}) => {
  const handleChange = (content: string) => {
    onUpdateNote(note.id, content);
  };

  const handleDelete = () => {
    onDeleteNote(note.id);
  };

  return (
    <div className="editor">
      <div className="editor__header">
        <div className="editor__meta">
          <span className="editor__date">{formatFullDate(note.updatedAt)}</span>
        </div>
        <button
          className="editor__delete-btn"
          onClick={handleDelete}
          aria-label="Delete note"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <div className="editor__content">
        <MilkdownEditor content={note.content} onChange={handleChange} />
      </div>
    </div>
  );
};
