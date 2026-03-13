import type { FC } from 'react';
import type { Note, Theme } from '../types/note';
import { NoteListItem } from './NoteListItem';

interface SidebarProps {
  notes: Note[];
  pinnedNotes: Note[];
  groupedNotes: Record<string, Note[]>;
  selectedNoteId: string | null;
  searchQuery: string;
  theme: Theme;
  isDark: boolean;
  onSearchChange: (query: string) => void;
  onNoteSelect: (id: string) => void;
  onNewNote: () => void;
  onDeleteNote: (id: string) => void;
  onPinNote: (id: string) => void;
  onThemeChange: (theme: Theme) => void;
  onToggleTheme: () => void;
}

export const Sidebar: FC<SidebarProps> = ({
  notes,
  pinnedNotes,
  groupedNotes,
  selectedNoteId,
  searchQuery,
  isDark,
  onSearchChange,
  onNoteSelect,
  onNewNote,
  onDeleteNote,
  onPinNote,
  onToggleTheme,
}) => {
  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title-row">
          <h1 className="sidebar-title">Notes</h1>
          <div className="sidebar-actions">
            <button 
              className="theme-toggle-btn" 
              onClick={onToggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>
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
            aria-label="Search notes"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="note-list">
        {notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <p>No notes</p>
            <p className="empty-state-hint">Create a new note to get started</p>
          </div>
        ) : (
          <>
            {/* Pinned Section */}
            {!hasSearchQuery && pinnedNotes.length > 0 && (
              <div className="note-section">
                <div className="note-section-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z"/>
                  </svg>
                  <span>Pinned</span>
                </div>
                {pinnedNotes.map((note) => (
                  <NoteListItem
                    key={note.id}
                    note={note}
                    isSelected={note.id === selectedNoteId}
                    onClick={() => onNoteSelect(note.id)}
                    onDelete={(e) => {
                      e.stopPropagation();
                      onDeleteNote(note.id);
                    }}
                    onPin={(e) => {
                      e.stopPropagation();
                      onPinNote(note.id);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Grouped Notes Sections */}
            {!hasSearchQuery ? (
              Object.entries(groupedNotes).map(([groupName, groupNotes]) => (
                <div key={groupName} className="note-section">
                  <div className="note-section-header">
                    <span>{groupName}</span>
                  </div>
                  {groupNotes.map((note) => (
                    <NoteListItem
                      key={note.id}
                      note={note}
                      isSelected={note.id === selectedNoteId}
                      onClick={() => onNoteSelect(note.id)}
                      onDelete={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      onPin={(e) => {
                        e.stopPropagation();
                        onPinNote(note.id);
                      }}
                    />
                  ))}
                </div>
              ))
            ) : (
              /* Search Results - Flat List */
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
                  onPin={(e) => {
                    e.stopPropagation();
                    onPinNote(note.id);
                  }}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};
