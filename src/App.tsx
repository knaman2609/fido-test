import type { FC } from 'react';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { Editor } from '@/components/Editor/Editor';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { useNotes } from '@/hooks/useNotes';
import './App.css';

const App: FC = () => {
  const {
    filteredNotes,
    selectedNote,
    selectedNoteId,
    searchQuery,
    showFavoritesOnly,
    addNote,
    updateNote,
    deleteNote,
    selectNote,
    setSearchQuery,
    toggleFavorite,
    setShowFavoritesOnly,
  } = useNotes();

  return (
    <div className="app">
      <Sidebar
        notes={filteredNotes}
        selectedNoteId={selectedNoteId}
        searchQuery={searchQuery}
        showFavoritesOnly={showFavoritesOnly}
        onSearchChange={setSearchQuery}
        onSelectNote={selectNote}
        onDeleteNote={deleteNote}
        onAddNote={addNote}
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        onToggleFavorite={toggleFavorite}
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
