export interface BlockNoteDocument {
  type: string;
  props?: Record<string, unknown>;
  content?: Array<{
    type: string;
    text?: string;
    styles?: Record<string, boolean>;
  }>;
  children?: BlockNoteDocument[];
}

export interface Todo {
  id: number;
  content: BlockNoteDocument[];
  completed: boolean;
  image?: string;
}

export type TodoId = number;

export interface TodoService {
  getAll(): Todo[];
  add(text: string, image?: string): Todo;
  toggle(id: TodoId): Todo | undefined;
  delete(id: TodoId): boolean;
  load(): void;
  save(): void;
}

export interface UIRenderer {
  render(todos: Todo[]): void;
  showError(message: string): void;
}

export interface DOMElements {
  todoInput: HTMLInputElement;
  addBtn: HTMLButtonElement;
  todoList: HTMLUListElement;
  errorMessage: HTMLDivElement;
  imageInput: HTMLInputElement;
  imagePreview: HTMLDivElement;
  clearImageBtn: HTMLButtonElement;
}

export interface ImageService {
  validateFile(file: File): boolean;
  readFile(file: File): Promise<string>;
}
