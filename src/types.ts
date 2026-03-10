// Simplified Block type for BlockNote content
export interface Block {
  id?: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: Block[];
}

export interface Todo {
  id: number;
  content: Block[];
  completed: boolean;
  image?: string;
}

export type TodoId = number;

export interface TodoService {
  getAll(): Todo[];
  add(content: Block[], image?: string): Todo;
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
  editorContainer: HTMLDivElement;
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
