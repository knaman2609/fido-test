import React from 'react';
import { Trash2, Ticket } from 'lucide-react';
import type { Note, TicketStatus } from '@/types/note';
import { formatFullDate } from '@/utils/date';
import { MilkdownEditor } from './MilkdownEditor';
import './Editor.css';

interface EditorProps {
  note: Note;
  onUpdateNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  onToggleTicket: (id: string) => void;
  onUpdateTicketStatus: (id: string, status: TicketStatus | undefined) => void;
}

const getTicketStatusColor = (status: TicketStatus | undefined): string => {
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

const getTicketStatusLabel = (status: TicketStatus | undefined): string => {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in-progress':
      return 'In Progress';
    case 'closed':
      return 'Closed';
    default:
      return 'Not a Ticket';
  }
};

export const Editor: React.FC<EditorProps> = ({
  note,
  onUpdateNote,
  onDeleteNote,
  onToggleTicket,
  onUpdateTicketStatus,
}) => {
  const handleChange = (content: string) => {
    onUpdateNote(note.id, content);
  };

  const handleDelete = () => {
    onDeleteNote(note.id);
  };

  const handleToggleTicket = () => {
    onToggleTicket(note.id);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'none') {
      onUpdateTicketStatus(note.id, undefined);
    } else {
      onUpdateTicketStatus(note.id, value as TicketStatus);
    }
  };

  return (
    <div className="editor">
      <div className="editor__header">
        <div className="editor__meta">
          <span className="editor__date">{formatFullDate(note.updatedAt)}</span>
          {note.ticketStatus && (
            <div className="editor__ticket-indicator">
              <Ticket size={14} />
              <span>Ticket</span>
            </div>
          )}
        </div>
        <div className="editor__actions">
          <div className="editor__ticket-controls">
            <button
              className={`editor__ticket-btn ${note.ticketStatus ? 'editor__ticket-btn--active' : ''}`}
              onClick={handleToggleTicket}
              aria-label={note.ticketStatus ? 'Remove ticket' : 'Mark as ticket'}
            >
              <Ticket size={18} />
            </button>
            {note.ticketStatus && (
              <select
                className="editor__ticket-status"
                value={note.ticketStatus}
                onChange={handleStatusChange}
                style={{ borderColor: getTicketStatusColor(note.ticketStatus) }}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            )}
          </div>
          <button
            className="editor__delete-btn"
            onClick={handleDelete}
            aria-label="Delete note"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div className="editor__content">
        <MilkdownEditor content={note.content} onChange={handleChange} />
      </div>
    </div>
  );
};
