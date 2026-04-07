import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { useGreeting } from '@/hooks/useGreeting';
import './EmptyState.css';

interface EmptyStateProps {
  onCreateNote: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNote }) => {
  const { greeting, emptyStateMessage } = useGreeting();

  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <FileText size={64} strokeWidth={1.5} />
      </div>
      <h2 className="empty-state__title">{greeting}</h2>
      <p className="empty-state__description">{emptyStateMessage}</p>
      <button className="empty-state__button" onClick={onCreateNote}>
        <Plus size={18} />
        <span>Create New Note</span>
      </button>
    </div>
  );
};
