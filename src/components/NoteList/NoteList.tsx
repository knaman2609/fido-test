import React from 'react';
import type { Note } from '@/types/note';
import { NoteItem } from '@/components/NoteItem/NoteItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
}) => {
  if (notes.length === 0) {
    return (
      <div
        className={cn(
          "flex-1 flex items-center justify-center",
          "min-h-[200px]"
        )}
      >
        <p className={cn("text-sm text-muted-foreground text-center")}>
          No notes found
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("flex-1 py-2")}>
      <div className={cn("px-2")}>
        {notes.map(note => (
          <NoteItem
            key={note.id}
            note={note}
            isSelected={note.id === selectedNoteId}
            onSelect={onSelectNote}
            onDelete={onDeleteNote}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
