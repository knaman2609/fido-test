import { useEffect, useCallback } from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { type BlockNoteEditor } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import './App.css';

const LOCAL_STORAGE_KEY = "blocknote-document";

function App() {
  const loadInitialContent = useCallback(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load content from localStorage", e);
    }
    return undefined;
  }, []);

  const editor = useCreateBlockNote({
    initialContent: loadInitialContent(),
  });

  useEffect(() => {
    if (!editor) return;

    const saveContent = () => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editor.document));
      } catch (e) {
        console.error("Failed to save content to localStorage", e);
      }
    };

    const unsubscribe = editor.onChange(saveContent);
    return () => unsubscribe();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="app">
      <BlockNoteView editor={editor} />
    </div>
  );
}

export default App;
