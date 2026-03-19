import { useEffect, useCallback } from 'react';
import { BlockNoteEditor as BlockNoteCoreEditor, PartialBlock } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import './BlockNoteEditor.css';

const STORAGE_KEY = 'blocknote-doc';

const defaultContent: PartialBlock[] = [
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

function loadFromLocalStorage(): PartialBlock[] | null {
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      if (parsed && Array.isArray(parsed.content)) {
        return parsed.content;
      }
    }
  } catch (error) {
    console.warn('Error loading from localStorage:', error);
  }
  return null;
}

function saveToLocalStorage(content: PartialBlock[]) {
  try {
    const data = {
      version: 1,
      content,
      lastModified: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Error saving to localStorage:', error);
  }
}

export function BlockNoteEditor() {
  const initialContent = loadFromLocalStorage() || defaultContent;

  const editor = useCreateBlockNote({
    initialContent,
  });

  const handleChange = useCallback(() => {
    if (editor) {
      saveToLocalStorage(editor.document);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const unsubscribe = editor.onChange(handleChange);
    return () => {
      unsubscribe();
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
