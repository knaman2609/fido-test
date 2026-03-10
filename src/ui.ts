import type { Todo, UIRenderer as IUIRenderer } from './types.js';

class UIRendererImpl implements IUIRenderer {
  private todoList: HTMLUListElement;
  private errorMessage: HTMLDivElement;

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
      li.appendChild(deleteBtn);
      fragment.appendChild(li);
    });
    this.todoList.appendChild(fragment);
  }

  showError(message: string): void {
    this.errorMessage.textContent = message;
    this.errorMessage.classList.add('visible');
    setTimeout(() => {
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
