import { useEffect, useCallback, useMemo, useRef } from 'react';
import { PartialBlock } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/storage';
import './BlockNoteEditor.css';

const DEFAULT_STORAGE_KEY = 'blocknote-doc';
const SAVE_DEBOUNCE_MS = 500;

const DEFAULT_CONTENT: PartialBlock[] = [
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
  const initialContent = useMemo(() => loadFromLocalStorage(storageKey) || DEFAULT_CONTENT, [storageKey]);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedStorageKeyRef = useRef<string | null>(null);

  const editor = useCreateBlockNote({
    initialContent,
  });

  const handleChange = useCallback(() => {
    if (!editor) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveToLocalStorage(storageKey, editor.document);
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
        saveToLocalStorage(storageKey, editor.document);
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [editor, handleChange]);

  useEffect(() => {
    if (!editor) return;

    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    try {
      const newContent = loadFromLocalStorage(storageKey);
      if (newContent) {
        editor.replaceBlocks(editor.document, newContent);
      } else {
        editor.replaceBlocks(editor.document, DEFAULT_CONTENT);
      }
    } catch (error) {
      console.warn('Error loading content from localStorage:', error);
      editor.replaceBlocks(editor.document, DEFAULT_CONTENT);
    }
  }, [storageKey, editor]);

  if (!editor) {
    return <div className="blocknote-loading" role="status" aria-live="polite">Loading editor...</div>;
  }

  return (
    <div className="blocknote-editor">
      <BlockNoteView editor={editor} theme="light" />
    </div>
  );
}
