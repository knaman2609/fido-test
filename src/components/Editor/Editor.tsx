import React from 'react';
import { Trash2, FileCode, Code2 } from 'lucide-react';
import type { Note } from '@/types/note';
import { formatFullDate } from '@/utils/date';
import { useEditorStore } from '@/store/editorStore';
import { MilkdownEditor } from './MilkdownEditor';
import './Editor.css';

interface EditorProps {
  note: Note;
  onUpdateNote: (id: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

export const Editor: React.FC<EditorProps> = ({
  note,
  onUpdateNote,
  onDeleteNote,
}) => {
  const { isDiffMode, setDiffMode } = useEditorStore();

  const handleChange = (content: string) => {
    onUpdateNote(note.id, content);
  };

  const handleDelete = () => {
    onDeleteNote(note.id);
  };

  return (
    <div className="editor">
      <div className="editor__header">
        <div className="editor__meta">
          <span className="editor__date">{formatFullDate(note.updatedAt)}</span>
        </div>
        <div className="editor__mode-toggle">
          <button
            className={`editor__mode-btn ${isDiffMode ? 'active' : ''}`}
            onClick={() => setDiffMode(true)}
            aria-label="Diff mode"
            title="Diff mode"
          >
            <Code2 size={16} />
            <span>Diff</span>
          </button>
          <button
            className={`editor__mode-btn ${!isDiffMode ? 'active' : ''}`}
            onClick={() => setDiffMode(false)}
            aria-label="Markdown mode"
            title="Markdown mode"
          >
            <FileCode size={16} />
            <span>Markdown</span>
          </button>
        </div>
        <button
          className="editor__delete-btn"
          onClick={handleDelete}
          aria-label="Delete note"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <div className="editor__content">
        <MilkdownEditor content={note.content} onChange={handleChange} isDiffMode={isDiffMode} />
      </div>
    </div>
  );
};
