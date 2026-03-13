import { type FC, useEffect, useRef } from 'react';
import { BlockNoteViewRaw, useCreateBlockNote } from '@blocknote/react';
import type { Note, BlockContent } from '../types/note';

interface NoteEditorProps {
  note: Note | null;
  onChange: (content: BlockContent[]) => void;
}

export const NoteEditor: FC<NoteEditorProps> = ({ note, onChange }) => {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useCreateBlockNote({
    initialContent: note?.content || [
      {
        type: 'paragraph',
        content: '',
      },
    ],
  });

  useEffect(() => {
    if (!editor || !note) return;

    const loadContent = async () => {
      try {
        if (note.content && note.content.length > 0) {
          editor.replaceBlocks(
            editor.document.map((b) => b.id),
            note.content
          );
        } else {
          editor.replaceBlocks(
            editor.document.map((b) => b.id),
            [
              {
                type: 'paragraph',
                content: '',
              },
            ]
          );
        }
      } catch (error) {
        console.warn('Failed to load note content:', error);
      }
    };

    loadContent();
  }, [editor, note?.id]);

  useEffect(() => {
    if (!editor || !note) return;

    const unsubscribe = editor.onChange?.(() => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        try {
          const content = editor.document as BlockContent[];
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
        sideMenu={false}
        formattingToolbar={false}
        linkToolbar={false}
        slashMenu={false}
        emojiPicker={false}
        filePanel={false}
        tableHandles={false}
      />
    </div>
  );
};
