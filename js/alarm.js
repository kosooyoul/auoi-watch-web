// ==================== ALARM & TIMER SYSTEM ====================

// Alarm storage
let alarms = [];
let alarmCheckInterval = null;

// Timer state
let timerState = {
    isRunning: false,
    startTime: 0,
    duration: 0,
    remaining: 0,
    intervalId: null
};

/**
 * Initialize alarm system
 */
function initAlarmSystem() {
    const alarmBtn = document.getElementById('alarmBtn');
    const alarmModal = document.getElementById('alarmModal');
    const alarmCloseBtn = document.getElementById('alarmCloseBtn');
    const alarmTab = document.getElementById('alarmTab');
    const timerTab = document.getElementById('timerTab');
    const alarmPanel = document.getElementById('alarmPanel');
    const timerPanel = document.getElementById('timerPanel');
    const addAlarmBtn = document.getElementById('addAlarmBtn');
    const enableNotificationBtn = document.getElementById('enableNotificationBtn');

    // Load alarms from localStorage
    loadAlarms();

    // Check notification permission
    checkNotificationPermission();

    // Open alarm modal
    alarmBtn.addEventListener('click', () => {
        alarmModal.classList.add('active');
        checkNotificationPermission();
    });

    // Close alarm modal
    const closeAlarmModal = () => {
        alarmModal.classList.remove('active');
    };

    alarmCloseBtn.addEventListener('click', closeAlarmModal);

    // Close on backdrop click
    alarmModal.addEventListener('click', (e) => {
        if (e.target === alarmModal) {
            closeAlarmModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && alarmModal.classList.contains('active')) {
            closeAlarmModal();
        }
    });

    // Tab switching
    alarmTab.addEventListener('click', () => {
        switchTab('alarm');
    });

    timerTab.addEventListener('click', () => {
        switchTab('timer');
    });

    // Keyboard navigation for tabs
    alarmTab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            switchTab('alarm');
        }
    });

    timerTab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            switchTab('timer');
        }
    });

    // Add alarm button
    addAlarmBtn.addEventListener('click', addAlarm);

    // Enable notifications
    enableNotificationBtn.addEventListener('click', requestNotificationPermission);

    // Repeat select toggle
    const repeatSelect = document.getElementById('alarmRepeat');
    const customDays = document.getElementById('customDays');

    repeatSelect.addEventListener('change', () => {
        if (repeatSelect.value === 'custom') {
            customDays.style.display = 'block';
        } else {
            customDays.style.display = 'none';
        }
    });

    // Initialize timer controls
    initTimer();

    // Start alarm checking interval
    startAlarmChecker();
}

/**
 * Switch between alarm and timer tabs
 * @param {string} tab - 'alarm' or 'timer'
 */
function switchTab(tab) {
    const alarmTab = document.getElementById('alarmTab');
    const timerTab = document.getElementById('timerTab');
    const alarmPanel = document.getElementById('alarmPanel');
    const timerPanel = document.getElementById('timerPanel');

    if (tab === 'alarm') {
        alarmTab.classList.add('active');
        timerTab.classList.remove('active');
        alarmTab.setAttribute('aria-selected', 'true');
        timerTab.setAttribute('aria-selected', 'false');
        alarmPanel.classList.add('active');
        timerPanel.classList.remove('active');
        alarmPanel.removeAttribute('hidden');
        timerPanel.setAttribute('hidden', '');
    } else {
        timerTab.classList.add('active');
        alarmTab.classList.remove('active');
        timerTab.setAttribute('aria-selected', 'true');
        alarmTab.setAttribute('aria-selected', 'false');
        timerPanel.classList.add('active');
        alarmPanel.classList.remove('active');
        timerPanel.removeAttribute('hidden');
        alarmPanel.setAttribute('hidden', '');
    }
}

/**
 * Check notification permission status
 */
function checkNotificationPermission() {
    const permissionDiv = document.getElementById('notificationPermission');

    if (!('Notification' in window)) {
        permissionDiv.style.display = 'none';
        return;
    }

    if (Notification.permission === 'granted') {
        permissionDiv.style.display = 'none';
    } else if (Notification.permission === 'denied') {
        permissionDiv.style.display = 'block';
        document.getElementById('enableNotificationBtn').disabled = true;
        document.querySelector('.permission-text').textContent = '⚠️ Notifications are blocked. Please enable them in browser settings.';
    } else {
        permissionDiv.style.display = 'block';
    }
}

