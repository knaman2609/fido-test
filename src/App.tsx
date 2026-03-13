import { Component, type FC, type ErrorInfo, type ReactNode } from 'react';
import { BlockNoteViewRaw, useCreateBlockNote } from '@blocknote/react';
import { useEffect } from 'react';
import '@blocknote/react/style.css';
import './App.css';

interface AppProps {
  storageKey?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('BlockNote editor error:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="app">
          <p>Something went wrong with the editor. Please refresh the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const DEFAULT_STORAGE_KEY = 'blocknote-document';

const App: FC<AppProps> = ({ storageKey = DEFAULT_STORAGE_KEY }) => {
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: 'heading',
        props: { level: 1 },
        content: 'Welcome to BlockNote',
      },
      {
        type: 'paragraph',
        content: 'Start typing to create your document...',
      },
    ],
  });

  useEffect(() => {
    if (!editor) return;

    const loadContent = async () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          editor.replaceBlocks(editor.document, parsed);
        }
      } catch (error) {
        console.warn('Failed to load content from localStorage:', error);
      }
    };

    loadContent();
  }, [editor, storageKey]);

  useEffect(() => {
    if (!editor) return;

    const unsubscribe = editor.onChange?.(() => {
      try {
        const content = editor.document;
        localStorage.setItem(storageKey, JSON.stringify(content));
      } catch (error) {
        console.warn('Failed to save content to localStorage:', error);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [editor, storageKey]);

  if (!editor) {
    return null;
  }

  return (
    <div className="app">
      <ErrorBoundary>
        <BlockNoteViewRaw editor={editor} />
      </ErrorBoundary>
    </div>
  );
};

export default App;
