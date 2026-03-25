/**
 * Todo List
 */
const TodoList = {
    todos: [],

    init() {
        this.elements = {
            input: document.getElementById('todo-input'),
            addBtn: document.getElementById('add-todo'),
            list: document.getElementById('todo-list'),
            count: document.getElementById('todo-count'),
            clearBtn: document.getElementById('clear-completed')
        };
        this.loadTodos();
        this.bindEvents();
        this.render();
    },

    loadTodos() {
        this.todos = Storage.getTodos();
    },

    bindEvents() {
        this.elements.addBtn?.addEventListener('click', () => this.addTodo());
        
        this.elements.input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        
        this.elements.clearBtn?.addEventListener('click', () => this.clearCompleted());
        
        // Usar event delegation en el contenedor de la lista
        this.elements.list?.addEventListener('click', (e) => {
            const item = e.target.closest('.todo-item');
            if (!item) return;
            
            const id = item.dataset.id;
            
            // Verificar si hizo clic en el checkbox
            if (e.target.classList.contains('todo-checkbox') || 
                e.target.closest('.todo-checkbox')) {
                this.toggleTodo(id);
                return;
            }
            
            // Verificar si hizo clic en eliminar
            if (e.target.classList.contains('todo-delete') || 
                e.target.closest('.todo-delete')) {
                this.deleteTodo(id);
                return;
            }
        });
    },

    addTodo() {
        const text = this.elements.input?.value.trim();
        if (!text) return;
        
        this.todos.unshift({
            id: Date.now().toString(),
            text,
            completed: false,
            createdAt: new Date().toISOString()
        });
        
        this.saveTodos();
        this.render();
        if (this.elements.input) this.elements.input.value = '';
    },

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    },

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    },

    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.render();
    },

    saveTodos() {
        Storage.saveTodos(this.todos);
    },

    render() {
        if (!this.elements.list) return;
        
        if (this.todos.length === 0) {
            this.elements.list.innerHTML = '<li class="empty">Sin tareas</li>';
        } else {
            this.elements.list.innerHTML = this.todos.map(todo => `
                <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                    <div class="todo-checkbox"></div>
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <button class="todo-delete">×</button>
                </li>
            `).join('');
        }
        
        const pending = this.todos.filter(t => !t.completed).length;
        if (this.elements.count) {
            this.elements.count.textContent = `${pending} tarea${pending !== 1 ? 's' : ''}`;
        }
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

document.addEventListener('DOMContentLoaded', () => TodoList.init());
window.TodoList = TodoList;