/**
 * Pomodoro Timer
 */
const Pomodoro = {
    state: {
        mode: 'work',
        timeRemaining: 25 * 60,
        totalTime: 25 * 60,
        isRunning: false,
        completedPomodoros: 0
    },
    settings: { workDuration: 25, shortBreak: 5, longBreak: 15 },
    timerInterval: null,
    audioContext: null,

    init() {
        this.cacheElements();
        this.loadSettings();
        this.loadStats();
        this.bindEvents();
        this.updateDisplay();
    },

    cacheElements() {
        this.elements = {
            minutes: document.getElementById('timer-minutes'),
            seconds: document.getElementById('timer-seconds'),
            progress: document.querySelector('.timer-progress'),
            startBtn: document.getElementById('timer-start'),
            pauseBtn: document.getElementById('timer-pause'),
            resetBtn: document.getElementById('timer-reset'),
            modeButtons: document.querySelectorAll('.mode-btn'),
            pomodoroCount: document.getElementById('pomodoro-count')
        };
    },

    loadSettings() {
        const saved = Storage.getPomodoroSettings();
        this.settings = { ...this.settings, ...saved };
        this.state.totalTime = this.settings.workDuration * 60;
        this.state.timeRemaining = this.state.totalTime;
    },

    loadStats() {
        const stats = Storage.getPomodoroStats();
        this.state.completedPomodoros = stats.completedPomodoros || 0;
        this.updatePomodoroCount();
    },

    bindEvents() {
        this.elements.startBtn?.addEventListener('click', () => this.start());
        this.elements.pauseBtn?.addEventListener('click', () => this.pause());
        this.elements.resetBtn?.addEventListener('click', () => this.reset());

        this.elements.modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.setMode(mode);
            });
        });
    },

    start() {
        if (this.state.isRunning) return;
        if (this.audioContext?.state === 'suspended') this.audioContext.resume();
        
        this.state.isRunning = true;
        this.elements.startBtn.disabled = true;
        this.elements.pauseBtn.disabled = false;
        
        this.timerInterval = setInterval(() => this.tick(), 1000);
    },

    pause() {
        if (!this.state.isRunning) return;
        this.state.isRunning = false;
        clearInterval(this.timerInterval);
        this.elements.startBtn.disabled = false;
        this.elements.pauseBtn.disabled = true;
    },

    reset() {
        this.pause();
        const duration = this.getDurationForMode(this.state.mode);
        this.state.totalTime = duration * 60;
        this.state.timeRemaining = this.state.totalTime;
        this.updateDisplay();
    },

    tick() {
        this.state.timeRemaining--;
        if (this.state.timeRemaining <= 0) {
            this.complete();
        } else {
            this.updateDisplay();
        }
    },

    complete() {
        this.pause();
        this.playSound();
        
        if (this.state.mode === 'work') {
            this.state.completedPomodoros++;
            this.updatePomodoroCount();
            this.saveStats();
            this.setMode(this.state.completedPomodoros % 4 === 0 ? 'longBreak' : 'shortBreak');
        } else {
            this.setMode('work');
        }
    },

    playSound() {
        try {
            if (!this.audioContext) this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.frequency.value = 800;
            gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.3);
        } catch (e) {}
    },

    setMode(mode) {
        this.state.mode = mode;
        this.elements.modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        this.reset();
    },

    getDurationForMode(mode) {
        return mode === 'shortBreak' ? this.settings.shortBreak : 
               mode === 'longBreak' ? this.settings.longBreak : this.settings.workDuration;
    },

    updateDisplay() {
        const m = Math.floor(this.state.timeRemaining / 60);
        const s = this.state.timeRemaining % 60;
        if (this.elements.minutes) this.elements.minutes.textContent = m.toString().padStart(2, '0');
        if (this.elements.seconds) this.elements.seconds.textContent = s.toString().padStart(2, '0');
        
        const progress = this.elements.progress;
        if (progress) {
            const circumference = 2 * Math.PI * 45;
            progress.style.strokeDasharray = circumference;
            progress.style.strokeDashoffset = circumference * (1 - this.state.timeRemaining / this.state.totalTime);
        }
        
        document.title = `${m}:${s.toString().padStart(2, '0')} - Mi Preciosa`;
    },

    updatePomodoroCount() {
        if (this.elements.pomodoroCount) {
            this.elements.pomodoroCount.textContent = this.state.completedPomodoros;
        }
    },

    saveStats() {
        Storage.savePomodoroStats({ completedPomodoros: this.state.completedPomodoros });
    }
};

document.addEventListener('DOMContentLoaded', () => Pomodoro.init());
window.Pomodoro = Pomodoro;