// ==================== THEME SYSTEM ====================

// Theme definitions
const THEMES = {
    classic: {
        name: 'Classic',
        bgPrimary: '#1e1e2e',
        bgSecondary: '#2d2d44',
        textPrimary: '#ffffff',
        textSecondary: '#e0e0e0',
        textMuted: 'rgba(255, 255, 255, 0.5)',
        textTime: 'rgba(255, 255, 255, 0.7)',
        ringBg: 'rgba(128, 128, 128, 0.2)',
        ringHour: { start: '#667eea', mid: '#764ba2', end: '#9333ea' },
        ringMinute: { start: '#f093fb', mid: '#f5576c', end: '#ff6b81' },
        ringSecond: { start: '#4facfe', mid: '#00f2fe', end: '#40e0d0' },
        ringMs: { start: '#43e97b', mid: '#38f9d7', end: '#7fffd4' }
    },
    warm: {
        name: 'Warm Sunset',
        bgPrimary: '#2d1b1b',
        bgSecondary: '#4a2828',
        textPrimary: '#ffffff',
        textSecondary: '#ffe4e4',
        textMuted: 'rgba(255, 228, 228, 0.5)',
        textTime: 'rgba(255, 228, 228, 0.7)',
        ringBg: 'rgba(255, 107, 107, 0.15)',
        ringHour: { start: '#ff6b6b', mid: '#ee5a6f', end: '#ff4757' },
        ringMinute: { start: '#ffa600', mid: '#ff8c42', end: '#ff7f50' },
        ringSecond: { start: '#ff8c42', mid: '#ff6348', end: '#ff4757' },
        ringMs: { start: '#ffd93d', mid: '#feca57', end: '#ffb142' }
    },
    ocean: {
        name: 'Ocean Breeze',
        bgPrimary: '#0a1929',
        bgSecondary: '#1a2332',
        textPrimary: '#ffffff',
        textSecondary: '#e0f2fe',
        textMuted: 'rgba(224, 242, 254, 0.5)',
        textTime: 'rgba(224, 242, 254, 0.7)',
        ringBg: 'rgba(14, 165, 233, 0.15)',
        ringHour: { start: '#1e3a8a', mid: '#1e40af', end: '#2563eb' },
        ringMinute: { start: '#0ea5e9', mid: '#0284c7', end: '#0369a1' },
        ringSecond: { start: '#06b6d4', mid: '#0891b2', end: '#0e7490' },
        ringMs: { start: '#67e8f9', mid: '#22d3ee', end: '#06b6d4' }
    },
    neon: {
        name: 'Neon Night',
        bgPrimary: '#0d0221',
        bgSecondary: '#1a0b3f',
        textPrimary: '#ffffff',
        textSecondary: '#f0f0ff',
        textMuted: 'rgba(240, 240, 255, 0.5)',
        textTime: 'rgba(240, 240, 255, 0.7)',
        ringBg: 'rgba(255, 0, 255, 0.15)',
        ringHour: { start: '#ff00ff', mid: '#d946ef', end: '#c026d3' },
        ringMinute: { start: '#00ffff', mid: '#06b6d4', end: '#0891b2' },
        ringSecond: { start: '#ff00aa', mid: '#ec4899', end: '#db2777' },
        ringMs: { start: '#00ff00', mid: '#22c55e', end: '#16a34a' }
    },
    pastel: {
        name: 'Soft Pastel',
        bgPrimary: '#f8f9fa',
        bgSecondary: '#e9ecef',
        textPrimary: '#212529',
        textSecondary: '#495057',
        textMuted: 'rgba(73, 80, 87, 0.5)',
        textTime: 'rgba(73, 80, 87, 0.7)',
        ringBg: 'rgba(173, 181, 189, 0.3)',
        ringHour: { start: '#ffc6ff', mid: '#e7c6ff', end: '#c8b6ff' },
        ringMinute: { start: '#bdb2ff', mid: '#a0c4ff', end: '#9bf6ff' },
        ringSecond: { start: '#a0c4ff', mid: '#9bf6ff', end: '#caffbf' },
        ringMs: { start: '#caffbf', mid: '#a7f3d0', end: '#6ee7b7' }
    }
};

// Current theme
let currentTheme = 'classic';

/**
 * Apply a theme to the page
 * @param {string} themeName - Name of the theme to apply
 */
