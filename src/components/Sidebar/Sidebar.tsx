import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { NoteList } from '@/components/NoteList/NoteList';
import type { Note } from '@/types/note';

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
  return (
    <aside className="flex flex-col w-80 min-w-[320px] bg-muted border-r h-screen">
      <div className="p-4 flex flex-col gap-3">
        <Button onClick={onAddNote} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>
      <Separator />
      <div className="flex-1 overflow-hidden flex flex-col">
        <NoteList
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={onSelectNote}
          onDeleteNote={onDeleteNote}
        />
      </div>
      <Separator />
      <div className="p-3 text-center">
        <span className="text-sm text-muted-foreground">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
      </div>
    </aside>
  );
};
