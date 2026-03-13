import { Component, type ErrorInfo, type ReactNode, useCallback } from 'react';
import { useNotes } from './hooks/useNotes';
import { Sidebar } from './components/Sidebar';
import { NoteEditor } from './components/NoteEditor';
import type { BlockNoteBlock } from './types/note';
import '@blocknote/react/style.css';
import './App.css';

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
    console.error('Editor error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="app">
          <div className="error-fallback">
            <p>Something went wrong with the editor.</p>
            <button onClick={this.handleReset}>Try Again</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const {
    filteredNotes,
    selectedNoteId,
    selectedNote,
    searchQuery,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    setSearchQuery,
  } = useNotes();

  const handleNoteChange = useCallback((content: Parameters<typeof updateNote>[1]) => {
    if (selectedNote) {
      updateNote(selectedNote.id, content);
    }
  }, [selectedNote, updateNote]);

  return (
    <div className="app">
      <Sidebar
        notes={filteredNotes}
        selectedNoteId={selectedNoteId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNoteSelect={selectNote}
        onNewNote={createNote}
        onDeleteNote={deleteNote}
      />
      <ErrorBoundary>
        <NoteEditor note={selectedNote} onChange={handleNoteChange} />
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
