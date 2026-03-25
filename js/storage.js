/**
 * Storage Module
 */
const Storage = {
    PREFIX: 'mipreciosa_',

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

    getTodos() {
        return this.get('todos', []);
    },

    saveTodos(todos) {
        return this.save('todos', todos);
    },

    getEisenhowerTasks() {
        return this.get('eisenhower_tasks', { do: [], schedule: [], delegate: [], eliminate: [] });
    },

    saveEisenhowerTasks(tasks) {
        return this.save('eisenhower_tasks', tasks);
    },

    getKanbanTasks() {
        return this.get('kanban_tasks', { todo: [], inprogress: [], done: [] });
    },

    saveKanbanTasks(tasks) {
        return this.save('kanban_tasks', tasks);
    },

    getBackgroundPrefs() {
        return this.get('background_prefs', { currentIndex: 0 });
    },

    saveBackgroundPrefs(prefs) {
        return this.save('background_prefs', prefs);
    },

    save(key, value) {
        return this.save(key, value);
    },

    getLastSection() {
        return this.get('last_section', 'pomodoro');
    }
};

window.Storage = Storage;