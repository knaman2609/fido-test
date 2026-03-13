import React, { memo } from 'react';
import { Trash2 } from 'lucide-react';
import type { Note } from '@/types/note';
import { formatDate } from '@/utils/date';
import './NoteItem.css';

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const getPreview = (content: string): string => {
  const plainText = content
    .replace(/#+\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`{3}[\s\S]*?`{3}/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/- \[([ x])\]/g, '')
    .trim();
  
  const lines = plainText.split('\n').filter(line => line.trim());
  const previewText = lines.slice(0, 2).join(' ');
  return previewText.length > 60 ? previewText.slice(0, 60) + '...' : previewText;
};

export const NoteItem: React.FC<NoteItemProps> = memo(({
  note,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const handleClick = () => {
    onSelect(note.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  return (
    <div
      className={`note-item ${isSelected ? 'note-item--selected' : ''}`}
      onClick={handleClick}
    >
      <div className="note-item__content">
        <h3 className="note-item__title">{note.title}</h3>
        <div className="note-item__meta">
          <span className="note-item__date">{formatDate(note.updatedAt)}</span>
          <span className="note-item__preview">{getPreview(note.content)}</span>
        </div>
      </div>
      <button
        className="note-item__delete"
        onClick={handleDelete}
        aria-label="Delete note"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
});

NoteItem.displayName = 'NoteItem';
