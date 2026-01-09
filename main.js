// Time constants
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const MS_IN_SECOND = 1000;

// Visual constants for comet trail effect
const ARC_COVERAGE = 0.68; // 68% filled, 32% gap for continuous flow
const STROKE_LINECAP = 'round'; // Smooth rounded edges for comet effect

// Stroke width range (head thick, tail thin)
const HEAD_STROKE_WIDTH = 14;
const TAIL_STROKE_WIDTH = 4;

// Arc length multipliers (head shorter, tail longer)
const HEAD_LENGTH_MULTIPLIER = 0.7;  // Head is 70% of base length
const TAIL_LENGTH_MULTIPLIER = 1.4;  // Tail is 140% of base length (2x head)

// Color blending
const BLACK_BLEND_FACTOR = 0.85; // Maximum black blending (0 = full color, 1 = black)
const COLOR_SMOOTH_FACTOR = 0.15; // Color interpolation smoothness

// DOM elements - Arc containers
const hourArcsContainer = document.getElementById('hourArcs');
const minuteArcsContainer = document.getElementById('minuteArcs');
const secondArcsContainer = document.getElementById('secondArcs');
const msArcsContainer = document.getElementById('msArcs');

// Arc segment arrays (will be populated dynamically)
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

// Arc configuration (number of segments based on radius, trail scales with radius)
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
 * Calculate the circumference of a circle given its radius
 * @param {number} radius - The radius of the circle
 * @returns {number} The circumference
 */
function getCircumference(radius) {
    return 2 * Math.PI * radius;
}

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
    const degreesPerArc = 360 / count;

    // Arc coverage for tighter spacing and stronger comet trail
    const arcLength = (circumference / count) * ARC_COVERAGE;
    const gapLength = circumference; // Large gap, only arcLength visible

    for (let i = 0; i < count; i++) {
        const arc = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        arc.setAttribute('cx', '200');
        arc.setAttribute('cy', '200');
        arc.setAttribute('r', radius);
        arc.setAttribute('fill', 'none');
        arc.setAttribute('stroke', colorUrl);
        arc.setAttribute('stroke-width', '0'); // Will be set dynamically
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
    // Create arc segments for each ring
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
    // Adjust with fractional progress for smooth transitions
    return distance - (1 - fractionalPart);
}

/**
 * Calculate trail styling parameters (width, length, color) for an arc
 * @param {number} distance - Distance from head position
 * @param {number} trailLength - Total length of trail
 * @param {number} baseArcLength - Base arc length before multiplier
 * @param {string} color - Base color as RGB string
 * @returns {Object} Styling parameters {strokeWidth, arcLength, color}
 */
function calculateTrailStyling(distance, trailLength, baseArcLength, color) {
    const distanceFactor = distance / trailLength;

    // Black blending for color (0 = full color, 1 = black)
    const blackFactor = distanceFactor * BLACK_BLEND_FACTOR;

    // Stroke width (head thick, tail thin)
    const strokeWidth = HEAD_STROKE_WIDTH - (HEAD_STROKE_WIDTH - TAIL_STROKE_WIDTH) * distanceFactor;

    // Arc length (head short, tail long)
    const lengthMultiplier = HEAD_LENGTH_MULTIPLIER + (TAIL_LENGTH_MULTIPLIER - HEAD_LENGTH_MULTIPLIER) * distanceFactor;
    const arcLength = baseArcLength * lengthMultiplier;

    // Blend color with black
    const baseColor = parseRgbString(color);
    const darkenedColor = interpolateColor(baseColor, [0, 0, 0], blackFactor);
    const colorString = rgbToString(darkenedColor);

    return { strokeWidth, arcLength, color: colorString };
}

/**
 * Apply styling to a visible trail arc
 * @param {Element} arc - SVG arc element
 * @param {Object} styling - Styling parameters from calculateTrailStyling
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
    // Calculate head position with fractional progress for smooth transitions
    const exactPosition = progress * count;
    const headIndex = Math.floor(exactPosition) % count;
    const fractionalPart = exactPosition - Math.floor(exactPosition);

    // Calculate arc geometry
    const radius = parseFloat(arcs[0].getAttribute('r'));
    const circumference = getCircumference(radius);
    const baseArcLength = (circumference / count) * ARC_COVERAGE;
    const gapLength = circumference;

    // Update each arc
    arcs.forEach((arc, index) => {
        const distance = calculateArcDistance(headIndex, index, count, fractionalPart);

        if (distance >= 0 && distance <= trailLength) {
            // Arc is in the visible trail
            const styling = calculateTrailStyling(distance, trailLength, baseArcLength, color);
            applyVisibleArcStyling(arc, styling, gapLength);
        } else {
            // Arc is outside the trail
            hideArc(arc);
        }
    });
}


/**
 * Interpolate between two colors
 * @param {Array} color1 - RGB array [r, g, b]
 * @param {Array} color2 - RGB array [r, g, b]
 * @param {number} factor - Interpolation factor (0 to 1)
 * @returns {Array} RGB array [r, g, b]
 */
