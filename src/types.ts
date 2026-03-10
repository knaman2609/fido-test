export interface BlockNoteBlock {
  type: string;
  props?: Record<string, unknown>;
  content?: Array<{
    type: string;
    text?: string;
    styles?: Array<{ type: string }>;
  }>;
  children?: BlockNoteBlock[];
}

export type BlockNoteJSON = BlockNoteBlock[];

export interface Todo {
  id: number;
  text?: string;
  content?: BlockNoteJSON;
  completed: boolean;
  image?: string;
}

export type TodoId = number;

export interface TodoService {
  getAll(): Todo[];
  add(content: BlockNoteJSON, image?: string): Todo;
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
  editorContainer: HTMLDivElement;
}

export interface ImageService {
  validateFile(file: File): boolean;
  readFile(file: File): Promise<string>;
}

export interface BlockNoteEditorProps {
  onSubmit: (content: BlockNoteJSON, image?: string) => void;
  onImageSelect?: (file: File) => Promise<string>;
}
