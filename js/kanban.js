/**
 * Kanban Board
 */
const Kanban = {
    tasks: { todo: [], inprogress: [], done: [] },
    WIP_LIMIT: 3,
    draggedTaskId: null,
    sourceColumn: null,

    init() {
        this.loadTasks();
        this.bindEvents();
        this.render();
    },

    loadTasks() {
        this.tasks = Storage.getKanbanTasks();
    },

    bindEvents() {
        document.querySelectorAll('.kanban-column').forEach(column => {
            const input = column.querySelector('.kanban-task-input');
            const name = column.dataset.column || 'todo';
            
            input?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addTask('todo', input.value);
                    input.value = '';
                }
            });
        });

        document.querySelectorAll('.column-tasks').forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });
            zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                const target = zone.dataset.column;
                if (target === 'inprogress' && this.tasks.inprogress.length >= this.WIP_LIMIT && this.sourceColumn !== 'inprogress' && !this.tasks[target].find(t => t.id === this.draggedTaskId)) {
                    return;
                }
                if (this.draggedTaskId && this.sourceColumn) {
                    this.moveTask(this.draggedTaskId, this.sourceColumn, target);
                }
            });
        });
    },

    addTask(column, text) {
        text = text?.trim();
        if (!text || column !== 'todo') return;
        
        if (column === 'inprogress' && this.tasks.inprogress.length >= this.WIP_LIMIT) return;
        
        this.tasks[column].push({
            id: Date.now().toString(),
            text,
            createdAt: new Date().toISOString()
        });
        
        this.saveTasks();
        this.renderColumn(column);
    },

    deleteTask(column, taskId) {
        this.tasks[column] = this.tasks[column].filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderColumn(column);
    },

    moveTask(taskId, from, to) {
        const idx = this.tasks[from]?.findIndex(t => t.id === taskId);
        if (idx === undefined || idx === -1) return;
        
        const [task] = this.tasks[from].splice(idx, 1);
        if (to === 'done') task.completedAt = new Date().toISOString();
        
        this.tasks[to].push(task);
        this.saveTasks();
        this.renderColumn(from);
        this.renderColumn(to);
    },

    saveTasks() {
        Storage.saveKanbanTasks(this.tasks);
    },

    render() {
        Object.keys(this.tasks).forEach(c => this.renderColumn(c));
    },

    renderColumn(column) {
        const container = document.querySelector(`.column-tasks[data-column="${column}"]`);
        const countEl = document.getElementById(`${column}-column-count`);
        
        if (!container) return;
        
        const tasks = this.tasks[column] || [];
        
        if (countEl) countEl.textContent = tasks.length;
        
        if (tasks.length === 0) {
            container.innerHTML = '';
        } else {
            container.innerHTML = tasks.map(task => `
                <div class="kanban-task" data-id="${task.id}" draggable="true">
                    <div class="kanban-task-content">
                        <span>${this.escapeHtml(task.text)}</span>
                        <button class="kanban-task-delete">×</button>
                    </div>
                </div>
            `).join('');
            
            container.querySelectorAll('.kanban-task').forEach(el => {
                el.addEventListener('dragstart', () => {
                    this.draggedTaskId = el.dataset.id;
                    this.sourceColumn = column;
                });
                el.addEventListener('dragend', () => {
                    this.draggedTaskId = null;
                    this.sourceColumn = null;
                });
            });
            
            container.querySelectorAll('.kanban-task-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('.kanban-task').dataset.id;
                    this.deleteTask(column, id);
                });
            });
        }
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

document.addEventListener('DOMContentLoaded', () => Kanban.init());
window.Kanban = Kanban;