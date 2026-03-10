import type { Todo, TodoId, TodoService as ITodoService, Block } from './types.js';
import { isValidImageUrl } from './utils.js';
import { blockNoteService } from './blockNoteService.js';

const STORAGE_KEY = 'todos';

interface LegacyTodo {
  id: number;
  text?: string;
  content?: Block[];
  completed: boolean;
  image?: string;
}

function isValidTodo(item: unknown): item is Todo {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const todo = item as LegacyTodo;
  const hasValidImage = todo.image === undefined || (typeof todo.image === 'string' && isValidImageUrl(todo.image));
  const hasValidContent = Array.isArray(todo.content) || typeof todo.text === 'string';
  return (
    typeof todo.id === 'number' &&
    typeof todo.completed === 'boolean' &&
    hasValidContent &&
    hasValidImage
  );
}

function migrateLegacyTodo(todo: LegacyTodo): Todo {
  if (todo.content && Array.isArray(todo.content)) {
    return todo as Todo;
  }
  // Migrate legacy todo with 'text' field to new 'content' format
  return {
    id: todo.id,
    content: blockNoteService.createSingleParagraphBlock(todo.text || ''),
    completed: todo.completed,
    image: todo.image,
  };
}

class TodoServiceImpl implements ITodoService {
  private todos: Todo[] = [];
  private idCounter: number = 1;

  getAll(): Todo[] {
    return [...this.todos];
  }

  add(content: Block[], image?: string): Todo {
    const todo: Todo = {
      id: this.idCounter++,
      content: content,
      completed: false,
      image: image,
    };
    this.todos.push(todo);
    return todo;
  }

  toggle(id: TodoId): Todo | undefined {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
    return todo;
  }

  delete(id: TodoId): boolean {
    const initialLength = this.todos.length;
    this.todos = this.todos.filter((t) => t.id !== id);
    return this.todos.length !== initialLength;
  }

  load(): void {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const validTodos = parsed.filter(isValidTodo);
          this.todos = validTodos.map(migrateLegacyTodo);
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
