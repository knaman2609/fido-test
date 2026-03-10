import React, { useCallback, useRef, useState } from 'react';
import { BlockNoteEditor as BNEditor } from '@blocknote/core';
import {
  BlockNoteViewRaw,
  DefaultReactSuggestionItem,
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from '@blocknote/react';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import type { BlockNoteJSON, BlockNoteEditorProps } from '../types.js';
import { isEmptyContent } from '../blocknoteService.js';
import './BlockNoteEditor.css';

const getCustomSlashMenuItems = (
  editor: BNEditor
): DefaultReactSuggestionItem[] => [
  ...getDefaultReactSlashMenuItems(editor),
];

function filterItems<T extends { title: string; aliases?: readonly string[] | string[] }>(
  items: T[],
  query: string
): T[] {
  const lowerQuery = query.toLowerCase();
  return items.filter(item => {
    const titleMatch = item.title.toLowerCase().includes(lowerQuery);
    const aliasMatch = item.aliases?.some(alias =>
      alias.toLowerCase().includes(lowerQuery)
    );
    return titleMatch || aliasMatch;
  });
}

export const BlockNoteEditor: React.FC<BlockNoteEditorProps> = ({
  onSubmit,
  onImageSelect,
}) => {
  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: 'paragraph',
        content: '',
      },
    ],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentImage, setCurrentImage] = useState<string | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (onImageSelect) {
      try {
        const base64 = await onImageSelect(file);
        setCurrentImage(base64);
        setImagePreview(base64);
      } catch {
        setCurrentImage(undefined);
        setImagePreview(undefined);
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCurrentImage(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageSelect]);

  const handleClearImage = useCallback(() => {
    setCurrentImage(undefined);
    setImagePreview(undefined);
  }, []);

  const handleSubmit = useCallback(() => {
    const content = editor.document as BlockNoteJSON;

    if (isEmptyContent(content) && !currentImage) {
      return;
    }

    onSubmit(content, currentImage);

    editor.replaceBlocks(editor.document, [
      {
        type: 'paragraph',
        content: '',
      },
    ]);

    setCurrentImage(undefined);
    setImagePreview(undefined);
  }, [editor, onSubmit, currentImage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className="blocknote-editor-wrapper" onKeyDown={handleKeyDown}>
      <div className="blocknote-editor-container">
        <BlockNoteViewRaw
          editor={editor}
          slashMenu={false}
          className="blocknote-editor"
        >
          <SuggestionMenuController
            triggerCharacter="/"
            getItems={async (query) =>
              filterItems(getCustomSlashMenuItems(editor), query)
            }
          />
        </BlockNoteViewRaw>
      </div>

      <div className="editor-toolbar">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden-file-input"
          aria-label="Attach image"
        />

        <button
          type="button"
          className="toolbar-btn image-btn"
          onClick={handleImageClick}
          title="Attach image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          Image
        </button>

        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="toolbar-image-preview" />
            <button
              type="button"
              className="clear-image-btn-toolbar"
              onClick={handleClearImage}
              title="Remove image"
            >
              ×
            </button>
          </div>
        )}

        <div className="toolbar-spacer" />

        <span className="keyboard-hint">Ctrl+Enter to add</span>

        <button
          type="button"
          className="toolbar-btn submit-btn"
          onClick={handleSubmit}
        >
          Add Todo
        </button>
      </div>
    </div>
  );
};

export default BlockNoteEditor;
