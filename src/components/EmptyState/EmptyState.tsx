import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  onCreateNote: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNote }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        "h-screen px-6 py-8 text-center",
        "bg-background"
      )}
    >
      <div className={cn("text-muted-foreground/50 mb-6")}>
        <FileText size={64} strokeWidth={1.5} />
      </div>
      <h2 className={cn("text-2xl font-semibold text-foreground mb-2")}>
        Select a note to view
      </h2>
      <p className={cn("text-[15px] text-muted-foreground mb-6 max-w-[400px] leading-relaxed")}>
        Choose a note from the sidebar or create a new one to get started.
      </p>
      <Button onClick={onCreateNote} className={cn("gap-2")}>
        <Plus size={18} />
        <span>Create New Note</span>
      </Button>
    </div>
  );
};
