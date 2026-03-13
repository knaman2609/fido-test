import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onCreateNote: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNote }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-6 text-center bg-background">
      <div className="text-muted-foreground/50 mb-6">
        <FileText className="h-16 w-16" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Select a note to view
      </h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Choose a note from the sidebar or create a new one to get started.
      </p>
      <Button onClick={onCreateNote}>
        <Plus className="mr-2 h-4 w-4" />
        Create New Note
      </Button>
    </div>
  );
};
