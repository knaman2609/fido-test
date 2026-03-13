import { type FC, useEffect, useRef } from 'react';
import { BlockNoteViewRaw, useCreateBlockNote } from '@blocknote/react';
import type { Note, BlockNoteBlock } from '../types/note';

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
          <p>Select a note to start editing</p>
        </div>
      </div>
    );
  }

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-container">
      <BlockNoteViewRaw
        editor={editor}
        sideMenu={true}
        formattingToolbar={true}
        linkToolbar={true}
        slashMenu={true}
        emojiPicker={true}
        filePanel={true}
        tableHandles={true}
      />
    </div>
  );
};
