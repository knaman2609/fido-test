import type { FC } from 'react';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { Editor } from '@/components/Editor/Editor';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { LandingPage } from '@/components/LandingPage/LandingPage';
import { useNotes } from '@/hooks/useNotes';
import { useThemeStore } from '@/store/themeStore';
import { useLandingStore } from '@/store/landingStore';
import './App.css';

const App: FC = () => {
  const {
    filteredNotes,
    selectedNote,
    selectedNoteId,
    searchQuery,
    addNote,
    updateNote,
    deleteNote,
    selectNote,
    setSearchQuery,
  } = useNotes();

  const { theme } = useThemeStore();
  const { hasEnteredApp } = useLandingStore();

  if (!hasEnteredApp) {
    return (
      <div className="app" data-theme={theme}>
        <LandingPage />
      </div>
    );
  }

  return (
    <div className="app" data-theme={theme}>
      <Sidebar
        notes={filteredNotes}
        selectedNoteId={selectedNoteId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectNote={selectNote}
        onDeleteNote={deleteNote}
        onAddNote={addNote}
      />
      <main className="app__main">
        {selectedNote ? (
          <Editor
            key={selectedNote.id}
            note={selectedNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
          />
        ) : (
          <EmptyState onCreateNote={addNote} />
        )}
      </main>
    </div>
  );
}

export default App;
