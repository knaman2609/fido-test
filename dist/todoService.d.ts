import type { Todo, TodoId, TodoService as ITodoService } from './types.js';
declare class TodoServiceImpl implements ITodoService {
    private todos;
    private idCounter;
    getAll(): Todo[];
    add(text: string): Todo;
    toggle(id: TodoId): Todo | undefined;
    delete(id: TodoId): boolean;
    load(): void;
    save(): void;
}
export declare const todoService: TodoServiceImpl;
export {};
