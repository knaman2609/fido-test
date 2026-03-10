import { todoService } from './todoService.js';
import { imageService } from './imageService.js';
import { createUIRenderer } from './ui.js';
import type { DOMElements } from './types.js';

function getDOMElements(): DOMElements {
  const todoInput = document.getElementById('todoInput');
  const addBtn = document.getElementById('addBtn');
  const todoList = document.getElementById('todoList');
  const errorMessage = document.getElementById('errorMessage');
  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');
  const clearImageBtn = document.getElementById('clearImageBtn');

  if (!todoInput || !addBtn || !todoList || !errorMessage || !imageInput || !imagePreview || !clearImageBtn) {
    throw new Error('Required DOM elements not found');
  }

  return {
    todoInput: todoInput as HTMLInputElement,
    addBtn: addBtn as HTMLButtonElement,
    todoList: todoList as HTMLUListElement,
    errorMessage: errorMessage as HTMLDivElement,
    imageInput: imageInput as HTMLInputElement,
    imagePreview: imagePreview as HTMLDivElement,
    clearImageBtn: clearImageBtn as HTMLButtonElement
  };
}

function init(): void {
  const elements = getDOMElements();
  const ui = createUIRenderer(elements.todoList, elements.errorMessage);
  let currentImage: string | null = null;

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
    elements.clearImageBtn.style.display = 'none';
  }

  async function handleImageSelect(e: Event): void {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    if (!imageService.validateFile(file)) {
      ui.showError('Please select a valid image file (max 2MB)');
      clearImage();
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
      elements.clearImageBtn.style.display = 'block';
    } catch (error) {
      ui.showError('Failed to read image file');
      clearImage();
    }
  }

  function addTodo(): void {
    const text = elements.todoInput.value.trim();
    if (!text) return;

    todoService.add(text, currentImage || undefined);
    handleSave('Warning: Your todos cannot be saved. Storage may be full or disabled.');
    render();
    elements.todoInput.value = '';
    clearImage();
    elements.todoInput.focus();
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
  elements.todoInput.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') addTodo();
  });
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
