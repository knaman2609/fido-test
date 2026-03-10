const STORAGE_KEY = 'todos';
class TodoServiceImpl {
    constructor() {
        this.todos = [];
        this.idCounter = 1;
    }
    getAll() {
        return this.todos;
    }
    add(text) {
        const todo = {
            id: this.idCounter++,
            text: text,
            completed: false
        };
        this.todos.push(todo);
        return todo;
    }
    toggle(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
        }
        return todo;
    }
    delete(id) {
        const initialLength = this.todos.length;
        this.todos = this.todos.filter(t => t.id !== id);
        return this.todos.length !== initialLength;
    }
    load() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    this.todos = parsed;
                    const maxId = this.todos.reduce((max, todo) => Math.max(max, todo.id), 0);
                    this.idCounter = maxId + 1;
                }
            }
            catch (e) {
                console.error('Failed to parse todos from localStorage:', e);
                this.todos = [];
            }
        }
    }
    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
        }
        catch (e) {
            console.error('Failed to save todos to localStorage:', e);
            throw new Error('Storage may be full or disabled');
        }
    }
}
export const todoService = new TodoServiceImpl();
