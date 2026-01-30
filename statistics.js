function loadStatistics() {
    const savedState = localStorage.getItem('timerState');
    if (!savedState) {
        return {
            totalSessions: 0,
            totalFocusTime: 0,
            sessionsToday: 0,
            sessionHistory: [],
            streakDays: 0,
        };
    }

    const state = JSON.parse(savedState);
    const streakDays = calculateStreak();

    return {
        totalSessions: state.totalSessionsCompleted || 0,
        totalFocusTime: state.totalFocusTime || 0,
        sessionsToday: state.sessionsCompletedToday || 0,
        sessionHistory: state.sessionHistory || [],
        streakDays: streakDays,
    };
}


function calculateStreak() {
    const savedState = localStorage.getItem('timerState');
    if (!savedState) return 0;

    const state = JSON.parse(savedState);
    const sessionHistory = state.sessionHistory || [];

    if (sessionHistory.length === 0) return 0;


    const sessionDates = new Set();
    sessionHistory.forEach((session) => {
        const date = new Date(session.date).toDateString();
        sessionDates.add(date);
    });


    const sortedDates = Array.from(sessionDates)
        .map((dateStr) => new Date(dateStr))
        .sort((a, b) => b - a);

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
        const currentDate = new Date(sortedDates[i]);
        currentDate.setHours(0, 0, 0, 0);

        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);

        if (currentDate.getTime() === expectedDate.getTime()) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}


function formatHours(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
}


function formatTimeDetailed(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (mins > 0) result += `${mins}m `;
    if (secs > 0 || result === '') result += `${secs}s`;

    return result.trim();
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateObj = new Date(date.toDateString());
    const todayObj = new Date(today.toDateString());
    const yesterdayObj = new Date(yesterday.toDateString());

    if (dateObj.getTime() === todayObj.getTime()) {
        return 'Today';
    } else if (dateObj.getTime() === yesterdayObj.getTime()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
        });
    }
}


function renderSessionHistory(sessions) {
    const sessionList = document.getElementById('sessionList');

    if (!sessions || sessions.length === 0) {
        sessionList.innerHTML =
            '<p class="empty-state">No sessions recorded yet. Start your first session!</p>';
        return;
    }


    const sessionsByDate = {};
    sessions.forEach((session) => {
        const dateKey = new Date(session.date).toDateString();
        if (!sessionsByDate[dateKey]) {
            sessionsByDate[dateKey] = [];
        }
        sessionsByDate[dateKey].push(session);
    });

    let html = '';
    const sortedDates = Object.keys(sessionsByDate).sort(
        (a, b) => new Date(b) - new Date(a),
    );

    sortedDates.forEach((dateKey) => {
        const daySessions = sessionsByDate[dateKey];
        const totalDayTime = daySessions.reduce(
            (sum, session) => sum + session.duration,
            0,
        );

        daySessions.forEach((session) => {
            const duration = formatTimeDetailed(session.duration);
            const modeLabel =
                session.mode === 'focus' ? '🎯 Focus' : '☕ Break';

            html += `
                <div class="session-item">
                    <div class="session-item-content">
                        <h4>${modeLabel}</h4>
                        <p>${formatDate(session.date)} · ${new Date(session.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                    </div>
                    <div class="session-item-time">${duration}</div>
                </div>
            `;
        });
    });

    sessionList.innerHTML = html;
}


function updateStatisticsUI() {
    const stats = loadStatistics();

    document.getElementById('totalSessions').textContent = stats.totalSessions;
    document.getElementById('totalFocusTime').textContent = formatHours(
        stats.totalFocusTime,
    );
    document.getElementById('todaySessions').textContent = stats.sessionsToday;
    document.getElementById('streakDays').textContent = stats.streakDays;

    renderSessionHistory(stats.sessionHistory);
}

function clearAllData() {
    if (
        confirm(
            'Are you sure you want to delete all your data? This cannot be undone.',
        )
    ) {
        localStorage.removeItem('timerState');
        localStorage.removeItem('lastSessionDate');
        updateStatisticsUI();
        alert('All data has been cleared.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateStatisticsUI();

    const clearDataBtn = document.getElementById('clearDataBtn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearAllData);
    }

    setInterval(updateStatisticsUI, 1000);
});