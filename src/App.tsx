import { Component, type FC, type ErrorInfo, type ReactNode } from 'react';
import { BlockNoteViewRaw, useCreateBlockNote } from '@blocknote/react';
import { useEffect, useRef } from 'react';
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

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!editor) return;

    const loadContent = async () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (
            Array.isArray(parsed) &&
            parsed.every(
              (b) =>
                b &&
                typeof b === 'object' &&
                typeof b.type === 'string' &&
                b.type.length > 0
            )
          ) {
            editor.replaceBlocks(
              editor.document.map((b) => b.id),
              parsed
            );
          } else {
            console.warn('Invalid saved data format: expected array of blocks with type property');
          }
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
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        try {
          const content = editor.document;
          localStorage.setItem(storageKey, JSON.stringify(content));
        } catch (error) {
          if (error instanceof Error && error.name === 'QuotaExceededError') {
            console.error('Document too large to save locally. Storage quota exceeded.');
            alert('Document is too large to save locally. Please reduce content or export manually.');
          } else {
            console.warn('Failed to save content to localStorage:', error);
          }
        }
      }, 500);
    });

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
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
        <BlockNoteViewRaw
          editor={editor}
          sideMenu={false}
          formattingToolbar={false}
          linkToolbar={false}
          slashMenu={false}
          emojiPicker={false}
          filePanel={false}
          tableHandles={false}
        />
      </ErrorBoundary>
    </div>
  );
};

export default App;
