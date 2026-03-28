import React from 'react';
import { FilePlus } from 'lucide-react';
import './TestDocButton.css';

interface TestDocButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const TestDocButton: React.FC<TestDocButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className="test-doc-button"
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-label="Generate test document"
    >
      <FilePlus size={18} />
      <span>Test Doc</span>
    </button>
  );
};
