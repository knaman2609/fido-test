import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { documentService } from './documentService.js';
import type { DOMElements } from './types.js';

function getDOMElements(): DOMElements {
  const editorContainer = document.getElementById('editorContainer');
  const errorMessage = document.getElementById('errorMessage');

  if (!editorContainer || !errorMessage) {
    throw new Error('Required DOM elements not found');
  }

  return {
    editorContainer: editorContainer as HTMLDivElement,
    errorMessage: errorMessage as HTMLDivElement
  };
}

function showError(message: string, errorElement: HTMLDivElement): void {
  errorElement.textContent = message;
  errorElement.classList.add('visible');
  setTimeout(() => {
    errorElement.classList.remove('visible');
  }, 5000);
}

function init(): void {
  const elements = getDOMElements();

  documentService.load();
  const doc = documentService.getCurrentDocument();

  if (!doc) {
    showError('Failed to load document', elements.errorMessage);
    return;
  }

  const editor = BlockNoteEditor.create({
    initialContent: doc.blocks
  });

  const root = createRoot(elements.editorContainer);

  const EditorComponent = () => {
    return createElement(BlockNoteView, {
      editor: editor,
      onChange: () => {
        try {
          documentService.save(editor.document);
        } catch (e) {
          showError('Warning: Unable to save changes. Storage may be full.', elements.errorMessage);
        }
      }
    });
  };

  root.render(createElement(EditorComponent));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
