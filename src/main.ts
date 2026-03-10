import React from 'react';
import { createRoot } from 'react-dom/client';
import { todoService } from './todoService.js';
import { imageService, MAX_FILE_SIZE } from './imageService.js';
import { createUIRenderer } from './ui.js';
import { BlockNoteEditor } from './components/BlockNoteEditor.js';
import type { DOMElements, BlockNoteJSON } from './types.js';

function getDOMElements(): DOMElements {
  const todoInput = document.getElementById('todoInput');
  const addBtn = document.getElementById('addBtn');
  const todoList = document.getElementById('todoList');
  const errorMessage = document.getElementById('errorMessage');
  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');
  const clearImageBtn = document.getElementById('clearImageBtn');
  const editorContainer = document.getElementById('editorContainer');

  if (!todoInput || !addBtn || !todoList || !errorMessage || !imageInput || !imagePreview || !clearImageBtn || !editorContainer) {
    throw new Error('Required DOM elements not found');
  }

  return {
    todoInput: todoInput as HTMLInputElement,
    addBtn: addBtn as HTMLButtonElement,
    todoList: todoList as HTMLUListElement,
    errorMessage: errorMessage as HTMLDivElement,
    imageInput: imageInput as HTMLInputElement,
    imagePreview: imagePreview as HTMLDivElement,
    clearImageBtn: clearImageBtn as HTMLButtonElement,
    editorContainer: editorContainer as HTMLDivElement
  };
}

function init(): void {
  const elements = getDOMElements();
  const ui = createUIRenderer(elements.todoList, elements.errorMessage);

  function render(): void {
    ui.render(todoService.getAll());
  }

  function handleSave(errorMessage: string): void {
    try {
      todoService.save();
    } catch (_e) {
      ui.showError(errorMessage);
    }
  }

  async function handleImageSelect(file: File): Promise<string> {
    if (!imageService.validateFile(file)) {
      throw new Error(`Please select a valid image file (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
    }
    return await imageService.readFile(file);
  }

  function addTodo(content: BlockNoteJSON, image?: string): void {
    todoService.add(content, image);
    handleSave('Warning: Your todos cannot be saved. Storage may be full or disabled.');
    render();
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

  const root = createRoot(elements.editorContainer);
  root.render(
    React.createElement(BlockNoteEditor, {
      onSubmit: addTodo,
      onImageSelect: handleImageSelect
    })
  );

  todoService.load();
  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
