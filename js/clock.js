// ==================== CLOCK SYSTEM ====================

// Visual constants for comet trail effect
const ARC_COVERAGE = 0.68;
const STROKE_LINECAP = 'round';
const HEAD_STROKE_WIDTH = 14;
const TAIL_STROKE_WIDTH = 4;
const HEAD_LENGTH_MULTIPLIER = 0.7;
const TAIL_LENGTH_MULTIPLIER = 1.4;
const BLACK_BLEND_FACTOR = 0.85;
const BASE_COLOR_SMOOTH_FACTOR = 0.15;
let COLOR_SMOOTH_FACTOR = BASE_COLOR_SMOOTH_FACTOR;

// DOM elements - Arc containers
const hourArcsContainer = document.getElementById('hourArcs');
const minuteArcsContainer = document.getElementById('minuteArcs');
const secondArcsContainer = document.getElementById('secondArcs');
const msArcsContainer = document.getElementById('msArcs');

// Arc segment arrays
let hourArcs = [];
let minuteArcs = [];
let secondArcs = [];
let msArcs = [];

// DOM elements - Text displays
const hourValue = document.getElementById('hourValue');
const minuteValue = document.getElementById('minuteValue');
const secondValue = document.getElementById('secondValue');
const msValue = document.getElementById('msValue');
const textTime = document.getElementById('textTime');

// Arc configuration
const ARC_CONFIG = {
    hour: { radius: 180, count: 96, trailLength: 30, color: '#667eea' },
    minute: { radius: 140, count: 60, trailLength: 20, color: '#f093fb' },
    second: { radius: 100, count: 60, trailLength: 16, color: '#4facfe' },
    ms: { radius: 60, count: 50, trailLength: 12, color: '#43e97b' }
};

// Store current colors for smooth interpolation
const currentColors = {
    hour: null,
    minute: null,
    second: null,
    ms: null
};

/**
 * Create arc segments for a ring
 * @param {HTMLElement} container - SVG container element
 * @param {number} radius - Radius of the ring
 * @param {number} count - Number of arc segments
 * @param {string} colorUrl - Gradient URL reference
 * @returns {Array} Array of created arc elements
 */
function createArcSegments(container, radius, count, colorUrl) {
    const arcs = [];
    const circumference = getCircumference(radius);
    const arcLength = (circumference / count) * ARC_COVERAGE;
    const gapLength = circumference;

    for (let i = 0; i < count; i++) {
        const arc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        arc.setAttribute('cx', '200');
        arc.setAttribute('cy', '200');
        arc.setAttribute('r', radius);
        arc.setAttribute('fill', 'none');
        arc.setAttribute('stroke', colorUrl);
        arc.setAttribute('stroke-width', '0');
        arc.setAttribute('stroke-linecap', STROKE_LINECAP);
        arc.setAttribute('stroke-dasharray', `${arcLength} ${gapLength}`);
        arc.setAttribute('stroke-dashoffset', circumference - (i * circumference / count));
        arc.setAttribute('opacity', '0');
        arc.classList.add('arc-segment');

        container.appendChild(arc);
        arcs.push(arc);
    }

    return arcs;
}

/**
 * Initialize arc segments for all rings
 */
function initializeRings() {
    hourArcs = createArcSegments(hourArcsContainer, ARC_CONFIG.hour.radius, ARC_CONFIG.hour.count, 'url(#hourGradient)');
    minuteArcs = createArcSegments(minuteArcsContainer, ARC_CONFIG.minute.radius, ARC_CONFIG.minute.count, 'url(#minuteGradient)');
    secondArcs = createArcSegments(secondArcsContainer, ARC_CONFIG.second.radius, ARC_CONFIG.second.count, 'url(#secondGradient)');
    msArcs = createArcSegments(msArcsContainer, ARC_CONFIG.ms.radius, ARC_CONFIG.ms.count, 'url(#msGradient)');
}

/**
 * Calculate distance of arc from head position with fractional adjustment
 * @param {number} headIndex - Current head position index
 * @param {number} arcIndex - Index of the arc to calculate distance for
 * @param {number} count - Total number of arcs
 * @param {number} fractionalPart - Fractional part of head position
 * @returns {number} Adjusted distance from head
 */
function calculateArcDistance(headIndex, arcIndex, count, fractionalPart) {
    let distance = (headIndex - arcIndex + count) % count;
    return distance - (1 - fractionalPart);
}

/**
 * Calculate trail styling parameters
 * @param {number} distance - Distance from head position
 * @param {number} trailLength - Total length of trail
 * @param {number} baseArcLength - Base arc length before multiplier
 * @param {string} color - Base color as RGB string
 * @returns {Object} Styling parameters
 */
function calculateTrailStyling(distance, trailLength, baseArcLength, color) {
    const distanceFactor = distance / trailLength;
    const blackFactor = distanceFactor * BLACK_BLEND_FACTOR;
    const strokeWidth = HEAD_STROKE_WIDTH - (HEAD_STROKE_WIDTH - TAIL_STROKE_WIDTH) * distanceFactor;
    const lengthMultiplier = HEAD_LENGTH_MULTIPLIER + (TAIL_LENGTH_MULTIPLIER - HEAD_LENGTH_MULTIPLIER) * distanceFactor;
    const arcLength = baseArcLength * lengthMultiplier;

    const baseColor = parseRgbString(color);
    const darkenedColor = interpolateColor(baseColor, [0, 0, 0], blackFactor);
    const colorString = rgbToString(darkenedColor);

    return { strokeWidth, arcLength, color: colorString };
}

