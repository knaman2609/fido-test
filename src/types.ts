export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  image?: string;
}

export type TodoId = number;

export interface TodoService {
  getAll(): Todo[];
  add(text: string): Todo;
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
}
