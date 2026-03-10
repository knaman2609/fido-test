import { todoService } from './todoService.js';
import { imageService, MAX_FILE_SIZE } from './imageService.js';
import { createUIRenderer } from './ui.js';
import { 
  initializeEditor, 
  getContent, 
  setContent, 
  createEmptyDocument,
  isEmptyContent,
  type BlockNoteDocument
} from './blocknoteService.js';
import type { DOMElements } from './types.js';
import type { BlockNoteEditor } from '@blocknote/core';

function getDOMElements(): DOMElements {
  const editorContainer = document.getElementById('editor');
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

async function init(): Promise<void> {
  const elements = getDOMElements();
  const ui = createUIRenderer(elements.todoList, elements.errorMessage);
  let currentImage: string | null = null;
  let editor: BlockNoteEditor;

  try {
    editor = initializeEditor(elements.editorContainer);
    await editor.ready;
  } catch (error) {
    ui.showError('Failed to initialize editor. Please refresh the page.');
    console.error('Editor initialization error:', error);
    return;
  }

  function render(): void {
    ui.render(todoService.getAll());
  }

  function handleSave(errorMessage: string): void {
    try {
      todoService.save();
    } catch (e) {
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

    if (!file) return;

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
    } catch (error) {
      ui.showError('Failed to read image file');
      clearImage();
    }
  }

  function addTodo(): void {
    const content = getContent(editor);
    
    if (isEmptyContent(content)) return;

    todoService.add(content, currentImage || undefined);
    handleSave('Warning: Your todos cannot be saved. Storage may be full or disabled.');
    render();
    setContent(editor, createEmptyDocument());
    clearImage();
    editor.focus();
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
      const id = parseInt(target.getAttribute('data-id') || '', 10);
      if (isNaN(id)) return;
      deleteTodo(id);
    }
  });

  elements.todoList.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.getAttribute('data-action') === 'toggle') {
      const id = parseInt(target.getAttribute('data-id') || '', 10);
      if (isNaN(id)) return;
      toggleTodo(id);
    }
  });

  elements.addBtn.addEventListener('click', addTodo);
  elements.imageInput.addEventListener('change', handleImageSelect);
  elements.clearImageBtn.addEventListener('click', clearImage);

  todoService.load();
  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
