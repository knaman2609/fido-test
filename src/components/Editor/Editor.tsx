import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Note } from '@/types/note';
import { formatFullDate } from '@/utils/date';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MilkdownEditor } from './MilkdownEditor';

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
    <div className="flex flex-col h-screen bg-background">
      <div className="flex items-center justify-between px-6 py-4 shrink-0">
        <span className="text-sm text-muted-foreground">
          {formatFullDate(note.updatedAt)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          aria-label="Delete note"
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto px-12 py-6">
        <MilkdownEditor content={note.content} onChange={handleChange} />
      </div>
    </div>
  );
};
