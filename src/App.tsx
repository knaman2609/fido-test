import type { FC } from 'react';
import { BlockNoteView } from '@blocknote/react';
import { useBlockNote } from '@blocknote/react';
import { useEffect } from 'react';
import '@blocknote/react/style.css';
import './App.css';

const STORAGE_KEY = 'blocknote-document';

const defaultContent = [
  {
    type: 'heading',
    props: { level: 1 },
    content: [{ type: 'text', text: 'Welcome to BlockNote' }],
  },
  {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Start typing to create your document...' }],
  },
];

const App: FC = () => {
  const editor = useBlockNote({
    initialContent: defaultContent,
    onEditorContentChange: (editor) => {
      try {
        const content = editor.topLevelBlocks;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      } catch {
        // localStorage may be blocked in privacy mode
      }
    },
  });

  useEffect(() => {
    if (!editor) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        editor.replaceBlocks(editor.topLevelBlocks, parsed);
      }
    } catch {
      // Use default content if parsing fails
    }
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
