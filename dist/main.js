import { todoService } from './todoService.js';
import { createUIRenderer } from './ui.js';
function getDOMElements() {
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');
    const todoList = document.getElementById('todoList');
    const errorMessage = document.getElementById('errorMessage');
    if (!todoInput || !addBtn || !todoList || !errorMessage) {
        throw new Error('Required DOM elements not found');
    }
    return {
        todoInput: todoInput,
        addBtn: addBtn,
        todoList: todoList,
        errorMessage: errorMessage
    };
}
function init() {
    const elements = getDOMElements();
    const ui = createUIRenderer(elements.todoList, elements.errorMessage);
    function render() {
        ui.render(todoService.getAll());
    }
    function addTodo() {
        const text = elements.todoInput.value.trim();
        if (!text)
            return;
        todoService.add(text);
        try {
            todoService.save();
        }
        catch (e) {
            ui.showError('Warning: Your todos cannot be saved. Storage may be full or disabled.');
        }
        render();
        elements.todoInput.value = '';
        elements.todoInput.focus();
    }
    function toggleTodo(id) {
        todoService.toggle(id);
        try {
            todoService.save();
        }
        catch (e) {
            ui.showError('Warning: Unable to save changes.');
        }
        render();
    }
    function deleteTodo(id) {
        todoService.delete(id);
        try {
            todoService.save();
        }
        catch (e) {
            ui.showError('Warning: Unable to save changes.');
        }
        render();
    }
    elements.todoList.addEventListener('click', (e) => {
        const target = e.target;
        const id = parseInt(target.getAttribute('data-id') || '', 10);
        const action = target.getAttribute('data-action');
        if (action === 'toggle') {
            toggleTodo(id);
        }
        else if (action === 'delete') {
            deleteTodo(id);
        }
    });
    elements.todoList.addEventListener('change', (e) => {
        const target = e.target;
        if (target.getAttribute('data-action') === 'toggle') {
            const id = parseInt(target.getAttribute('data-id') || '', 10);
            toggleTodo(id);
        }
    });
    elements.addBtn.addEventListener('click', addTodo);
    elements.todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter')
            addTodo();
    });
    todoService.load();
    render();
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
}
else {
    init();
}
