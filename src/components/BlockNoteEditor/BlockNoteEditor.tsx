import { useEffect, useCallback, useMemo } from 'react';
import { PartialBlock } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils/storage';
import './BlockNoteEditor.css';

const DEFAULT_STORAGE_KEY = 'blocknote-doc';

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

  const editor = useCreateBlockNote({
    initialContent,
  });

  const handleChange = useCallback(() => {
    if (editor) {
      saveToLocalStorage(storageKey, editor.document);
    }
  }, [editor, storageKey]);

  useEffect(() => {
    if (!editor) return;

    const unsubscribe = editor.onChange(handleChange);
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [editor, handleChange]);

  if (!editor) {
    return <div className="blocknote-loading">Loading editor...</div>;
  }

  return (
    <div className="blocknote-editor">
      <BlockNoteView editor={editor} theme="light" />
    </div>
  );
}
