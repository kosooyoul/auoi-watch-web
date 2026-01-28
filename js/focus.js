/**
 * Focus Mode System
 * Feature: Focus Mode + Session Tracking + Stats
 * Research: Athenify, Lofizen, Habitica all have this
 * Revenue: +$2.99 premium feature (Focus Stats)
 */

// Focus mode state
let focusModeActive = false;
let currentSession = null;
let sessionInterval = null;

// DOM elements
let focusBtn;
let focusSessionInfo;
let focusTimer;
let focusLabel;

/**
 * Initialize focus mode system
 */
function initFocusMode() {
    // Get DOM elements
    focusBtn = document.getElementById('focusBtn');
    focusSessionInfo = document.getElementById('focusSessionInfo');
    focusTimer = document.getElementById('focusTimer');
    focusLabel = document.getElementById('focusLabel');

    if (!focusBtn) {
        console.error('Focus button not found');
        return;
    }

    // Focus button click handler
    focusBtn.addEventListener('click', toggleFocusMode);

    // Listen for ESC key to exit focus mode
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && focusModeActive) {
            exitFocusMode();
        }
    });

    // Listen for fullscreen changes (if user exits fullscreen manually)
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement && focusModeActive) {
            exitFocusMode();
        }
    });

    console.log('✅ Focus mode system initialized');
}

/**
 * Toggle focus mode on/off
 */
function toggleFocusMode() {
    if (focusModeActive) {
        exitFocusMode();
    } else {
        enterFocusMode();
    }
}

/**
 * Enter focus mode
 */
function enterFocusMode() {
    // Start fullscreen
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
            console.error('Fullscreen request failed:', err);
            // Continue without fullscreen
        });
    }

    // Hide all UI buttons
    hideUIButtons();

    // Start focus session
    startFocusSession();

    // Update state
    focusModeActive = true;
    focusBtn.classList.add('active');

    // Show session info
    if (focusSessionInfo) {
        focusSessionInfo.style.display = 'block';
    }

    console.log('🎯 Focus mode activated');
}

/**
 * Exit focus mode
 */
function exitFocusMode() {
    // Exit fullscreen
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
            console.error('Exit fullscreen failed:', err);
        });
    }

    // Show UI buttons
    showUIButtons();

    // End focus session
    endFocusSession();

    // Update state
    focusModeActive = false;
    focusBtn.classList.remove('active');

    // Hide session info
    if (focusSessionInfo) {
        focusSessionInfo.style.display = 'none';
    }

    console.log('⏸️ Focus mode deactivated');
}

/**
 * Hide all UI buttons except focus button
 */
function hideUIButtons() {
    const buttons = [
        'fullscreenBtn',
        'alarmBtn',
        'worldClockBtn',
        'stopwatchBtn',
        'settingsBtn'
    ];

    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';
        }
    });

    // Hide greeting (optional - less distraction)
    const greetingContainer = document.getElementById('greetingContainer');
    if (greetingContainer) {
        greetingContainer.style.opacity = '0.3';
    }
}

/**
 * Show all UI buttons
 */
function showUIButtons() {
    const buttons = [
        'fullscreenBtn',
        'alarmBtn',
        'worldClockBtn',
        'stopwatchBtn',
        'settingsBtn'
    ];

    buttons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.style.opacity = '';
            btn.style.pointerEvents = '';
        }
    });

    // Show greeting
    const greetingContainer = document.getElementById('greetingContainer');
    if (greetingContainer) {
        greetingContainer.style.opacity = '';
    }
}

/**
 * Start a focus session
 */
function startFocusSession() {
    currentSession = {
        startTime: Date.now(),
        endTime: null,
        duration: 0
    };

    // Update timer every second
    sessionInterval = setInterval(updateSessionTimer, 1000);

    console.log('▶️ Focus session started');
}

/**
 * End current focus session
 */
