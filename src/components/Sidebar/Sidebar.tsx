import React from 'react';
import { Plus, Star } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { NoteList } from '@/components/NoteList/NoteList';
import type { Note } from '@/types/note';
import './Sidebar.css';

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  searchQuery: string;
  showFavoritesOnly: boolean;
  onSearchChange: (query: string) => void;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onAddNote: () => void;
  onToggleFavorites: () => void;
  onToggleFavorite: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  selectedNoteId,
  searchQuery,
  showFavoritesOnly,
  onSearchChange,
  onSelectNote,
  onDeleteNote,
  onAddNote,
  onToggleFavorites,
  onToggleFavorite,
}) => {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__header-row">
          <button className="sidebar__new-btn" onClick={onAddNote}>
            <Plus size={18} />
            <span>New Note</span>
          </button>
          <button
            className={`sidebar__favorites-btn ${showFavoritesOnly ? 'sidebar__favorites-btn--active' : ''}`}
            onClick={onToggleFavorites}
            aria-label={showFavoritesOnly ? 'Show all notes' : 'Show favorites only'}
            title={showFavoritesOnly ? 'Show all notes' : 'Show favorites only'}
          >
            <Star size={18} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
          </button>
        </div>
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>
      <div className="sidebar__content">
        <NoteList
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={onSelectNote}
          onDeleteNote={onDeleteNote}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
      <div className="sidebar__footer">
        <span className="sidebar__count">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
      </div>
    </aside>
  );
};