/**
 * Request notification permission
 */
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        alert('This browser does not support notifications');
        return;
    }

    try {
        const permission = await Notification.requestPermission();
        checkNotificationPermission();

        if (permission === 'granted') {
            new Notification('Alarms Enabled', {
                body: 'You will now receive alarm notifications',
                icon: '/icons/icon-192.png'
            });
        }
    } catch (error) {
        console.error('Error requesting notification permission:', error);
    }
}

/**
 * Add a new alarm
 */
function addAlarm() {
    const hourInput = document.getElementById('alarmHour');
    const minuteInput = document.getElementById('alarmMinute');
    const secondInput = document.getElementById('alarmSecond');
    const repeatSelect = document.getElementById('alarmRepeat');

    const hour = parseInt(hourInput.value);
    const minute = parseInt(minuteInput.value);
    const second = parseInt(secondInput.value) || 0; // Default to 0 if not provided
    const repeat = repeatSelect.value;

    // Validation
    if (isNaN(hour) || isNaN(minute)) {
        alert('Please enter valid hour and minute');
        return;
    }

    if (hour < 0 || hour > 23) {
        alert('Hour must be between 0 and 23');
        return;
    }

    if (minute < 0 || minute > 59) {
        alert('Minute must be between 0 and 59');
        return;
    }

    if (second < 0 || second > 59) {
        alert('Second must be between 0 and 59');
        return;
    }

    // Get custom days if custom repeat is selected
    let customDays = [];
    if (repeat === 'custom') {
        const dayCheckboxes = document.querySelectorAll('input[name="day"]:checked');
        if (dayCheckboxes.length === 0) {
            alert('Please select at least one day for custom repeat');
            return;
        }
        customDays = Array.from(dayCheckboxes).map(cb => parseInt(cb.value));
    }

    // Create alarm object
    const alarm = {
        id: Date.now(),
        hour: hour,
        minute: minute,
        second: second,
        enabled: true,
        repeat: repeat,
        customDays: customDays
    };

    // Add to alarms array
    alarms.push(alarm);

    // Save to localStorage
    saveAlarms();

    // Render alarm list
    renderAlarms();

    // Clear inputs
    hourInput.value = '';
    minuteInput.value = '';
    secondInput.value = '';
    repeatSelect.value = 'none';
    document.getElementById('customDays').style.display = 'none';
    document.querySelectorAll('input[name="day"]').forEach(cb => cb.checked = false);
}

/**
 * Render alarm list
 */
function renderAlarms() {
    const alarmList = document.getElementById('alarmList');
    const emptyState = document.getElementById('emptyAlarmState');

    if (alarms.length === 0) {
        emptyState.style.display = 'block';
        // Remove all alarm items
        const alarmItems = alarmList.querySelectorAll('.alarm-item');
        alarmItems.forEach(item => item.remove());

        // Update markers immediately
        const now = new Date();
        renderAlarmMarkers(now.getHours(), now.getMinutes(), now.getSeconds());
        return;
    }

    emptyState.style.display = 'none';

    // Sort alarms by time
    const sortedAlarms = [...alarms].sort((a, b) => {
        if (a.hour !== b.hour) return a.hour - b.hour;
        if (a.minute !== b.minute) return a.minute - b.minute;
        return (a.second || 0) - (b.second || 0);
    });

    // Clear existing items
    const alarmItems = alarmList.querySelectorAll('.alarm-item');
    alarmItems.forEach(item => item.remove());

    // Render each alarm
    sortedAlarms.forEach(alarm => {
        const alarmItem = document.createElement('div');
        alarmItem.className = `alarm-item ${alarm.enabled ? '' : 'disabled'}`;
        alarmItem.dataset.id = alarm.id;

        const timeStr = `${String(alarm.hour).padStart(2, '0')}:${String(alarm.minute).padStart(2, '0')}:${String(alarm.second || 0).padStart(2, '0')}`;

        // Get repeat label
        let repeatLabel = '';
        if (alarm.repeat && alarm.repeat !== 'none') {
            switch (alarm.repeat) {
                case 'daily':
                    repeatLabel = 'Every Day';
                    break;
                case 'weekdays':
                    repeatLabel = 'Weekdays';
                    break;
                case 'weekends':
                    repeatLabel = 'Weekends';
                    break;
                case 'custom':
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const selectedDays = alarm.customDays.map(d => dayNames[d]).join(', ');
                    repeatLabel = selectedDays;
                    break;
            }
        }

        alarmItem.innerHTML = `
            <div class="alarm-info">
                <div class="alarm-time">${timeStr}</div>
                ${repeatLabel ? `<div class="alarm-repeat">${repeatLabel}</div>` : ''}
            </div>
            <div class="alarm-actions">
                <button class="alarm-toggle ${alarm.enabled ? 'active' : ''}" aria-label="Toggle alarm"></button>
                <button class="alarm-delete" aria-label="Delete alarm">Delete</button>
            </div>
        `;

        // Toggle button
        const toggleBtn = alarmItem.querySelector('.alarm-toggle');
        toggleBtn.addEventListener('click', () => toggleAlarm(alarm.id));

        // Delete button
        const deleteBtn = alarmItem.querySelector('.alarm-delete');
        deleteBtn.addEventListener('click', () => deleteAlarm(alarm.id));

        alarmList.appendChild(alarmItem);
    });

    // Update markers immediately after rendering alarms
    const now = new Date();
    renderAlarmMarkers(now.getHours(), now.getMinutes(), now.getSeconds());
}

