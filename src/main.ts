/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { createElement, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
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

  const root: Root = createRoot(elements.editorContainer);

  const EditorComponent = (): ReactElement => {
    return createElement(BlockNoteView, {
      editor: editor,
      onChange: (): void => {
        try {
          documentService.save(editor.document);
        } catch {
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
