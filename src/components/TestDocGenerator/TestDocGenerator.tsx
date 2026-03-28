import React, { useState, useCallback } from 'react';
import { TestDocButton } from '@/components/TestDocButton/TestDocButton';
import { useNotes } from '@/hooks/useNotes';
import './TestDocGenerator.css';

const BATCH_OPTIONS = [1, 3, 5, 10];

export const TestDocGenerator: React.FC = () => {
  const { addTestNote, addMultipleTestNotes } = useNotes();
  const [batchCount, setBatchCount] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [generatedCount, setGeneratedCount] = useState<number>(0);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);

    setTimeout(() => {
      if (batchCount === 1) {
        addTestNote();
        setGeneratedCount(1);
      } else {
        addMultipleTestNotes(batchCount);
        setGeneratedCount(batchCount);
      }

      setIsGenerating(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }, 50);
  }, [batchCount, addTestNote, addMultipleTestNotes]);

  const handleBatchChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setBatchCount(Number(event.target.value));
  }, []);

  return (
    <div className="test-doc-generator">
      <div className="test-doc-generator__controls">
        <div className="test-doc-generator__select-wrapper">
          <label htmlFor="batch-count" className="test-doc-generator__label">
            Count:
          </label>
          <select
            id="batch-count"
            className="test-doc-generator__select"
            value={batchCount}
            onChange={handleBatchChange}
            disabled={isGenerating}
            aria-label="Number of test documents to generate"
          >
            {BATCH_OPTIONS.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>
        <TestDocButton onClick={handleGenerate} disabled={isGenerating} />
      </div>
      {showSuccess && (
        <div className="test-doc-generator__success" role="status" aria-live="polite">
          Generated {generatedCount} {generatedCount === 1 ? 'note' : 'notes'}
        </div>
      )}
    </div>
  );
};
