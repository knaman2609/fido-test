import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote, type BlockNoteEditor } from '@blocknote/core';
import { todoService } from './todoService.js';
import { imageService, MAX_FILE_SIZE } from './imageService.js';
import { createUIRenderer } from './ui.js';
import { blocknoteService } from './blocknoteService.js';
import type { DOMElements, BlockNoteDocument } from './types.js';

import '@blocknote/mantine/style.css';
import '@mantine/core/styles.css';

interface EditorProps {
  onEditorReady?: (editor: BlockNoteEditor) => void;
}

function EditorComponent({ onEditorReady }: EditorProps): React.ReactElement {
  const editor = useCreateBlockNote({
    initialContent: blocknoteService.createEmptyDocument()
  }) as unknown as BlockNoteEditor;

  React.useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  return React.createElement(BlockNoteView, {
    editor,
    className: 'bn-editor'
  });
}

let editorInstance: BlockNoteEditor | null = null;
let reactRoot: Root | null = null;

function getDOMElements(): DOMElements {
  const editorContainer = document.getElementById('editorContainer');
  const addBtn = document.getElementById('addBtn');
  const todoList = document.getElementById('todoList');
  const errorMessage = document.getElementById('errorMessage');
  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');
  const clearImageBtn = document.getElementById('clearImageBtn');

  if (!editorContainer || !addBtn || !todoList || !errorMessage || !imageInput || !imagePreview || !clearImageBtn) {
    throw new Error('Required DOM elements not found');
  }

  return {
    editorContainer: editorContainer as HTMLDivElement,
    addBtn: addBtn as HTMLButtonElement,
    todoList: todoList as HTMLUListElement,
    errorMessage: errorMessage as HTMLDivElement,
    imageInput: imageInput as HTMLInputElement,
    imagePreview: imagePreview as HTMLDivElement,
    clearImageBtn: clearImageBtn as HTMLButtonElement
  };
}

function initEditor(container: HTMLDivElement): void {
  if (reactRoot) {
    return;
  }

  reactRoot = createRoot(container);

  const handleEditorReady = (editor: BlockNoteEditor): void => {
    editorInstance = editor;
  };

  reactRoot.render(
    React.createElement(EditorComponent, { onEditorReady: handleEditorReady })
  );
}

function getEditorContent(): BlockNoteDocument | null {
  if (!editorInstance) {
    return null;
  }

  return editorInstance.document as BlockNoteDocument;
}

function clearEditor(): void {
  if (editorInstance) {
    editorInstance.replaceBlocks(editorInstance.document, blocknoteService.createEmptyDocument());
  }
}

function init(): void {
  const elements = getDOMElements();
  const ui = createUIRenderer(elements.todoList, elements.errorMessage);
  let currentImage: string | null = null;

  initEditor(elements.editorContainer);

  function render(): void {
    ui.render(todoService.getAll());
  }

  function handleSave(errorMessage: string): void {
    try {
      todoService.save();
    } catch {
      ui.showError(errorMessage);
    }
  }

  function clearImage(): void {
    currentImage = null;
    elements.imageInput.value = '';
    elements.imagePreview.innerHTML = '';
    elements.imagePreview.classList.remove('has-image');
    elements.clearImageBtn.classList.remove('visible');
  }

  async function handleImageSelect(e: Event): Promise<void> {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    currentImage = null;
    elements.imagePreview.innerHTML = '';
    elements.imagePreview.classList.remove('has-image');
    elements.clearImageBtn.classList.remove('visible');

    if (!file) {
      return;
    }

    if (!imageService.validateFile(file)) {
      currentImage = null;
      ui.showError(`Please select a valid image file (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
      elements.imageInput.value = '';
      return;
    }

    try {
      const base64 = await imageService.readFile(file);
      currentImage = base64;

      elements.imagePreview.innerHTML = '';
      const img = document.createElement('img');
      img.src = base64;
      img.alt = 'Image preview';
      elements.imagePreview.appendChild(img);
      elements.imagePreview.classList.add('has-image');
      elements.clearImageBtn.classList.add('visible');
    } catch {
      ui.showError('Failed to read image file');
      clearImage();
    }
  }

  function addTodo(): void {
    const content = getEditorContent();
    if (!content) {
      return;
    }

    const plainText = blocknoteService.extractPlainText(content);
    if (!plainText.trim()) {
      return;
    }

    todoService.add(content, currentImage ?? undefined);
    handleSave('Warning: Your todos cannot be saved. Storage may be full or disabled.');
    render();
    clearEditor();
    clearImage();
  }

  function toggleTodo(id: number): void {
    todoService.toggle(id);
    handleSave('Warning: Unable to save changes.');
    render();
  }

  function deleteTodo(id: number): void {
    todoService.delete(id);
    handleSave('Warning: Unable to save changes.');
    render();
  }

  elements.todoList.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const action = target.getAttribute('data-action');

    if (action === 'delete') {
      const id = parseInt(target.getAttribute('data-id') ?? '', 10);
      if (isNaN(id)) {
        return;
      }
      deleteTodo(id);
    }
  });

  elements.todoList.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.getAttribute('data-action') === 'toggle') {
      const id = parseInt(target.getAttribute('data-id') ?? '', 10);
      if (isNaN(id)) {
        return;
      }
      toggleTodo(id);
    }
  });

  elements.addBtn.addEventListener('click', addTodo);
  elements.imageInput.addEventListener('change', (e: Event) => {
    void handleImageSelect(e);
  });
  elements.clearImageBtn.addEventListener('click', clearImage);

  todoService.load();
  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
