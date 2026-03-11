import type { Todo, TodoId, TodoService as ITodoService, BlockNoteDocument } from './types.js';
import { isValidImageUrl } from './utils.js';
import { blocknoteService } from './blocknoteService.js';

const STORAGE_KEY = 'todos-v2';
const LEGACY_STORAGE_KEY = 'todos';

function isValidTodo(item: unknown): item is Todo {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const todo = item as Record<string, unknown>;

  const hasValidImage = todo.image === undefined || (typeof todo.image === 'string' && isValidImageUrl(todo.image));
  const hasValidContent = blocknoteService.isValidDocument(todo.content);

  return (
    typeof todo.id === 'number' &&
    hasValidContent &&
    typeof todo.completed === 'boolean' &&
    hasValidImage
  );
}

function migrateLegacyTodo(legacy: { id: number; text: string; completed: boolean; image?: string }): Todo {
  return {
    id: legacy.id,
    content: [
      {
        type: 'paragraph',
        content: legacy.text ? [{ type: 'text', text: legacy.text }] : []
      }
    ],
    completed: legacy.completed,
    image: legacy.image
  };
}

class TodoServiceImpl implements ITodoService {
  private todos: Todo[] = [];
  private idCounter: number = 1;

  getAll(): Todo[] {
    return [...this.todos];
  }

  add(content: BlockNoteDocument, image?: string): Todo {
    const todo: Todo = {
      id: this.idCounter++,
      content: content,
      completed: false,
      image: image
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
    } else {
      this.migrateFromLegacy();
    }
  }

  private migrateFromLegacy(): void {
    const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacyStored) return;

    try {
      const parsed: unknown = JSON.parse(legacyStored);
      if (!Array.isArray(parsed)) return;

      const legacyTodos = parsed.filter((item): item is { id: number; text: string; completed: boolean; image?: string } => {
        if (typeof item !== 'object' || item === null) return false;
        const t = item as Record<string, unknown>;
        return (
          typeof t.id === 'number' &&
          typeof t.text === 'string' &&
          typeof t.completed === 'boolean'
        );
      });

      if (legacyTodos.length > 0) {
        this.todos = legacyTodos.map(migrateLegacyTodo);
        const maxId = this.todos.reduce((max, todo) => Math.max(max, todo.id), 0);
        this.idCounter = maxId + 1;
        this.save();
      }
    } catch (e) {
      console.error('Failed to migrate legacy todos:', e);
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
