import React, { memo } from 'react';
import { Trash2, Ticket } from 'lucide-react';
import type { Note, TicketStatus } from '@/types/note';
import { formatDate } from '@/utils/date';
import './NoteItem.css';

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleTicket: (id: string) => void;
}

const getTicketStatusColor = (status: TicketStatus): string => {
  switch (status) {
    case 'open':
      return '#34c759';
    case 'in-progress':
      return '#ff9500';
    case 'closed':
      return '#8e8e93';
    default:
      return '#8e8e93';
  }
};

const getTicketStatusLabel = (status: TicketStatus): string => {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in-progress':
      return 'In Progress';
    case 'closed':
      return 'Closed';
    default:
      return '';
  }
};

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
  onToggleTicket,
}) => {
  const handleClick = () => {
    onSelect(note.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  const handleToggleTicket = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleTicket(note.id);
  };

  return (
    <div
      className={`note-item ${isSelected ? 'note-item--selected' : ''}`}
      onClick={handleClick}
    >
      <div className="note-item__content">
        <div className="note-item__header">
          <h3 className="note-item__title">{note.title}</h3>
          {note.ticketStatus && (
            <span
              className="note-item__ticket-badge"
              style={{ backgroundColor: getTicketStatusColor(note.ticketStatus) }}
            >
              {getTicketStatusLabel(note.ticketStatus)}
            </span>
          )}
        </div>
        <div className="note-item__meta">
          <span className="note-item__date">{formatDate(note.updatedAt)}</span>
          <span className="note-item__preview">{getPreview(note.content)}</span>
        </div>
      </div>
      <div className="note-item__actions">
        <button
          className={`note-item__ticket-toggle ${note.ticketStatus ? 'note-item__ticket-toggle--active' : ''}`}
          onClick={handleToggleTicket}
          aria-label={note.ticketStatus ? 'Remove ticket' : 'Mark as ticket'}
        >
          <Ticket size={16} />
        </button>
        <button
          className="note-item__delete"
          onClick={handleDelete}
          aria-label="Delete note"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
});

NoteItem.displayName = 'NoteItem';