/**
 * Toggle alarm enabled/disabled
 * @param {number} alarmId - ID of the alarm to toggle
 */
function toggleAlarm(alarmId) {
    const alarm = alarms.find(a => a.id === alarmId);
    if (alarm) {
        alarm.enabled = !alarm.enabled;
        saveAlarms();
        renderAlarms();
    }
}

/**
 * Delete an alarm
 * @param {number} alarmId - ID of the alarm to delete
 */
function deleteAlarm(alarmId) {
    alarms = alarms.filter(a => a.id !== alarmId);
    saveAlarms();
    renderAlarms();
}

/**
 * Save alarms to localStorage
 */
function saveAlarms() {
    localStorage.setItem('ringClockAlarms', JSON.stringify(alarms));
}

/**
 * Load alarms from localStorage
 */
function loadAlarms() {
    try {
        const saved = localStorage.getItem('ringClockAlarms');
        if (saved) {
            alarms = JSON.parse(saved);
            renderAlarms();
        }
    } catch (error) {
        console.error('Error loading alarms:', error);
    }
}

/**
 * Start alarm checker interval
 */
function startAlarmChecker() {
    // Check every second
    alarmCheckInterval = setInterval(checkAlarms, 1000);
}

/**
 * Check if any alarms should trigger
 */
function checkAlarms() {
    if (alarms.length === 0) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday

    // Check all alarms (including second-precision alarms)
    alarms.forEach(alarm => {
        const alarmSecond = alarm.second || 0; // Default to 0 if not set

        // Check time match
        const timeMatches = alarm.enabled &&
            alarm.hour === currentHour &&
            alarm.minute === currentMinute &&
            alarmSecond === currentSecond;

        if (!timeMatches) return;

        // Check repeat pattern
        const repeat = alarm.repeat || 'none';
        let shouldTrigger = false;

        switch (repeat) {
            case 'none':
                shouldTrigger = true;
                break;
            case 'daily':
                shouldTrigger = true;
                break;
            case 'weekdays':
                // Monday (1) to Friday (5)
                shouldTrigger = currentDay >= 1 && currentDay <= 5;
                break;
            case 'weekends':
                // Saturday (6) or Sunday (0)
                shouldTrigger = currentDay === 0 || currentDay === 6;
                break;
            case 'custom':
                shouldTrigger = alarm.customDays && alarm.customDays.includes(currentDay);
                break;
        }

        if (shouldTrigger) {
            triggerAlarm(alarm);
        }
    });
}

/**
 * Trigger an alarm
 * @param {Object} alarm - The alarm object
 */
