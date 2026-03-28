import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TestDocButton } from '@/components/TestDocButton/TestDocButton';
import { useNotes } from '@/hooks/useNotes';
import './TestDocGenerator.css';

const BATCH_OPTIONS = [1, 3, 5, 10];
const SUCCESS_MESSAGE_DURATION_MS = 2000;
const UI_UPDATE_DELAY_MS = 50;

export const TestDocGenerator: React.FC = () => {
  const { addTestNote, addMultipleTestNotes } = useNotes();
  const [batchCount, setBatchCount] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [generatedCount, setGeneratedCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setError(null);

    timeoutRef.current = setTimeout(() => {
      try {
        if (batchCount === 1) {
          addTestNote();
          setGeneratedCount(1);
        } else {
          addMultipleTestNotes(batchCount);
          setGeneratedCount(batchCount);
        }

        setIsGenerating(false);
        setShowSuccess(true);

        successTimeoutRef.current = setTimeout(() => {
          setShowSuccess(false);
        }, SUCCESS_MESSAGE_DURATION_MS);
      } catch (err) {
        setIsGenerating(false);
        setError(err instanceof Error ? err.message : 'Failed to generate test notes');
      }
    }, UI_UPDATE_DELAY_MS);
  }, [batchCount, addTestNote, addMultipleTestNotes]);

  const handleBatchChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setBatchCount(Number(event.target.value));
    setError(null);
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
      {error && (
        <div className="test-doc-generator__error" role="alert" aria-live="assertive">
          Error: {error}
        </div>
      )}
    </div>
  );
};
