
const FOCUS_DURATION = 60 * 60; 
const BREAK_DURATION = 20 * 60; 

let timerState = {
    isRunning: false,
    isPaused: false,
    currentMode: 'focus', 
    timeRemaining: FOCUS_DURATION,
    sessionsCompletedToday: 0,
    totalSessionsCompleted: 0,
    totalFocusTime: 0, 
    sessionHistory: [],
};

const DOM = {
    timerDisplay: document.getElementById('timerDisplay'),
    timerStatus: document.getElementById('timerStatus'),
    modeLabel: document.getElementById('modeLabel'),
    startBtn: document.getElementById('startBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    resetBtn: document.getElementById('resetBtn'),
    sessionsCount: document.getElementById('sessionsCount'),
    totalTime: document.getElementById('totalTime'),
    progressCircle: document.getElementById('progressCircle'),
};

let timerInterval = null;
let sessionStartTime = null;


function init() {
    loadFromLocalStorage();
    updateUI();
    attachEventListeners();
}

function loadFromLocalStorage() {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
        const parsed = JSON.parse(savedState);
        timerState = {
            ...timerState,
            sessionsCompletedToday: parsed.sessionsCompletedToday || 0,
            totalSessionsCompleted: parsed.totalSessionsCompleted || 0,
            totalFocusTime: parsed.totalFocusTime || 0,
            sessionHistory: parsed.sessionHistory || [],
        };
    }

   
    const lastDate = localStorage.getItem('lastSessionDate');
    const today = new Date().toDateString();
    if (lastDate !== today) {
        timerState.sessionsCompletedToday = 0;
        localStorage.setItem('lastSessionDate', today);
    }
}


function saveToLocalStorage() {
    localStorage.setItem('timerState', JSON.stringify({
        sessionsCompletedToday: timerState.sessionsCompletedToday,
        totalSessionsCompleted: timerState.totalSessionsCompleted,
        totalFocusTime: timerState.totalFocusTime,
        sessionHistory: timerState.sessionHistory,
    }));
}


function attachEventListeners() {
    DOM.startBtn.addEventListener('click', startTimer);
    DOM.pauseBtn.addEventListener('click', pauseTimer);
    DOM.resetBtn.addEventListener('click', resetTimer);
}


function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}


function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours === 0) {
        return `${mins}m`;
    }
    return `${hours}h ${mins}m`;
}

function updateUI() {
    DOM.timerDisplay.textContent = formatTime(timerState.timeRemaining);
    DOM.sessionsCount.textContent = timerState.sessionsCompletedToday;
    DOM.totalTime.textContent = formatDuration(timerState.totalFocusTime);
    DOM.modeLabel.textContent = timerState.currentMode === 'focus' ? 'Focus Time' : 'Break Time';
    DOM.modeLabel.className =
        timerState.currentMode === 'focus'
            ? 'mode-label focus'
            : 'mode-label break';

    
    updateProgressCircle();

 
    if (timerState.isRunning) {
        DOM.startBtn.disabled = true;
        DOM.pauseBtn.disabled = false;
        DOM.timerStatus.textContent = 'In progress...';
    } else if (timerState.isPaused) {
        DOM.startBtn.disabled = false;
        DOM.pauseBtn.disabled = true;
        DOM.timerStatus.textContent = 'Paused';
    } else {
        DOM.startBtn.disabled = false;
        DOM.pauseBtn.disabled = true;
        DOM.timerStatus.textContent = 'Ready to start';
    }

   
    if (timerState.currentMode === 'break') {
        DOM.progressCircle.classList.add('break');
    } else {
        DOM.progressCircle.classList.remove('break');
    }
}


function updateProgressCircle() {
    const totalDuration =
        timerState.currentMode === 'focus' ? FOCUS_DURATION : BREAK_DURATION;
    const progress = 1 - timerState.timeRemaining / totalDuration;
    const circumference = 2 * Math.PI * 140; 
    const offset = circumference * progress;
    DOM.progressCircle.style.strokeDashoffset = offset;
}

function startTimer() {
    if (timerState.isRunning) return;

    timerState.isRunning = true;
    timerState.isPaused = false;
    sessionStartTime = Date.now();

    timerInterval = setInterval(() => {
        timerState.timeRemaining--;

        if (timerState.timeRemaining <= 0) {
            clearInterval(timerInterval);
            handleSessionEnd();
        }

        updateUI();
    }, 1000);

    updateUI();
}


function pauseTimer() {
    if (!timerState.isRunning) return;

    clearInterval(timerInterval);
    timerState.isRunning = false;
    timerState.isPaused = true;
    updateUI();
}


function resetTimer() {
    clearInterval(timerInterval);
    timerState.isRunning = false;
    timerState.isPaused = false;
    timerState.currentMode = 'focus';
    timerState.timeRemaining = FOCUS_DURATION;
    sessionStartTime = null;
    updateUI();
}


function handleSessionEnd() {
    const isNowBreak = timerState.currentMode === 'focus';

    if (isNowBreak) {
        
        timerState.sessionsCompletedToday++;
        timerState.totalSessionsCompleted++;
        timerState.totalFocusTime += FOCUS_DURATION;

        const session = {
            date: new Date().toLocaleString(),
            mode: 'focus',
            duration: FOCUS_DURATION,
        };
        timerState.sessionHistory.push(session);

        saveToLocalStorage();

        
        playNotification('Focus session complete! Time for a break.');
        showBrowserNotification(
            'Focus Session Complete',
            'Great job! Take a 5-minute break.',
        );

    
        timerState.currentMode = 'break';
        timerState.timeRemaining = BREAK_DURATION;
    } else {
      
        playNotification('Break time over! Ready for another round?');
        showBrowserNotification(
            'Break Time Over',
            'Time to focus again!',
        );

        timerState.currentMode = 'focus';
        timerState.timeRemaining = FOCUS_DURATION;
    }

    timerState.isRunning = false;
    updateUI();
}


function playNotification(message) {
    
    const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

  
    console.log('[v0]', message);
}


function showBrowserNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%232563eb"/><text x="50" y="65" font-size="40" font-weight="bold" fill="white" text-anchor="middle">FM</text></svg>',
        });
    }
}


function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    requestNotificationPermission();
});