function triggerAlarm(alarm) {
    const timeStr = `${String(alarm.hour).padStart(2, '0')}:${String(alarm.minute).padStart(2, '0')}:${String(alarm.second || 0).padStart(2, '0')}`;

    // Show notification
    if (Notification.permission === 'granted') {
        new Notification('Alarm', {
            body: `Alarm at ${timeStr}`,
            icon: '/icons/icon-192.png',
            tag: `alarm-${alarm.id}`,
            requireInteraction: true
        });
    }

    // Play sound (optional - browser may block)
    try {
        const audio = new Audio('data:audio/wav;base64,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');
        audio.play().catch(() => {
            // Ignore if audio playback is blocked
        });
    } catch (error) {
        // Ignore audio errors
    }

    // Auto-disable one-time alarms (repeat = 'none')
    const repeat = alarm.repeat || 'none';
    if (repeat === 'none') {
        alarm.enabled = false;
        saveAlarms();
        renderAlarms();
    }
}

// ==================== TIMER SYSTEM ====================

/**
 * Initialize timer controls
 */
function initTimer() {
    const startTimerBtn = document.getElementById('startTimerBtn');
    const resetTimerBtn = document.getElementById('resetTimerBtn');

    startTimerBtn.addEventListener('click', toggleTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
}

/**
 * Toggle timer start/pause
 */
function toggleTimer() {
    const startTimerBtn = document.getElementById('startTimerBtn');
    const resetTimerBtn = document.getElementById('resetTimerBtn');

    if (timerState.isRunning) {
        // Pause timer
        clearInterval(timerState.intervalId);
        timerState.isRunning = false;
        startTimerBtn.textContent = 'Resume';
    } else {
        // Start or resume timer
        if (timerState.remaining === 0) {
            // Starting new timer
            const hourInput = document.getElementById('timerHour');
            const minuteInput = document.getElementById('timerMinute');
            const secondInput = document.getElementById('timerSecond');

            const hours = parseInt(hourInput.value) || 0;
            const minutes = parseInt(minuteInput.value) || 0;
            const seconds = parseInt(secondInput.value) || 0;

            if (hours === 0 && minutes === 0 && seconds === 0) {
                alert('Please enter a timer duration');
                return;
            }

            timerState.duration = (hours * 3600 + minutes * 60 + seconds) * 1000;
            timerState.remaining = timerState.duration;
        }

        timerState.startTime = Date.now();
        timerState.isRunning = true;
        timerState.intervalId = setInterval(updateTimer, 100);
        startTimerBtn.textContent = 'Pause';
        resetTimerBtn.disabled = false;
    }
}

/**
 * Update timer display
 */
function updateTimer() {
    const elapsed = Date.now() - timerState.startTime;
    timerState.remaining -= elapsed;
    timerState.startTime = Date.now();

    if (timerState.remaining <= 0) {
        timerState.remaining = 0;
        timerComplete();
        return;
    }

    // Update display
    const totalSeconds = Math.ceil(timerState.remaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.querySelector('.timer-time').textContent = timeStr;

    // Update progress bar
    const progress = ((timerState.duration - timerState.remaining) / timerState.duration) * 100;
    document.getElementById('timerProgressBar').style.width = `${progress}%`;
}

/**
 * Timer complete handler
 */
function timerComplete() {
    clearInterval(timerState.intervalId);
    timerState.isRunning = false;
    timerState.remaining = 0;

    document.querySelector('.timer-time').textContent = '00:00:00';
    document.getElementById('timerProgressBar').style.width = '100%';
    document.getElementById('startTimerBtn').textContent = 'Start Timer';

    // Show notification
    if (Notification.permission === 'granted') {
        new Notification('Timer Complete', {
            body: 'Your timer has finished!',
            icon: '/icons/icon-192.png',
            requireInteraction: true
        });
    }

    // Play sound
    try {
        const audio = new Audio('data:audio/wav;base64,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');
        audio.play().catch(() => {});
    } catch (error) {
        // Ignore
    }
}

/**
 * Reset timer
 */
function resetTimer() {
    clearInterval(timerState.intervalId);
    timerState.isRunning = false;
    timerState.remaining = 0;
    timerState.duration = 0;

    document.querySelector('.timer-time').textContent = '00:00:00';
    document.getElementById('timerProgressBar').style.width = '0%';
    document.getElementById('startTimerBtn').textContent = 'Start Timer';
    document.getElementById('resetTimerBtn').disabled = true;
}

// ==================== ALARM MARKERS ON CLOCK ====================

const alarmMarkersContainer = document.getElementById('alarmMarkers');

/**
 * Render alarm markers on clock rings
 * @param {number} currentHour - Current hour
 * @param {number} currentMinute - Current minute
 * @param {number} currentSecond - Current second
 */
function renderAlarmMarkers(currentHour, currentMinute, currentSecond) {
    if (!alarmMarkersContainer) return;

    // Clear existing markers
    alarmMarkersContainer.innerHTML = '';

    // Render each enabled alarm
    alarms.forEach(alarm => {
        if (!alarm.enabled) return;

        const alarmHour = alarm.hour;
        const alarmMinute = alarm.minute;
        const alarmSecond = alarm.second || 0;

        let radius, progress, ringType;
        let shouldShow = false;

        // Determine which ring to show marker on
        if (alarmHour === currentHour && alarmMinute === currentMinute) {
            // Same hour and minute - show on second ring
            radius = ARC_CONFIG.second.radius;
            progress = alarmSecond / SECONDS_IN_MINUTE;
            ringType = 'second';

            // Show marker only if the comet hasn't passed it yet
            const currentSecondProgress = currentSecond / SECONDS_IN_MINUTE;
            shouldShow = progress > currentSecondProgress;
        } else if (alarmHour === currentHour) {
            // Same hour, different minute - show on minute ring
            radius = ARC_CONFIG.minute.radius;
            progress = alarmMinute / MINUTES_IN_HOUR;
            ringType = 'minute';

            // Show marker only if the comet hasn't passed it yet
            // Current minute progress includes seconds for smooth flow
            const currentMinuteProgress = (currentMinute + currentSecond / SECONDS_IN_MINUTE) / MINUTES_IN_HOUR;
            shouldShow = progress > currentMinuteProgress;
        } else {
            // Different hour - show on hour ring
            radius = ARC_CONFIG.hour.radius;

            // Calculate progress based on time format (12h or 24h)
            const hoursInCycle = timeFormat === '12h' ? 12 : HOURS_IN_DAY;
            const displayAlarmHour = timeFormat === '12h' ? (alarmHour % 12) : alarmHour;
            const displayCurrentHour = timeFormat === '12h' ? (currentHour % 12) : currentHour;

            progress = displayAlarmHour / hoursInCycle;
            ringType = 'hour';

            // Show marker only if the comet hasn't passed it yet
            // Current hour progress includes minutes and seconds for smooth flow
            const currentHourProgress = (displayCurrentHour + currentMinute / MINUTES_IN_HOUR) / hoursInCycle;
            shouldShow = progress > currentHourProgress;
        }

        if (!shouldShow) return;

        // Calculate angle
        // SVG circle starts at right (0°) and rotates clockwise
        // SVG is rotated -90deg, so right becomes top
        // Progress 0 (0시) = right before rotation = top after rotation
        // Progress 0.25 (6시) = bottom before rotation = right after rotation
        // Progress 0.5 (12시) = left before rotation = bottom after rotation
        // Progress 0.75 (18시) = top before rotation = left after rotation
        const angle = progress * 360;
        const angleRad = angle * (Math.PI / 180);

        // Calculate marker position (standard SVG coordinates)
        const centerX = 200;
        const centerY = 200;
        const markerX = centerX + radius * Math.cos(angleRad);
        const markerY = centerY + radius * Math.sin(angleRad);

        // Create marker dot
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', markerX);
        dot.setAttribute('cy', markerY);
        const dotRadius = ringType === 'hour' ? '7' : ringType === 'minute' ? '6' : '5';
        dot.setAttribute('r', dotRadius);
        dot.classList.add('alarm-marker-dot');

        // Create marker tick (short line pointing to center)
        const tickLength = ringType === 'hour' ? 14 : ringType === 'minute' ? 12 : 10;
        const innerRadius = radius - tickLength / 2;
        const outerRadius = radius + tickLength / 2;

        const innerX = centerX + innerRadius * Math.cos(angleRad);
        const innerY = centerY + innerRadius * Math.sin(angleRad);
        const outerX = centerX + outerRadius * Math.cos(angleRad);
        const outerY = centerY + outerRadius * Math.sin(angleRad);

        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('x1', innerX);
        tick.setAttribute('y1', innerY);
        tick.setAttribute('x2', outerX);
        tick.setAttribute('y2', outerY);
        tick.classList.add('alarm-marker');

        alarmMarkersContainer.appendChild(tick);
        alarmMarkersContainer.appendChild(dot);
    });
}
