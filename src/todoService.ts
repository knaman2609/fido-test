import type { Todo, TodoId, TodoService as ITodoService } from './types.js';

const STORAGE_KEY = 'todos';

function isValidTodo(item: unknown): item is Todo {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const todo = item as Record<string, unknown>;
  return (
    typeof todo.id === 'number' &&
    typeof todo.text === 'string' &&
    typeof todo.completed === 'boolean'
  );
}

class TodoServiceImpl implements ITodoService {
  private todos: Todo[] = [];
  private idCounter: number = 1;

  getAll(): Todo[] {
    return this.todos;
  }

  add(text: string): Todo {
    const todo: Todo = {
      id: this.idCounter++,
      text: text,
      completed: false
    };
    this.todos.push(todo);
    return todo;
  }

  toggle(id: TodoId): Todo | undefined {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
    return todo;
  }

  delete(id: TodoId): boolean {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter(t => t.id !== id);
    return this.todos.length !== initialLength;
  }

  load(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const validTodos = parsed.filter(isValidTodo);
          this.todos = validTodos;
          const maxId = this.todos.reduce((max, todo) => Math.max(max, todo.id), 0);
          this.idCounter = maxId + 1;
        }
      } catch (e) {
        console.error('Failed to parse todos from localStorage:', e);
        this.todos = [];
      }
    }
  }

  save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
    } catch (e) {
      console.error('Failed to save todos to localStorage:', e);
      throw new Error('Storage may be full or disabled');
    }
  }
}

export const todoService = new TodoServiceImpl();
