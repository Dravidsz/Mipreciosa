/**
 * Main Application
 */
const App = {
    init() {
        this.bindEvents();
        Background.init();
        Pomodoro.init();
        TodoList.init();
        Eisenhower.init();
        Kanban.init();
    },

    bindEvents() {
        // Navegación por tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Botón cambiar fondo
        document.getElementById('change-bg-btn')?.addEventListener('click', () => {
            Background.nextImage();
        });
    },

    showSection(section) {
        // Actualizar tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.section === section);
        });

        // Actualizar secciones
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.toggle('active', sec.id === section);
        });

        // Guardar preferencia
        Storage.save('last_section', section);
    },

    restoreSection() {
        const last = Storage.get('last_section', 'pomodoro');
        this.showSection(last);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    App.restoreSection();
});

window.App = App;