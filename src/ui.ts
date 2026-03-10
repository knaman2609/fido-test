import type { Todo, UIRenderer as IUIRenderer } from './types.js';
import { isValidImageUrl } from './utils.js';

class UIRendererImpl implements IUIRenderer {
  private todoList: HTMLUListElement;
  private errorMessage: HTMLDivElement;
  private errorTimeoutId: number | null = null;

  constructor(todoList: HTMLUListElement, errorMessage: HTMLDivElement) {
    this.todoList = todoList;
    this.errorMessage = errorMessage;
  }

  render(todos: Todo[]): void {
    this.todoList.innerHTML = '';

    if (todos.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'empty-state';
      emptyLi.textContent = 'No todos yet. Add one above!';
      this.todoList.appendChild(emptyLi);
      return;
    }

    const fragment = document.createDocumentFragment();
    todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (todo.completed ? ' completed' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = todo.completed;
      checkbox.setAttribute('aria-label', `Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`);
      checkbox.setAttribute('data-id', todo.id.toString());
      checkbox.setAttribute('data-action', 'toggle');

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.text;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Delete';
      deleteBtn.setAttribute('aria-label', `Delete "${todo.text}"`);
      deleteBtn.setAttribute('data-id', todo.id.toString());
      deleteBtn.setAttribute('data-action', 'delete');

      li.appendChild(checkbox);
      li.appendChild(span);

      function openImage(): void {
        if (todo.image && isValidImageUrl(todo.image)) {
          const newWindow = window.open(todo.image, '_blank');
          if (newWindow) newWindow.opener = null;
        }
      }

      if (todo.image) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'todo-image-container';
        const img = document.createElement('img');
        img.className = 'todo-image';
        img.src = todo.image;
        img.alt = 'Todo attachment';
        img.role = 'button';
        img.tabIndex = 0;
        img.addEventListener('click', openImage);
        img.addEventListener('keydown', (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openImage();
          }
        });
        imgContainer.appendChild(img);
        li.appendChild(imgContainer);
      }

      li.appendChild(deleteBtn);
      fragment.appendChild(li);
    });
    this.todoList.appendChild(fragment);
  }

  showError(message: string): void {
    if (this.errorTimeoutId !== null) {
      clearTimeout(this.errorTimeoutId);
    }
    this.errorMessage.textContent = message;
    this.errorMessage.classList.add('visible');
    this.errorTimeoutId = window.setTimeout(() => {
      this.errorMessage.classList.remove('visible');
    }, 5000);
  }
}

export function createUIRenderer(
  todoList: HTMLUListElement,
  errorMessage: HTMLDivElement
): IUIRenderer {
  return new UIRendererImpl(todoList, errorMessage);
}
