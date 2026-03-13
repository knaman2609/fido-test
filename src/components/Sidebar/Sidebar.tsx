import React from 'react';
import { Plus } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { NoteList } from '@/components/NoteList/NoteList';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
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
    <aside
      className={cn(
        "flex flex-col w-80 min-w-[320px] h-screen",
        "bg-sidebar border-r border-border",
        "max-md:w-full max-md:min-w-full max-md:border-r-0"
      )}
    >
      <div className={cn("p-4 flex flex-col gap-3 border-b border-border")}>
        <Button onClick={onAddNote} className={cn("w-full gap-2")}>
          <Plus size={18} />
          <span>New Note</span>
        </Button>
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>
      <div className={cn("flex-1 overflow-hidden flex flex-col")}>
        <NoteList
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={onSelectNote}
          onDeleteNote={onDeleteNote}
        />
      </div>
      <Separator />
      <div className={cn("px-4 py-3 text-center")}>
        <span className={cn("text-sm text-muted-foreground")}>
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
      </div>
    </aside>
  );
};
