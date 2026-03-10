export type BlockNoteDocument = Record<string, unknown>;

export interface Todo {
  id: number;
  content: BlockNoteDocument[];
  completed: boolean;
  image?: string;
}

export type TodoId = number;

export interface TodoService {
  getAll(): Todo[];
  add(content: BlockNoteDocument[], image?: string): Todo;
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
