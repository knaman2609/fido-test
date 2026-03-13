import type { FC } from 'react';
import type { Note } from '../types/note';
import { formatDate } from '../utils/storage';

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onPin?: (e: React.MouseEvent) => void;
}

export const NoteListItem: FC<NoteListItemProps> = ({
  note,
  isSelected,
  onClick,
  onDelete,
  onPin,
}) => {
  return (
    <div
      className={`note-list-item ${isSelected ? 'selected' : ''} ${note.isPinned ? 'pinned' : ''}`}
      onClick={onClick}
    >
      <div className="note-list-item-content">
        <div className="note-list-item-title-row">
          <div className="note-list-item-title">{note.title}</div>
          {note.isPinned && (
            <svg className="pin-indicator" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z"/>
            </svg>
          )}
        </div>
        <div className="note-list-item-meta">
          <span className="note-list-item-date">{formatDate(note.updatedAt)}</span>
          {note.preview && (
            <span className="note-list-item-preview">{note.preview}</span>
          )}
        </div>
      </div>
      <div className="note-list-item-actions">
        <button
          className="note-list-item-pin"
          onClick={onPin}
          aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
          title={note.isPinned ? 'Unpin note' : 'Pin note'}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={note.isPinned ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L12 22M12 2L8 6M12 2L16 6" style={{ display: 'none' }}/>
            <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z"/>
          </svg>
        </button>
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
    </div>
  );
};
