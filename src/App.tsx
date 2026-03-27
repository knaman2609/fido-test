import type { FC } from 'react';
import { BlockNoteEditor } from '@/components/BlockNoteEditor/BlockNoteEditor';
import './App.css';

const App: FC = () => {
  const storageKey = 'blocknote-doc';

  return (
    <div className="app">
      <BlockNoteEditor key={storageKey} storageKey={storageKey} />
    </div>
  );
};

export default App;
