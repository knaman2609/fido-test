import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Note } from '@/types/note';
import { formatFullDate } from '@/utils/date';
import { MilkdownEditor } from './MilkdownEditor';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import './Editor.css';

interface EditorProps {
  note: Note;
  onUpdateNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

export const Editor: React.FC<EditorProps> = ({
  note,
  onUpdateNote,
  onDeleteNote,
}) => {
  const handleChange = (content: string) => {
    onUpdateNote(note.id, content);
  };

  const handleDelete = () => {
    onDeleteNote(note.id);
  };

  return (
    <TooltipProvider>
      <div className={cn("flex flex-col h-screen bg-background")}>
        <div
          className={cn(
            "flex items-center justify-between",
            "px-6 py-4 border-b border-border",
            "shrink-0"
          )}
        >
          <div className={cn("flex items-center gap-3")}>
            <span className={cn("text-[13px] text-muted-foreground")}>
              {formatFullDate(note.updatedAt)}
            </span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9",
                  "hover:bg-destructive/10 hover:text-destructive"
                )}
                onClick={handleDelete}
                aria-label="Delete note"
              >
                <Trash2 size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete note</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className={cn("flex-1 overflow-y-auto px-12 py-6")}>
          <MilkdownEditor content={note.content} onChange={handleChange} />
        </div>
      </div>
    </TooltipProvider>
  );
};
