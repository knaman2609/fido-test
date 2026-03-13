import React, { memo } from 'react';
import { Trash2 } from 'lucide-react';
import type { Note } from '@/types/note';
import { formatDate } from '@/utils/date';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
    <TooltipProvider>
      <div
        className={cn(
          "group flex items-start gap-2 p-3 mb-1 rounded-lg cursor-pointer",
          "transition-colors duration-150",
          "hover:bg-note-hover",
          isSelected && "bg-note-selected hover:bg-note-selected"
        )}
        onClick={handleClick}
      >
        <div className={cn("flex-1 min-w-0 flex flex-col gap-1")}>
          <h3
            className={cn(
              "text-[15px] font-semibold text-foreground truncate",
              "leading-tight"
            )}
          >
            {note.title}
          </h3>
          <div className={cn("flex items-center gap-2 text-[13px] text-muted-foreground")}>
            <span className={cn("font-medium shrink-0")}>
              {formatDate(note.updatedAt)}
            </span>
            <span className={cn("truncate flex-1 before:content-['•'] before:mr-2")}>
              {getPreview(note.content)}
            </span>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 opacity-0 group-hover:opacity-100",
                "transition-opacity duration-150",
                "hover:bg-destructive/10 hover:text-destructive"
              )}
              onClick={handleDelete}
              aria-label="Delete note"
            >
              <Trash2 size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete note</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
});

NoteItem.displayName = 'NoteItem';
