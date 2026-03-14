import React from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { NoteList } from '@/components/NoteList/NoteList';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { useLandingStore } from '@/store/landingStore';
import type { Note } from '@/types/note';
import './Sidebar.css';

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onAddNote: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  selectedNoteId,
  searchQuery,
  onSearchChange,
  onSelectNote,
  onDeleteNote,
  onAddNote,
}) => {
  const { resetLanding } = useLandingStore();

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <button className="sidebar__new-btn" onClick={onAddNote}>
          <Plus size={18} />
          <span>New Note</span>
        </button>
        <div className="sidebar__search-row">
          <button
            className="sidebar__back-btn"
            onClick={resetLanding}
            aria-label="Back to landing page"
            title="Back to landing page"
          >
            <ArrowLeft size={18} />
          </button>
          <SearchBar value={searchQuery} onChange={onSearchChange} />
        </div>
      </div>
      <div className="sidebar__content">
        <NoteList
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={onSelectNote}
          onDeleteNote={onDeleteNote}
        />
      </div>
      <div className="sidebar__footer">
        <span className="sidebar__count">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
        <ThemeToggle />
      </div>
    </aside>
  );
};
