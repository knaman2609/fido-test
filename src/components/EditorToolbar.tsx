import type { FC } from 'react';
import type { BlockNoteEditor } from '@blocknote/core';

interface EditorToolbarProps {
  editor: BlockNoteEditor | null;
}

export const EditorToolbar: FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  const insertBlock = (type: 'paragraph' | 'heading' | 'bulletListItem' | 'numberedListItem' | 'checkListItem', props?: Record<string, unknown>) => {
    const currentBlock = editor.getTextCursorPosition().block;
    editor.insertBlocks(
      [{ type, props }],
      currentBlock,
      'after'
    );
  };

  const toggleBold = () => {
    editor.toggleStyles({ bold: true });
  };

  const toggleItalic = () => {
    editor.toggleStyles({ italic: true });
  };

  const toggleUnderline = () => {
    editor.toggleStyles({ underline: true });
  };

  const toggleStrike = () => {
    editor.toggleStyles({ strike: true });
  };

  const isBoldActive = (): boolean => {
    const styles = editor.getActiveStyles();
    return styles.bold === true;
  };

  const isItalicActive = (): boolean => {
    const styles = editor.getActiveStyles();
    return styles.italic === true;
  };

  const isUnderlineActive = (): boolean => {
    const styles = editor.getActiveStyles();
    return styles.underline === true;
  };

  const isStrikeActive = (): boolean => {
    const styles = editor.getActiveStyles();
    return styles.strike === true;
  };

  return (
    <div className="editor-toolbar">
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={() => insertBlock('heading', { level: 1 })}
          title="Title"
        >
          <span className="toolbar-btn-text">Title</span>
        </button>
        <button
          className="toolbar-btn"
          onClick={() => insertBlock('heading', { level: 2 })}
          title="Heading"
        >
          <span className="toolbar-btn-text">Heading</span>
        </button>
        <button
          className="toolbar-btn"
          onClick={() => insertBlock('paragraph')}
          title="Body"
        >
          <span className="toolbar-btn-text">Body</span>
        </button>
      </div>
      <div className="toolbar-divider"></div>
      <div className="toolbar-group">
        <button
          className={`toolbar-btn icon-btn ${isBoldActive() ? 'active' : ''}`}
          onClick={toggleBold}
          title="Bold"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          </svg>
        </button>
        <button
          className={`toolbar-btn icon-btn ${isItalicActive() ? 'active' : ''}`}
          onClick={toggleItalic}
          title="Italic"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="4" x2="10" y2="4"></line>
            <line x1="14" y1="20" x2="5" y2="20"></line>
            <line x1="15" y1="4" x2="9" y2="20"></line>
          </svg>
        </button>
        <button
          className={`toolbar-btn icon-btn ${isUnderlineActive() ? 'active' : ''}`}
          onClick={toggleUnderline}
          title="Underline"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
            <line x1="4" y1="21" x2="20" y2="21"></line>
          </svg>
        </button>
        <button
          className={`toolbar-btn icon-btn ${isStrikeActive() ? 'active' : ''}`}
          onClick={toggleStrike}
          title="Strikethrough"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.3 19c-1.4 1.4-3.3 2-5.3 2-4.4 0-8-3.6-8-8 0-2 .8-3.9 2-5.3"></path>
            <path d="M10.7 5c1.4-1.4 3.3-2 5.3-2 4.4 0 8 3.6 8 8 0 2-.8 3.9-2 5.3"></path>
            <line x1="4" y1="12" x2="20" y2="12"></line>
          </svg>
        </button>
      </div>
      <div className="toolbar-divider"></div>
      <div className="toolbar-group">
        <button
          className="toolbar-btn icon-btn"
          onClick={() => insertBlock('checkListItem')}
          title="Checklist"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4"></polyline>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>
        </button>
        <button
          className="toolbar-btn icon-btn"
          onClick={() => insertBlock('bulletListItem')}
          title="Bulleted List"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>
        <button
          className="toolbar-btn icon-btn"
          onClick={() => insertBlock('numberedListItem')}
          title="Numbered List"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"></line>
            <line x1="10" y1="12" x2="21" y2="12"></line>
            <line x1="10" y1="18" x2="21" y2="18"></line>
            <path d="M4 6h1v4"></path>
            <path d="M4 10h2"></path>
            <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};
