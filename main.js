// Constants
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const MS_IN_SECOND = 1000;

// DOM elements
const hourRing = document.getElementById('hourRing');
const minuteRing = document.getElementById('minuteRing');
const secondRing = document.getElementById('secondRing');
const msRing = document.getElementById('msRing');

const hourValue = document.getElementById('hourValue');
const minuteValue = document.getElementById('minuteValue');
const secondValue = document.getElementById('secondValue');
const msValue = document.getElementById('msValue');
const textTime = document.getElementById('textTime');

/**
 * Calculate the circumference of a circle given its radius
 * @param {number} radius - The radius of the circle
 * @returns {number} The circumference
 */
function getCircumference(radius) {
    return 2 * Math.PI * radius;
}

/**
 * Initialize stroke-dasharray for all rings based on their radius
 */
function initializeRings() {
    const rings = [
        { element: hourRing, radius: 180 },
        { element: minuteRing, radius: 140 },
        { element: secondRing, radius: 100 },
        { element: msRing, radius: 60 }
    ];

    rings.forEach(({ element, radius }) => {
        const circumference = getCircumference(radius);
        element.style.strokeDasharray = `${circumference} ${circumference}`;
        element.style.strokeDashoffset = circumference;
    });
}

/**
 * Calculate progress (0 to 1) for a given time unit
 * @param {number} current - Current value
 * @param {number} max - Maximum value
 * @returns {number} Progress from 0 to 1
 */
function calculateProgress(current, max) {
    return current / max;
}

/**
 * Update a ring's visual progress
 * @param {HTMLElement} ring - The SVG circle element
 * @param {number} radius - The radius of the ring
 * @param {number} progress - Progress from 0 to 1
 */
function updateRing(ring, radius, progress) {
    const circumference = getCircumference(radius);
    const offset = circumference - (progress * circumference);
    ring.style.strokeDashoffset = offset;
}

/**
 * Format number with leading zeros
 * @param {number} num - The number to format
 * @param {number} digits - Number of digits
 * @returns {string} Formatted string
 */
function padZero(num, digits = 2) {
    return String(num).padStart(digits, '0');
}

/**
 * Update all time displays and rings
 */
function updateClock() {
    const now = new Date();

    // Get current time values
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    // Calculate progress for each unit
    const hourProgress = calculateProgress(hours, HOURS_IN_DAY);
    const minuteProgress = calculateProgress(minutes, MINUTES_IN_HOUR);
    const secondProgress = calculateProgress(seconds, SECONDS_IN_MINUTE);
    const msProgress = calculateProgress(milliseconds, MS_IN_SECOND);

    // Update rings
    updateRing(hourRing, 180, hourProgress);
    updateRing(minuteRing, 140, minuteProgress);
    updateRing(secondRing, 100, secondProgress);
    updateRing(msRing, 60, msProgress);

    // Update text displays
    hourValue.textContent = padZero(hours);
    minuteValue.textContent = padZero(minutes);
    secondValue.textContent = padZero(seconds);
    msValue.textContent = padZero(milliseconds, 3);

    // Update accessible text time
    textTime.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}.${padZero(milliseconds, 3)}`;

    // Request next frame
    requestAnimationFrame(updateClock);
}

/**
 * Initialize the clock
 */
function init() {
    initializeRings();
    updateClock();
}

// Start the clock when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
