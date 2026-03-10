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
  // eslint-disable-next-line no-unused-vars
  add(content: BlockNoteDocument[], image?: string): Todo;
  // eslint-disable-next-line no-unused-vars
  toggle(id: TodoId): Todo | undefined;
  // eslint-disable-next-line no-unused-vars
  delete(id: TodoId): boolean;
  load(): void;
  save(): void;
}

export interface UIRenderer {
  // eslint-disable-next-line no-unused-vars
  render(todos: Todo[]): void;
  // eslint-disable-next-line no-unused-vars
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
  // eslint-disable-next-line no-unused-vars
  validateFile(file: File): boolean;
  // eslint-disable-next-line no-unused-vars
  readFile(file: File): Promise<string>;
}
