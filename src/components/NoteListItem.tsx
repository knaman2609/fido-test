import type { FC } from 'react';
import type { Note } from '../types/note';
import { formatDate } from '../utils/storage';

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const NoteListItem: FC<NoteListItemProps> = ({
  note,
  isSelected,
  onClick,
  onDelete,
}) => {
  return (
    <div
      className={`note-list-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="note-list-item-content">
        <div className="note-list-item-title">{note.title}</div>
        <div className="note-list-item-meta">
          <span className="note-list-item-date">{formatDate(note.updatedAt)}</span>
          {note.preview && (
            <span className="note-list-item-preview">{note.preview}</span>
          )}
        </div>
      </div>
      <button
        className="note-list-item-delete"
        onClick={onDelete}
        aria-label="Delete note"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  );
};
