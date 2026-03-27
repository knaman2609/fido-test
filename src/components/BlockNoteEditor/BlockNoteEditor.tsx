import { useEffect, useCallback, useRef, useMemo, useState } from 'react';
import { PartialBlock } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/storage';
import './BlockNoteEditor.css';

const DEFAULT_STORAGE_KEY = 'blocknote-doc';
const SAVE_DEBOUNCE_MS = 500;

const DEFAULT_CONTENT: readonly PartialBlock[] = [
  {
    type: 'heading',
    props: { level: 1 },
    content: 'Welcome to BlockNote',
  },
  {
    type: 'paragraph',
    content: 'Start typing to create your document. Your content is automatically saved to localStorage.',
  },
];

interface BlockNoteEditorProps {
  storageKey?: string;
}

export function BlockNoteEditor({ storageKey = DEFAULT_STORAGE_KEY }: BlockNoteEditorProps) {
  const initialContent = useMemo(() => loadFromLocalStorage(storageKey) || JSON.parse(JSON.stringify(DEFAULT_CONTENT)), [storageKey]);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const editor = useCreateBlockNote({
    initialContent,
  });

  const handleChange = useCallback(() => {
    if (!editor) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const success = saveToLocalStorage(storageKey, editor.document);
      if (!success) {
        setSaveError('Failed to save document. Storage may be full.');
      } else {
        setSaveError(null);
      }
    }, SAVE_DEBOUNCE_MS);
  }, [editor, storageKey]);

  useEffect(() => {
    if (!editor) return;

    const unsubscribe = editor.onChange(handleChange);
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      const success = saveToLocalStorage(storageKey, editor.document);
      if (!success) {
        setSaveError('Failed to save document. Storage may be full.');
      }
    };
  }, [editor, handleChange, storageKey]);

  if (!editor) {
    return <div className="blocknote-loading" role="status" aria-live="polite">Loading editor...</div>;
  }

  return (
    <div className="blocknote-editor">
      {saveError && (
        <div className="blocknote-save-error" role="alert">
          {saveError}
        </div>
      )}
      <div className="blocknote-editor-wrapper">
        <BlockNoteView editor={editor} theme="light" />
      </div>
    </div>
  );
}
