import React from 'react';
import { FileText, Plus } from 'lucide-react';
import './EmptyState.css';

interface EmptyStateProps {
  onCreateNote: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNote }) => {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        <FileText size={64} strokeWidth={1.5} />
      </div>
      <h2 className="empty-state__title">Select a note to view</h2>
      <p className="empty-state__description">
        Choose a note from the sidebar or create a new one to get started.
      </p>
      <button className="empty-state__button" onClick={onCreateNote}>
        <Plus size={18} />
        <span>Create New Note</span>
      </button>
    </div>
  );
};
