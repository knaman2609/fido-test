import React, { memo } from 'react';
import { Trash2 } from 'lucide-react';
import type { Note } from '@/types/note';
import { formatDate } from '@/utils/date';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

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
}) => {
  const handleClick = () => {
    onSelect(note.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-2 px-4 py-3 mx-2 mb-1 rounded-lg cursor-pointer transition-colors",
        isSelected ? "bg-accent" : "hover:bg-accent/50"
      )}
      onClick={handleClick}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground truncate">
          {note.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium shrink-0">{formatDate(note.updatedAt)}</span>
          <span className="truncate">• {getPreview(note.content)}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onClick={handleDelete}
        aria-label="Delete note"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
});

NoteItem.displayName = 'NoteItem';
