import type { FC } from 'react';
import type { Note } from '../types/note';
import { NoteListItem } from './NoteListItem';

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNoteSelect: (id: string) => void;
  onNewNote: () => void;
  onDeleteNote: (id: string) => void;
}

export const Sidebar: FC<SidebarProps> = ({
  notes,
  selectedNoteId,
  searchQuery,
  onSearchChange,
  onNoteSelect,
  onNewNote,
  onDeleteNote,
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title-row">
          <h1 className="sidebar-title">Notes</h1>
          <button className="new-note-btn" onClick={onNewNote} aria-label="New note">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <div className="search-container">
          <svg
            className="search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="note-list">
        {notes.length === 0 ? (
          <div className="empty-state">
            <p>No notes</p>
            <p className="empty-state-hint">Create a new note to get started</p>
          </div>
        ) : (
          notes.map((note) => (
            <NoteListItem
              key={note.id}
              note={note}
              isSelected={note.id === selectedNoteId}
              onClick={() => onNoteSelect(note.id)}
              onDelete={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};
