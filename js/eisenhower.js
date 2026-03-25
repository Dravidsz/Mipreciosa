/**
 * Eisenhower Matrix
 */
const Eisenhower = {
    tasks: { do: [], schedule: [], delegate: [], eliminate: [] },
    draggedTaskId: null,
    sourceQuadrant: null,

    init() {
        this.loadTasks();
        this.bindEvents();
        this.render();
    },

    loadTasks() {
        this.tasks = Storage.getEisenhowerTasks();
    },

    bindEvents() {
        document.querySelectorAll('.matrix-quadrant').forEach(quadrant => {
            const input = quadrant.querySelector('.quadrant-input');
            const name = quadrant.dataset.quadrant;
            
            // Enter key
            input?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addTask(name, input.value);
                    input.value = '';
                }
            });
            
            // Click en input para agregar
            input?.addEventListener('input', (e) => {
                // Opcional: mostrar botón de agregar
            });
        });

        // Drag and drop
        document.querySelectorAll('.quadrant-tasks').forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });
            zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                const target = zone.dataset.quadrant;
                if (this.draggedTaskId && this.sourceQuadrant && target !== this.sourceQuadrant) {
                    this.moveTask(this.draggedTaskId, this.sourceQuadrant, target);
                }
            });
        });
    },

    addTask(quadrant, text) {
        text = text?.trim();
        if (!text) return;
        
        this.tasks[quadrant].push({
            id: Date.now().toString(),
            text,
            createdAt: new Date().toISOString()
        });
        
        this.saveTasks();
        this.renderQuadrant(quadrant);
    },

    deleteTask(quadrant, taskId) {
        this.tasks[quadrant] = this.tasks[quadrant].filter(t => t.id !== taskId);
        this.saveTasks();
        this.renderQuadrant(quadrant);
    },

    moveTask(taskId, from, to) {
        const idx = this.tasks[from]?.findIndex(t => t.id === taskId);
        if (idx === undefined || idx === -1) return;
        
        const [task] = this.tasks[from].splice(idx, 1);
        this.tasks[to].push(task);
        this.saveTasks();
        this.renderQuadrant(from);
        this.renderQuadrant(to);
    },

    saveTasks() {
        Storage.saveEisenhowerTasks(this.tasks);
    },

    render() {
        Object.keys(this.tasks).forEach(q => this.renderQuadrant(q));
    },

    renderQuadrant(quadrant) {
        const container = document.querySelector(`.quadrant-tasks[data-quadrant="${quadrant}"]`);
        if (!container) return;
        
        const tasks = this.tasks[quadrant] || [];
        
        if (tasks.length === 0) {
            container.innerHTML = '';
        } else {
            container.innerHTML = tasks.map(task => `
                <div class="quadrant-task" data-id="${task.id}" draggable="true">
                    <span>${this.escapeHtml(task.text)}</span>
                    <button class="quadrant-task-delete">×</button>
                </div>
            `).join('');
            
            container.querySelectorAll('.quadrant-task').forEach(el => {
                el.addEventListener('dragstart', () => {
                    this.draggedTaskId = el.dataset.id;
                    this.sourceQuadrant = quadrant;
                });
                el.addEventListener('dragend', () => {
                    this.draggedTaskId = null;
                    this.sourceQuadrant = null;
                });
            });
            
            container.querySelectorAll('.quadrant-task-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.closest('.quadrant-task').dataset.id;
                    this.deleteTask(quadrant, id);
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

document.addEventListener('DOMContentLoaded', () => Eisenhower.init());
window.Eisenhower = Eisenhower;