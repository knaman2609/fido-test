import { type FC, useEffect, useRef } from 'react';
import { BlockNoteViewRaw, useCreateBlockNote } from '@blocknote/react';
import type { Note, BlockNoteBlock } from '../types/note';
import { EditorToolbar } from './EditorToolbar';
import { NoteMetadata } from './NoteMetadata';

interface NoteEditorProps {
  note: Note | null;
  onChange: (content: BlockNoteBlock[]) => void;
}

export const NoteEditor: FC<NoteEditorProps> = ({ note, onChange }) => {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useCreateBlockNote({
    initialContent: note?.content?.length ? note.content : undefined,
  });

  useEffect(() => {
    if (!editor || !note) return;

    const currentContent = editor.document;
    const newContent = note.content;

    const hasContentChanged = () => {
      if (currentContent.length !== newContent.length) return true;
      return currentContent.some((block, index) => {
        const newBlock = newContent[index];
        if (!newBlock) return true;
        return block.type !== newBlock.type ||
               JSON.stringify(block.content) !== JSON.stringify(newBlock.content);
      });
    };

    if (hasContentChanged()) {
      try {
        editor.replaceBlocks(
          editor.document.map((b) => b.id),
          newContent
        );
      } catch (error) {
        console.warn('Failed to load note content:', error);
      }
    }
  }, [editor, note?.id]);

  useEffect(() => {
    if (!editor || !note) return;

    const unsubscribe = editor.onChange?.(() => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        try {
          const content = editor.document as BlockNoteBlock[];
          onChange(content);
        } catch (error) {
          console.warn('Failed to save note content:', error);
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
  }, [editor, note, onChange]);

  if (!note) {
    return (
      <div className="editor-container empty">
        <div className="empty-editor">
          <div className="empty-editor-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <p className="empty-editor-title">Select a note to view</p>
          <p className="empty-editor-subtitle">Choose a note from the sidebar or create a new one</p>
        </div>
      </div>
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <NoteMetadata note={note} />
      </div>
      <div className="editor-toolbar-wrapper">
        <EditorToolbar editor={editor} />
      </div>
      <div className="editor-content">
        <BlockNoteViewRaw
          editor={editor}
          sideMenu={true}
          formattingToolbar={false}
          linkToolbar={true}
          slashMenu={true}
          emojiPicker={true}
          filePanel={true}
          tableHandles={true}
        />
      </div>
    </div>
  );
};
