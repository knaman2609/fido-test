import { todoService } from './todoService.js';
import { createUIRenderer } from './ui.js';
import type { DOMElements } from './types.js';

function getDOMElements(): DOMElements {
  const todoInput = document.getElementById('todoInput');
  const addBtn = document.getElementById('addBtn');
  const todoList = document.getElementById('todoList');
  const errorMessage = document.getElementById('errorMessage');

  if (!todoInput || !addBtn || !todoList || !errorMessage) {
    throw new Error('Required DOM elements not found');
  }

  return {
    todoInput: todoInput as HTMLInputElement,
    addBtn: addBtn as HTMLButtonElement,
    todoList: todoList as HTMLUListElement,
    errorMessage: errorMessage as HTMLDivElement
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
    } catch (e) {
      ui.showError(errorMessage);
    }
  }

  function addTodo(): void {
    const text = elements.todoInput.value.trim();
    if (!text) return;

    todoService.add(text);
    handleSave('Warning: Your todos cannot be saved. Storage may be full or disabled.');
    render();
    elements.todoInput.value = '';
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
    const id = parseInt(target.getAttribute('data-id') || '', 10);
    const action = target.getAttribute('data-action');

    if (action === 'toggle') {
      toggleTodo(id);
    } else if (action === 'delete') {
      deleteTodo(id);
    }
  });

  elements.todoList.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.getAttribute('data-action') === 'toggle') {
      const id = parseInt(target.getAttribute('data-id') || '', 10);
      toggleTodo(id);
    }
  });

  elements.addBtn.addEventListener('click', addTodo);
  elements.todoInput.addEventListener('keypress', (e: KeyboardEvent) => {
    if (e.key === 'Enter') addTodo();
  });

  todoService.load();
  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