function applyTheme(themeName) {
    const theme = THEMES[themeName];
    if (!theme) {
        console.error(`Theme "${themeName}" not found`);
        return;
    }

    const root = document.documentElement;

    // Apply CSS variables
    root.style.setProperty('--bg-primary', theme.bgPrimary);
    root.style.setProperty('--bg-secondary', theme.bgSecondary);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--text-muted', theme.textMuted);
    root.style.setProperty('--text-time', theme.textTime);
    root.style.setProperty('--ring-bg', theme.ringBg);

    // Hour ring
    root.style.setProperty('--ring-hour-start', theme.ringHour.start);
    root.style.setProperty('--ring-hour-mid', theme.ringHour.mid);
    root.style.setProperty('--ring-hour-end', theme.ringHour.end);

    // Minute ring
    root.style.setProperty('--ring-minute-start', theme.ringMinute.start);
    root.style.setProperty('--ring-minute-mid', theme.ringMinute.mid);
    root.style.setProperty('--ring-minute-end', theme.ringMinute.end);

    // Second ring
    root.style.setProperty('--ring-second-start', theme.ringSecond.start);
    root.style.setProperty('--ring-second-mid', theme.ringSecond.mid);
    root.style.setProperty('--ring-second-end', theme.ringSecond.end);

    // MS ring
    root.style.setProperty('--ring-ms-start', theme.ringMs.start);
    root.style.setProperty('--ring-ms-mid', theme.ringMs.mid);
    root.style.setProperty('--ring-ms-end', theme.ringMs.end);

    // Update SVG gradients
    updateSVGGradients(theme);

    // Update current theme
    currentTheme = themeName;

    // Save to localStorage
    saveSettings();

    // Update URL with new theme
    updateURL();

    // Update active theme option in UI
    updateThemeUI(themeName);
}

/**
 * Update SVG gradient definitions with theme colors
 * @param {Object} theme - Theme object
 */
function updateSVGGradients(theme) {
    // Hour gradient
    const hourGradient = document.getElementById('hourGradient');
    if (hourGradient) {
        hourGradient.children[0].setAttribute('style', `stop-color:${theme.ringHour.start};stop-opacity:1`);
        hourGradient.children[1].setAttribute('style', `stop-color:${theme.ringHour.mid};stop-opacity:1`);
    }

    // Minute gradient
    const minuteGradient = document.getElementById('minuteGradient');
    if (minuteGradient) {
        minuteGradient.children[0].setAttribute('style', `stop-color:${theme.ringMinute.start};stop-opacity:1`);
        minuteGradient.children[1].setAttribute('style', `stop-color:${theme.ringMinute.mid};stop-opacity:1`);
    }

    // Second gradient
    const secondGradient = document.getElementById('secondGradient');
    if (secondGradient) {
        secondGradient.children[0].setAttribute('style', `stop-color:${theme.ringSecond.start};stop-opacity:1`);
        secondGradient.children[1].setAttribute('style', `stop-color:${theme.ringSecond.mid};stop-opacity:1`);
    }

    // MS gradient
    const msGradient = document.getElementById('msGradient');
    if (msGradient) {
        msGradient.children[0].setAttribute('style', `stop-color:${theme.ringMs.start};stop-opacity:1`);
        msGradient.children[1].setAttribute('style', `stop-color:${theme.ringMs.mid};stop-opacity:1`);
    }
}

/**
 * Update theme UI to reflect active theme
 * @param {string} themeName - Name of the active theme
 */
function updateThemeUI(themeName) {
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        const isActive = option.dataset.theme === themeName;
        option.classList.toggle('active', isActive);
        option.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
}

/**
 * Get theme from URL query parameter
 * @returns {string|null} Theme name from URL or null
 */
function getThemeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme');
    return (theme && THEMES[theme]) ? theme : null;
}

/**
 * Update URL with current theme (without page reload)
 */
function updateURL() {
    const url = new URL(window.location.href);
    url.searchParams.set('theme', currentTheme);
    window.history.replaceState({}, '', url);
}

/**
 * Copy shareable URL to clipboard
 */
async function copyShareURL() {
    const url = new URL(window.location.href);
    url.searchParams.set('theme', currentTheme);
    const shareURL = url.toString();

    try {
        await navigator.clipboard.writeText(shareURL);
        showCopyFeedback(true);
    } catch (error) {
        console.error('Failed to copy URL:', error);
        showCopyFeedback(false);
    }
}

/**
 * Show visual feedback for URL copy action
 * @param {boolean} success - Whether the copy was successful
 */