/**
 * Apply styling to a visible trail arc
 * @param {Element} arc - SVG arc element
 * @param {Object} styling - Styling parameters
 * @param {number} gapLength - Gap length for stroke-dasharray
 */
function applyVisibleArcStyling(arc, styling, gapLength) {
    arc.setAttribute('opacity', '1');
    arc.setAttribute('stroke', styling.color);
    arc.setAttribute('stroke-width', styling.strokeWidth);
    arc.setAttribute('stroke-dasharray', `${styling.arcLength} ${gapLength}`);
}

/**
 * Hide an arc that's outside the trail
 * @param {Element} arc - SVG arc element
 */
function hideArc(arc) {
    arc.setAttribute('opacity', '0');
    arc.setAttribute('stroke-width', '0');
}

/**
 * Update arc segments with comet trail effect
 * @param {Array} arcs - Array of arc elements
 * @param {number} progress - Current progress (0 to 1)
 * @param {string} color - Current color
 * @param {number} count - Total number of arcs
 * @param {number} trailLength - Number of trailing arcs to show
 */
function updateArcSegments(arcs, progress, color, count, trailLength) {
    const exactPosition = progress * count;
    const headIndex = Math.floor(exactPosition) % count;
    const fractionalPart = exactPosition - Math.floor(exactPosition);

    const radius = parseFloat(arcs[0].getAttribute('r'));
    const circumference = getCircumference(radius);
    const baseArcLength = (circumference / count) * ARC_COVERAGE;
    const gapLength = circumference;

    arcs.forEach((arc, index) => {
        const distance = calculateArcDistance(headIndex, index, count, fractionalPart);

        if (distance >= 0 && distance <= trailLength) {
            const styling = calculateTrailStyling(distance, trailLength, baseArcLength, color);
            applyVisibleArcStyling(arc, styling, gapLength);
        } else {
            hideArc(arc);
        }
    });
}

/**
 * Get color for progress with smooth interpolation
 * @param {number} progress - Progress from 0 to 1
 * @param {string} type - Ring type (hour, minute, second, ms)
 * @returns {string} RGB color string
 */
function getColorForProgress(progress, type) {
    const theme = THEMES[currentTheme];
    const ringMap = {
        hour: 'ringHour',
        minute: 'ringMinute',
        second: 'ringSecond',
        ms: 'ringMs'
    };

    const ringColors = theme[ringMap[type]];
    const palette = [
        hexToRgb(ringColors.start),
        hexToRgb(ringColors.mid),
        hexToRgb(ringColors.end)
    ];

    const targetColor = getTargetColor(palette, progress);

    if (currentColors[type] === null) {
        currentColors[type] = targetColor;
    }

    const newColor = interpolateColor(currentColors[type], targetColor, COLOR_SMOOTH_FACTOR);
    currentColors[type] = newColor;

    return rgbToString(newColor);
}

/**
 * Update all time displays and rings
 */
function updateClock() {
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    let displayHours = hours;
    let period = '';

    if (timeFormat === '12h') {
        period = hours >= 12 ? 'PM' : 'AM';
        displayHours = hours % 12 || 12;
    }

    const msProgress = milliseconds / CLOCK_CONFIG.MS_IN_SECOND;
    const secondProgress = (seconds + msProgress) / CLOCK_CONFIG.SECONDS_IN_MINUTE;
    const minuteProgress = (minutes + secondProgress) / CLOCK_CONFIG.MINUTES_IN_HOUR;
    const hoursInCycle = timeFormat === '12h' ? 12 : CLOCK_CONFIG.HOURS_IN_DAY;
    const hourProgress = ((hours % hoursInCycle) + minuteProgress) / hoursInCycle;

    const hourColor = getColorForProgress(hourProgress, 'hour');
    const minuteColor = getColorForProgress(minuteProgress, 'minute');
    const secondColor = getColorForProgress(secondProgress, 'second');
    const msColor = getColorForProgress(msProgress, 'ms');

    updateArcSegments(hourArcs, hourProgress, hourColor, ARC_CONFIG.hour.count, ARC_CONFIG.hour.trailLength);
    updateArcSegments(minuteArcs, minuteProgress, minuteColor, ARC_CONFIG.minute.count, ARC_CONFIG.minute.trailLength);
    updateArcSegments(secondArcs, secondProgress, secondColor, ARC_CONFIG.second.count, ARC_CONFIG.second.trailLength);
    updateArcSegments(msArcs, msProgress, msColor, ARC_CONFIG.ms.count, ARC_CONFIG.ms.trailLength);

    hourValue.textContent = padZero(displayHours);
    minuteValue.textContent = padZero(minutes);
    secondValue.textContent = padZero(seconds);
    msValue.textContent = padZero(milliseconds, 3);

    const timeStr = timeFormat === '12h'
        ? `${padZero(displayHours)}:${padZero(minutes)}:${padZero(seconds)}.${padZero(milliseconds, 3)} ${period}`
        : `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}.${padZero(milliseconds, 3)}`;
    textTime.textContent = timeStr;

    renderAlarmMarkers(hours, minutes, seconds);

    requestAnimationFrame(updateClock);
}

/**
 * Update color smooth factor based on animation speed
 * @param {number} speed - Animation speed multiplier (0.5 - 2.0)
 */
function updateColorSmoothFactor(speed) {
    COLOR_SMOOTH_FACTOR = BASE_COLOR_SMOOTH_FACTOR * speed;
}
