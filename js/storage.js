/**
 * Storage Module - Con soporte de sesión de 12 horas
 */
const Storage = {
    PREFIX: 'mipreciosa_',
    SESSION_DURATION: 12 * 60 * 60 * 1000, // 12 horas en milisegundos

    save(key, data) {
        try {
            localStorage.setItem(this.PREFIX + key, JSON.stringify(data));
            return true;
        } catch (e) {
            return false;
        }
    },

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.PREFIX + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    // ===== Control de Sesión =====

    initSession() {
        const session = this.getSession();
        const now = Date.now();
        
        if (!session || !session.startTime) {
            // No hay sesión, crear una nueva
            this.startNewSession();
            return { isNew: true, expired: false };
        }
        
        // Verificar si la sesión expiró
        const elapsed = now - session.startTime;
        if (elapsed > this.SESSION_DURATION) {
            // Sesión expirada, limpiar todo y crear nueva
            this.clearAllData();
            this.startNewSession();
            return { isNew: true, expired: true, previousSession: session };
        }
        
        // Sesión válida
        return { isNew: false, expired: false, session: session };
    },

    startNewSession() {
        const session = {
            startTime: Date.now(),
            createdAt: new Date().toISOString()
        };
        this.save('session', session);
        return session;
    },

    getSession() {
        return this.get('session', null);
    },

    getSessionElapsed() {
        const session = this.getSession();
        if (!session || !session.startTime) return 0;
        return Date.now() - session.startTime;
    },

    getSessionTimeRemaining() {
        const elapsed = this.getSessionElapsed();
        return Math.max(0, this.SESSION_DURATION - elapsed);
    },

    clearAllData() {
        this.save('pomodoro_stats', { completedPomodoros: 0 });
        this.save('pomodoro_settings', { workDuration: 25, shortBreak: 5, longBreak: 15 });
        this.save('todos', []);
        this.save('eisenhower_tasks', { do: [], schedule: [], delegate: [], eliminate: [] });
        this.save('kanban_tasks', { todo: [], inprogress: [], done: [] });
    },

    resetSession() {
        this.clearAllData();
        this.startNewSession();
    },

    // ===== Datos de Pomodoro =====

    getPomodoroSettings() {
        return this.get('pomodoro_settings', { workDuration: 25, shortBreak: 5, longBreak: 15 });
    },

    savePomodoroSettings(settings) {
        return this.save('pomodoro_settings', settings);
    },

    getPomodoroStats() {
        return this.get('pomodoro_stats', { completedPomodoros: 0 });
    },

    savePomodoroStats(stats) {
        return this.save('pomodoro_stats', stats);
    },

    // ===== Datos de Tareas =====

    getTodos() {
        return this.get('todos', []);
    },

    saveTodos(todos) {
        return this.save('todos', todos);
    },

    // ===== Datos de Eisenhower =====

    getEisenhowerTasks() {
        return this.get('eisenhower_tasks', { do: [], schedule: [], delegate: [], eliminate: [] });
    },

    saveEisenhowerTasks(tasks) {
        return this.save('eisenhower_tasks', tasks);
    },

    // ===== Datos de Kanban =====

    getKanbanTasks() {
        return this.get('kanban_tasks', { todo: [], inprogress: [], done: [] });
    },

    saveKanbanTasks(tasks) {
        return this.save('kanban_tasks', tasks);
    },

    // ===== Preferencias =====

    getBackgroundPrefs() {
        return this.get('background_prefs', { currentIndex: 0 });
    },

    saveBackgroundPrefs(prefs) {
        return this.save('background_prefs', prefs);
    },

    getLastSection() {
        return this.get('last_section', 'pomodoro');
    }
};

window.Storage = Storage;