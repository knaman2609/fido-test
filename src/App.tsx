import type { FC } from 'react';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';
import { useEffect } from 'react';
import '@blocknote/mantine/style.css';
import './App.css';

const STORAGE_KEY = 'blocknote-document';

const App: FC = () => {
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: 'heading',
        props: { level: 1 },
        content: [{ type: 'text', text: 'Welcome to BlockNote' }],
      },
      {
        type: 'paragraph',
        content: [{ type: 'text', text: 'Start typing to create your document...' }],
      },
    ],
  });

  useEffect(() => {
    if (!editor) return;

    const loadContent = async () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          editor.replaceBlocks(editor.document, parsed);
        }
      } catch {
        // Use default content if parsing fails
      }
    };

    loadContent();
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const unsubscribe = editor.onChange(() => {
      try {
        const content = editor.document;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      } catch {
        // localStorage may be blocked in privacy mode
      }
    });

    return () => {
      unsubscribe();
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="app">
      <BlockNoteView editor={editor} />
    </div>
  );
};

export default App;