function interpolateColor(color1, color2, factor) {
    const r = Math.round(color1[0] + (color2[0] - color1[0]) * factor);
    const g = Math.round(color1[1] + (color2[1] - color1[1]) * factor);
    const b = Math.round(color1[2] + (color2[2] - color1[2]) * factor);
    return [r, g, b];
}

/**
 * Convert RGB array to CSS string
 * @param {Array} rgb - RGB array [r, g, b]
 * @returns {string} RGB color string
 */
function rgbToString(rgb) {
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

/**
 * Parse RGB string to array
 * @param {string} rgbString - RGB string like "rgb(255, 0, 0)"
 * @returns {Array} RGB array [r, g, b]
 */
function parseRgbString(rgbString) {
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    return [0, 0, 0];
}

/**
 * Get target color based on progress through palette
 * @param {Array} palette - Color palette array
 * @param {number} progress - Progress from 0 to 1
 * @returns {Array} Target RGB color [r, g, b]
 */
function getTargetColor(palette, progress) {
    if (progress < 0.5) {
        // First half: interpolate between start and mid
        return interpolateColor(palette[0], palette[1], progress * 2);
    } else {
        // Second half: interpolate between mid and end
        return interpolateColor(palette[1], palette[2], (progress - 0.5) * 2);
    }
}

/**
 * Get color for progress with smooth interpolation
 * @param {number} progress - Progress from 0 to 1
 * @param {string} type - Ring type (hour, minute, second, ms)
 * @returns {string} RGB color string
 */
function getColorForProgress(progress, type) {
    // Define color palettes for each ring type (water stream colors)
    const colorPalettes = {
        hour: [
            [102, 126, 234],  // #667eea (start)
            [118, 75, 162],   // #764ba2 (mid)
            [147, 51, 234]    // brighter purple (end)
        ],
        minute: [
            [240, 147, 251],  // #f093fb (start)
            [245, 87, 108],   // #f5576c (mid)
            [255, 107, 129]   // brighter pink (end)
        ],
        second: [
            [79, 172, 254],   // #4facfe (start)
            [0, 242, 254],    // #00f2fe (mid)
            [64, 224, 208]    // turquoise (end)
        ],
        ms: [
            [67, 233, 123],   // #43e97b (start)
            [56, 249, 215],   // #38f9d7 (mid)
            [127, 255, 212]   // aquamarine (end)
        ]
    };

    const palette = colorPalettes[type];

    // Calculate target color based on progress
    const targetColor = getTargetColor(palette, progress);

    // Initialize current color if not set
    if (currentColors[type] === null) {
        currentColors[type] = targetColor;
    }

    // Smoothly interpolate from current color to target color
    const newColor = interpolateColor(currentColors[type], targetColor, COLOR_SMOOTH_FACTOR);

    // Store the new color for next frame
    currentColors[type] = newColor;

    return rgbToString(newColor);
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

    // Calculate fractional progress for smooth water-like flow
    // Each unit includes fractional parts of smaller units to prevent jumps
    const msProgress = milliseconds / MS_IN_SECOND;
    const secondProgress = (seconds + msProgress) / SECONDS_IN_MINUTE;
    const minuteProgress = (minutes + secondProgress) / MINUTES_IN_HOUR;
    const hourProgress = (hours + minuteProgress) / HOURS_IN_DAY;

    // Calculate colors based on progress
    const hourColor = getColorForProgress(hourProgress, 'hour');
    const minuteColor = getColorForProgress(minuteProgress, 'minute');
    const secondColor = getColorForProgress(secondProgress, 'second');
    const msColor = getColorForProgress(msProgress, 'ms');

    // Update arc segments with comet trail effect (trail length scales with ring size)
    updateArcSegments(hourArcs, hourProgress, hourColor, ARC_CONFIG.hour.count, ARC_CONFIG.hour.trailLength);
    updateArcSegments(minuteArcs, minuteProgress, minuteColor, ARC_CONFIG.minute.count, ARC_CONFIG.minute.trailLength);
    updateArcSegments(secondArcs, secondProgress, secondColor, ARC_CONFIG.second.count, ARC_CONFIG.second.trailLength);
    updateArcSegments(msArcs, msProgress, msColor, ARC_CONFIG.ms.count, ARC_CONFIG.ms.trailLength);

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