function endFocusSession() {
    if (!currentSession) {
        return;
    }

    // Stop timer
    if (sessionInterval) {
        clearInterval(sessionInterval);
        sessionInterval = null;
    }

    // Calculate duration
    currentSession.endTime = Date.now();
    currentSession.duration = currentSession.endTime - currentSession.startTime;

    // Save session (only if > 1 minute to avoid accidental clicks)
    if (currentSession.duration > 60000) {
        saveFocusSession(currentSession);
        console.log('💾 Focus session saved:', formatDuration(currentSession.duration));
    } else {
        console.log('⏭️ Session too short, not saved');
    }

    currentSession = null;
}

/**
 * Update session timer display
 */
function updateSessionTimer() {
    if (!currentSession || !focusTimer) {
        return;
    }

    const elapsed = Date.now() - currentSession.startTime;
    focusTimer.textContent = formatDuration(elapsed);
}

/**
 * Format duration in milliseconds to HH:MM or MM:SS
 */
function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

/**
 * Save focus session to localStorage
 */
function saveFocusSession(session) {
    try {
        const sessions = loadFocusSessions();
        sessions.push(session);
        saveToStorage('FocusSessions', sessions);

        // Track focus session for theme recommendations
        if (typeof trackFocusSession === 'function') {
            trackFocusSession(session.duration);
        }

        // Track focus activity for circadian insights
        if (typeof trackFocusActivity === 'function') {
            trackFocusActivity(session.duration);
        }
    } catch (error) {
        console.error('Error saving focus session:', error);
    }
}

/**
 * Load all focus sessions from localStorage
 */
function loadFocusSessions() {
    try {
        return loadFromStorage('FocusSessions', []);
    } catch (error) {
        console.error('Error loading focus sessions:', error);
        return [];
    }
}

/**
 * Get focus stats for today
 */
function getTodayStats() {
    const sessions = loadFocusSessions();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const todaySessions = sessions.filter(s => s.startTime >= todayStart);
    const totalDuration = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const sessionCount = todaySessions.length;

    return {
        sessionCount,
        totalDuration,
        formatted: formatDuration(totalDuration)
    };
}

/**
 * Get focus stats for this week
 */
function getWeekStats() {
    const sessions = loadFocusSessions();
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const weekSessions = sessions.filter(s => s.startTime >= weekStart.getTime());
    const totalDuration = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    const sessionCount = weekSessions.length;

    return {
        sessionCount,
        totalDuration,
        formatted: formatDuration(totalDuration)
    };
}

/**
 * Get longest focus streak (consecutive days)
 */
function getFocusStreak() {
    const sessions = loadFocusSessions();
    if (sessions.length === 0) {
        return 0;
    }

    // Group sessions by day
    const daySet = new Set();
    sessions.forEach(s => {
        const date = new Date(s.startTime);
        const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        daySet.add(dayKey);
    });

    const days = Array.from(daySet).sort().reverse();

    // Calculate streak from today backwards
    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    checkDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < days.length; i++) {
        const dayKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;

        if (days.includes(dayKey)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

/**
 * Get all focus stats (for Settings display)
 */
function getAllStats() {
    const today = getTodayStats();
    const week = getWeekStats();
    const streak = getFocusStreak();

    return {
        today,
        week,
        streak
    };
}

/**
 * Clear all focus session data (for testing)
 */
function clearAllSessions() {
    try {
        localStorage.removeItem('FocusSessions');
        console.log('🗑️ All focus sessions cleared');
    } catch (error) {
        console.error('Error clearing sessions:', error);
    }
}

/**
 * Update Focus Stats display in Settings
 */
function updateFocusStatsDisplay() {
    const stats = getAllStats();

    // Update today
    const todayEl = document.getElementById('todayFocusTime');
    if (todayEl) {
        todayEl.textContent = formatDurationShort(stats.today.totalDuration);
    }

    // Update week
    const weekEl = document.getElementById('weekFocusTime');
    if (weekEl) {
        weekEl.textContent = formatDurationShort(stats.week.totalDuration);
    }

    // Update streak
    const streakEl = document.getElementById('focusStreak');
    if (streakEl) {
        streakEl.textContent = stats.streak;
    }
}

/**
 * Format duration in milliseconds to short form (e.g. "2h 34m" or "45m")
 */
function formatDurationShort(ms) {
    if (ms === 0) {
        return '0m';
    }

    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}
