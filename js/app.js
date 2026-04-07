/**
 * Main Application
 */
const App = {
    init() {
        // Inicializar sesión y verificar si expiró
        const sessionStatus = Storage.initSession();
        
        if (sessionStatus.expired) {
            console.log('Sesión anterior expiró. Nueva sesión iniciada.');
            // Opcional: mostrar notificación al usuario
            this.showSessionNotification();
        }
        
        this.bindEvents();
        Background.init();
        Pomodoro.init();
        TodoList.init();
        Eisenhower.init();
        Kanban.init();
        
        // Mostrar tiempo restante de sesión
        this.updateSessionTimer();
    },

    bindEvents() {
        // Navegación por tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
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
        const last = Storage.getLastSection();
        this.showSection(last);
    },
    
    showSessionNotification() {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = 'session-notification';
        notification.textContent = '✨ Nueva sesión iniciada (12 horas)';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 0.9rem;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },
    
    updateSessionTimer() {
        // Actualizar cada minuto el tiempo de sesión
        setInterval(() => {
            const remaining = Storage.getSessionTimeRemaining();
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
            
            // Opcional: mostrar en consola o en UI
            if (remaining <= 0) {
                // Sesión expirada, reiniciar
                Storage.resetSession();
                this.showSessionNotification();
            }
        }, 60000); // Verificar cada minuto
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    App.restoreSection();
});

window.App = App;