function showCopyFeedback(success) {
    const btn = document.getElementById('shareUrlBtn');
    const textSpan = btn.querySelector('.share-text');
    const originalText = textSpan.textContent;

    textSpan.textContent = success ? 'Copied!' : 'Failed';
    btn.style.background = success
        ? 'linear-gradient(135deg, rgba(67, 233, 123, 0.3) 0%, rgba(56, 249, 215, 0.3) 100%)'
        : 'linear-gradient(135deg, rgba(255, 107, 129, 0.3) 0%, rgba(255, 64, 87, 0.3) 100%)';

    setTimeout(() => {
        textSpan.textContent = originalText;
        btn.style.background = '';
    }, 2000);
}

/**
 * Save settings to localStorage
 */
function saveSettings() {
    const settings = {
        theme: currentTheme
    };
    localStorage.setItem('ringClockSettings', JSON.stringify(settings));
}

/**
 * Load settings from URL params (priority) or localStorage
 */
function loadSettings() {
    try {
        // Check URL params first (higher priority)
        const urlTheme = getThemeFromURL();
        if (urlTheme) {
            applyTheme(urlTheme);
            return;
        }

        // Fallback to localStorage
        const saved = localStorage.getItem('ringClockSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            if (settings.theme && THEMES[settings.theme]) {
                applyTheme(settings.theme);
                return;
            }
        }

        // If no URL param or localStorage, use default theme and update URL
        updateURL();
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

/**
 * Initialize settings UI event listeners
 */
function initSettingsUI() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeBtn = document.getElementById('closeBtn');
    const themeOptions = document.querySelectorAll('.theme-option');
    const shareUrlBtn = document.getElementById('shareUrlBtn');

    // Open modal
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
        // Focus first theme option for accessibility
        document.querySelector('.theme-option').focus();
    });

    // Close modal
    const closeModal = () => {
        settingsModal.classList.remove('active');
        settingsBtn.focus(); // Return focus to settings button
    };

    closeBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Theme selection
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const themeName = option.dataset.theme;
            applyTheme(themeName);
        });

        // Keyboard support
        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const themeName = option.dataset.theme;
                applyTheme(themeName);
            }
        });
    });

    // Share URL button
    shareUrlBtn.addEventListener('click', () => {
        copyShareURL();
    });
}

// ==================== FULLSCREEN SYSTEM ====================

/**
 * Toggle fullscreen mode
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // Enter fullscreen
        document.documentElement.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
    } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

/**
 * Handle fullscreen change events
 */
function handleFullscreenChange() {
    const fullscreenHint = document.getElementById('fullscreenHint');
    const settingsBtn = document.getElementById('settingsBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    if (document.fullscreenElement) {
        // Entered fullscreen
        fullscreenHint.classList.add('active');
        settingsBtn.classList.add('hidden');
        fullscreenBtn.setAttribute('aria-label', 'Exit fullscreen');

        // Auto-hide hint after 3 seconds
        setTimeout(() => {
            fullscreenHint.classList.remove('active');
        }, 3000);
    } else {
        // Exited fullscreen
        fullscreenHint.classList.remove('active');
        settingsBtn.classList.remove('hidden');
        fullscreenBtn.setAttribute('aria-label', 'Toggle fullscreen');
    }
}

/**
 * Initialize fullscreen functionality
 */
function initFullscreen() {
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    // Toggle fullscreen on button click
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Listen for fullscreen changes (including ESC key)
    document.addEventListener('fullscreenchange', handleFullscreenChange);
}

// ==================== CLOCK SYSTEM ====================

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
    // Get current theme colors
    const theme = THEMES[currentTheme];

    // Map type to theme ring property
    const ringMap = {
        hour: 'ringHour',
        minute: 'ringMinute',
        second: 'ringSecond',
        ms: 'ringMs'
    };

    const ringColors = theme[ringMap[type]];

    // Convert hex colors to RGB arrays
    const colorPalettes = {
        [type]: [
            hexToRgb(ringColors.start),
            hexToRgb(ringColors.mid),
            hexToRgb(ringColors.end)
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
 * Convert hex color to RGB array
 * @param {string} hex - Hex color string (e.g. "#667eea")
 * @returns {Array} RGB array [r, g, b]
 */
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];
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
    // Initialize settings system
    initSettingsUI();
    loadSettings(); // Load saved theme from localStorage

    // Initialize fullscreen
    initFullscreen();

    // Initialize clock
    initializeRings();
    updateClock();
}

// Start the clock when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
