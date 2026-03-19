import type { FC } from 'react';
import { BlockNoteEditor } from '@/components/BlockNoteEditor/BlockNoteEditor';
import './App.css';

const App: FC = () => {
  return (
    <div className="app">
      <BlockNoteEditor />
    </div>
  );
};

export default App;
