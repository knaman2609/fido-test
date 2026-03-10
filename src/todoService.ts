import type { Todo, TodoId, TodoService as ITodoService, BlockNoteJSON } from './types.js';
import { isValidImageUrl } from './utils.js';
import { migrateTodoTextToContent } from './blocknoteService.js';

const STORAGE_KEY = 'todos';

function isValidBlockNoteBlock(item: unknown): boolean {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const block = item as Record<string, unknown>;
  return typeof block.type === 'string';
}

function isValidBlockNoteJSON(content: unknown): content is BlockNoteJSON {
  if (!Array.isArray(content)) {
    return false;
  }
  return content.every(isValidBlockNoteBlock);
}

function isValidTodo(item: unknown): item is Todo {
  if (typeof item !== 'object' || item === null) {
    return false;
  }
  const todo = item as Record<string, unknown>;
  const hasValidImage = todo.image === undefined || (typeof todo.image === 'string' && isValidImageUrl(todo.image));
  const hasValidText = todo.text === undefined || typeof todo.text === 'string';
  const hasValidContent = todo.content === undefined || isValidBlockNoteJSON(todo.content);

  return (
    typeof todo.id === 'number' &&
    typeof todo.completed === 'boolean' &&
    hasValidImage &&
    hasValidText &&
    hasValidContent &&
    (todo.text !== undefined || todo.content !== undefined)
  );
}

class TodoServiceImpl implements ITodoService {
  private todos: Todo[] = [];
  private idCounter = 1;

  getAll(): Todo[] {
    return [...this.todos];
  }

  add(content: BlockNoteJSON, image?: string): Todo {
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

          const migratedTodos = validTodos.map(todo => {
            if (todo.text && !todo.content) {
              return {
                ...todo,
                content: migrateTodoTextToContent(todo.text),
                text: undefined
              };
            }
            return todo;
          });

          this.todos = migratedTodos;
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
      throw new Error('Storage may be full or disabled', { cause: e });
    }
  }
}

export const todoService = new TodoServiceImpl();
