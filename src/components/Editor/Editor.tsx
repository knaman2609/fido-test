import React from 'react';
import { Trash2, Tag } from 'lucide-react';
import type { Note, TicketStatus } from '@/types/note';
import { ticketStatusConfig } from '@/types/note';
import { formatFullDate } from '@/utils/date';
import { MilkdownEditor } from './MilkdownEditor';
import { TicketBadge } from '@/components/TicketBadge/TicketBadge';
import './Editor.css';

interface EditorProps {
  note: Note;
  onUpdateNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  onToggleTicket: (id: string) => void;
  onSetTicketStatus: (id: string, status: TicketStatus) => void;
}

const statusOptions: { value: TicketStatus; label: string; icon: React.ElementType }[] = [
  { value: 'open', label: ticketStatusConfig['open'].label, icon: ticketStatusConfig['open'].icon },
  { value: 'in-progress', label: ticketStatusConfig['in-progress'].label, icon: ticketStatusConfig['in-progress'].icon },
  { value: 'closed', label: ticketStatusConfig['closed'].label, icon: ticketStatusConfig['closed'].icon },
];

export const Editor: React.FC<EditorProps> = ({
  note,
  onUpdateNote,
  onDeleteNote,
  onToggleTicket,
  onSetTicketStatus,
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

  const handleStatusChange = (status: TicketStatus) => {
    onSetTicketStatus(note.id, status);
  };

  return (
    <div className="editor">
      <div className="editor__header">
        <div className="editor__meta">
          <span className="editor__date">{formatFullDate(note.updatedAt)}</span>
          {note.isTicket && note.ticketStatus && (
            <TicketBadge status={note.ticketStatus} />
          )}
        </div>
        <div className="editor__actions">
          {note.isTicket && (
            <div className="editor__status-dropdown">
              {statusOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  className={`editor__status-btn ${note.ticketStatus === value ? 'editor__status-btn--active' : ''}`}
                  onClick={() => handleStatusChange(value)}
                  title={label}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          )}
          <button
            className={`editor__ticket-btn ${note.isTicket ? 'editor__ticket-btn--active' : ''}`}
            onClick={handleToggleTicket}
            aria-label={note.isTicket ? 'Remove ticket status' : 'Mark as ticket'}
            title={note.isTicket ? 'Remove ticket status' : 'Mark as ticket'}
          >
            <Tag size={18} />
          </button>
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
