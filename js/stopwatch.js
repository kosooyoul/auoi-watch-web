// ==================== STOPWATCH SYSTEM ====================

// Stopwatch state
let stopwatchRunning = false;
let stopwatchStartTime = 0;
let stopwatchElapsedTime = 0;
let stopwatchLaps = [];
let stopwatchAnimationFrame = null;

/**
 * Initialize stopwatch system
 */
function initStopwatchSystem() {
    const stopwatchBtn = document.getElementById('stopwatchBtn');
    const stopwatchModal = document.getElementById('stopwatchModal');
    const stopwatchCloseBtn = document.getElementById('stopwatchCloseBtn');
    const startBtn = document.getElementById('stopwatchStartBtn');
    const lapBtn = document.getElementById('stopwatchLapBtn');
    const resetBtn = document.getElementById('stopwatchResetBtn');

    if (!stopwatchBtn || !stopwatchModal) {
        console.error('Stopwatch elements not found');
        return;
    }

    // Initialize stopwatch modal
    initModal({
        openButton: stopwatchBtn,
        modal: stopwatchModal,
        closeButton: stopwatchCloseBtn,
        onOpen: () => {
            if (stopwatchRunning) {
                startStopwatchAnimation();
            }
        }
    });

    // Start/Stop button
    startBtn.addEventListener('click', toggleStopwatch);

    // Lap button
    lapBtn.addEventListener('click', recordLap);

    // Reset button
    resetBtn.addEventListener('click', resetStopwatch);
}

/**
 * Toggle stopwatch start/stop
 */
function toggleStopwatch() {
    const startBtn = document.getElementById('stopwatchStartBtn');
    const lapBtn = document.getElementById('stopwatchLapBtn');
    const resetBtn = document.getElementById('stopwatchResetBtn');

    if (stopwatchRunning) {
        // Stop
        stopwatchRunning = false;
        stopwatchElapsedTime += performance.now() - stopwatchStartTime;

        // Update button states
        startBtn.classList.remove('running');
        startBtn.querySelector('.btn-icon').textContent = '▶';
        startBtn.querySelector('.btn-text').textContent = 'Start';
        lapBtn.disabled = true;
        resetBtn.disabled = false;

        // Stop animation
        if (stopwatchAnimationFrame) {
            cancelAnimationFrame(stopwatchAnimationFrame);
            stopwatchAnimationFrame = null;
        }
    } else {
        // Start
        stopwatchRunning = true;
        stopwatchStartTime = performance.now();

        // Update button states
        startBtn.classList.add('running');
        startBtn.querySelector('.btn-icon').textContent = '⏸';
        startBtn.querySelector('.btn-text').textContent = 'Stop';
        lapBtn.disabled = false;
        resetBtn.disabled = false;

        // Start animation
        startStopwatchAnimation();
    }
}

/**
 * Start stopwatch animation loop
 */
function startStopwatchAnimation() {
    function animate() {
        if (stopwatchRunning) {
            updateStopwatchDisplay();
            stopwatchAnimationFrame = requestAnimationFrame(animate);
        }
    }
    animate();
}

/**
 * Update stopwatch display
 */
function updateStopwatchDisplay() {
    const timeElement = document.getElementById('stopwatchTime');
    if (!timeElement) return;

    const currentTime = stopwatchRunning
        ? stopwatchElapsedTime + (performance.now() - stopwatchStartTime)
        : stopwatchElapsedTime;

    timeElement.textContent = formatStopwatchTime(currentTime);
}

/**
 * Format time in HH:MM:SS.mmm format
 * @param {number} ms - Time in milliseconds
 * @returns {string} Formatted time string
 */
function formatStopwatchTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor(ms % 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

/**
 * Record a lap time
 */
function recordLap() {
    if (!stopwatchRunning) return;

    const currentTime = stopwatchElapsedTime + (performance.now() - stopwatchStartTime);
    const previousLapTime = stopwatchLaps.length > 0
        ? stopwatchLaps[stopwatchLaps.length - 1].totalTime
        : 0;
    const splitTime = currentTime - previousLapTime;

    const lap = {
        number: stopwatchLaps.length + 1,
        splitTime: splitTime,
        totalTime: currentTime
    };

    stopwatchLaps.push(lap);
    renderLapTimes();
}

/**
 * Reset stopwatch to zero
 */
function resetStopwatch() {
    stopwatchRunning = false;
    stopwatchStartTime = 0;
    stopwatchElapsedTime = 0;
    stopwatchLaps = [];

    const startBtn = document.getElementById('stopwatchStartBtn');
    const lapBtn = document.getElementById('stopwatchLapBtn');
    const resetBtn = document.getElementById('stopwatchResetBtn');

    // Update button states
    startBtn.classList.remove('running');
    startBtn.querySelector('.btn-icon').textContent = '▶';
    startBtn.querySelector('.btn-text').textContent = 'Start';
    lapBtn.disabled = true;
    resetBtn.disabled = true;

    // Stop animation
    if (stopwatchAnimationFrame) {
        cancelAnimationFrame(stopwatchAnimationFrame);
        stopwatchAnimationFrame = null;
    }

    // Update display
    updateStopwatchDisplay();
    renderLapTimes();
}

/**
 * Render lap times list
 */
function renderLapTimes() {
    const listElement = document.getElementById('lapTimesList');
    const emptyState = document.getElementById('emptyLapState');

    if (!listElement) return;

    // Show/hide empty state
    if (stopwatchLaps.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        // Clear lap items
        const lapItems = listElement.querySelectorAll('.lap-item');
        lapItems.forEach(item => item.remove());
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Find fastest and slowest lap times (by split time)
    let fastestIndex = -1;
    let slowestIndex = -1;
    let fastestTime = Infinity;
    let slowestTime = -1;

    if (stopwatchLaps.length > 1) {
        stopwatchLaps.forEach((lap, index) => {
            if (lap.splitTime < fastestTime) {
                fastestTime = lap.splitTime;
                fastestIndex = index;
            }
            if (lap.splitTime > slowestTime) {
                slowestTime = lap.splitTime;
                slowestIndex = index;
            }
        });
    }

    // Clear existing lap items
    const existingItems = listElement.querySelectorAll('.lap-item');
    existingItems.forEach(item => item.remove());

    // Render laps in reverse order (newest first)
    const reversedLaps = [...stopwatchLaps].reverse();
    reversedLaps.forEach((lap, reverseIndex) => {
        const index = stopwatchLaps.length - 1 - reverseIndex;
        const lapElement = createLapElement(lap, index, fastestIndex, slowestIndex);
        listElement.appendChild(lapElement);
    });
}

/**
 * Create a lap time element
 * @param {Object} lap - Lap data
 * @param {number} index - Lap index
 * @param {number} fastestIndex - Index of fastest lap
 * @param {number} slowestIndex - Index of slowest lap
 * @returns {HTMLElement} Lap element
 */
function createLapElement(lap, index, fastestIndex, slowestIndex) {
    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';

    // Add fastest/slowest class
    if (index === fastestIndex && stopwatchLaps.length > 1) {
        lapItem.classList.add('fastest');
    } else if (index === slowestIndex && stopwatchLaps.length > 1) {
        lapItem.classList.add('slowest');
    }

    const lapInfo = document.createElement('div');
    lapInfo.className = 'lap-info';

    const lapNumber = document.createElement('div');
    lapNumber.className = 'lap-number';
    lapNumber.textContent = `Lap ${lap.number}`;

    const lapSplit = document.createElement('div');
    lapSplit.className = 'lap-split';
    lapSplit.textContent = formatStopwatchTime(lap.splitTime);

    lapInfo.appendChild(lapNumber);
    lapInfo.appendChild(lapSplit);

    const lapTotal = document.createElement('div');
    lapTotal.className = 'lap-total';
    lapTotal.textContent = formatStopwatchTime(lap.totalTime);

    lapItem.appendChild(lapInfo);
    lapItem.appendChild(lapTotal);

    return lapItem;
}
