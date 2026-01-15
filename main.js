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

// Time format (12h or 24h)
let timeFormat = '24h';

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
        theme: currentTheme,
        timeFormat: timeFormat
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
        }

        // Fallback to localStorage
        const saved = localStorage.getItem('ringClockSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            if (settings.theme && THEMES[settings.theme] && !urlTheme) {
                applyTheme(settings.theme);
            }
            if (settings.timeFormat) {
                applyTimeFormat(settings.timeFormat);
            }
        }

        // If no URL param, update URL
        if (!urlTheme) {
            updateURL();
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

/**
 * Apply time format setting
 * @param {string} format - Time format ('12h' or '24h')
 */
function applyTimeFormat(format) {
    timeFormat = format;

    // Update UI - activate correct button
    const formatBtns = document.querySelectorAll('.format-btn');
    formatBtns.forEach(btn => {
        if (btn.dataset.format === format) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Re-render alarm markers with new time format
    const now = new Date();
    renderAlarmMarkers(now.getHours(), now.getMinutes(), now.getSeconds());
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

    // Time format toggle
    const formatBtns = document.querySelectorAll('.format-btn');
    formatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const format = btn.dataset.format;
            applyTimeFormat(format);
            saveSettings();
        });
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

    // Calculate display hours based on format
    let displayHours = hours;
    let period = '';

    if (timeFormat === '12h') {
        period = hours >= 12 ? 'PM' : 'AM';
        displayHours = hours % 12 || 12; // Convert 0 to 12 for midnight
    }

    // Calculate fractional progress for smooth water-like flow
    // Each unit includes fractional parts of smaller units to prevent jumps
    const msProgress = milliseconds / MS_IN_SECOND;
    const secondProgress = (seconds + msProgress) / SECONDS_IN_MINUTE;
    const minuteProgress = (minutes + secondProgress) / MINUTES_IN_HOUR;

    // Hour progress depends on format
    const hoursInCycle = timeFormat === '12h' ? 12 : HOURS_IN_DAY;
    const hourProgress = ((hours % hoursInCycle) + minuteProgress) / hoursInCycle;

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
    hourValue.textContent = padZero(displayHours);
    minuteValue.textContent = padZero(minutes);
    secondValue.textContent = padZero(seconds);
    msValue.textContent = padZero(milliseconds, 3);

    // Update accessible text time
    const timeStr = timeFormat === '12h'
        ? `${padZero(displayHours)}:${padZero(minutes)}:${padZero(seconds)}.${padZero(milliseconds, 3)} ${period}`
        : `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}.${padZero(milliseconds, 3)}`;
    textTime.textContent = timeStr;

    // Render alarm markers on clock rings
    renderAlarmMarkers(hours, minutes, seconds);

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

    // Initialize PWA
    initPWA();

    // Initialize alarm system
    initAlarmSystem();

    // Initialize world clock system
    initWorldClockSystem();

    // Initialize stopwatch system
    initStopwatchSystem();

    // Initialize clock
    initializeRings();
    updateClock();
}

// ==================== PWA SYSTEM ====================

/**
 * Register service worker and handle PWA installation
 */
function initPWA() {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
        // Register service worker
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('[PWA] Service Worker registered:', registration.scope);

                    // Check for updates periodically
                    setInterval(() => {
                        registration.update();
                    }, 60000); // Check every minute
                })
                .catch((error) => {
                    console.error('[PWA] Service Worker registration failed:', error);
                });
        });

        // Listen for service worker updates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[PWA] New service worker activated');
        });
    }

    // Handle PWA install prompt
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[PWA] Install prompt available');
        // Prevent the default install prompt
        e.preventDefault();
        // Store the event for later use
        deferredPrompt = e;

        // Show custom install UI (optional - can be added later)
        // For now, just log that installation is available
        console.log('[PWA] App can be installed');
    });

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] App installed successfully');
        deferredPrompt = null;
    });

    // Detect if running as PWA (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
        console.log('[PWA] Running in standalone mode');
        document.body.classList.add('pwa-standalone');
    }
}

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

// ==================== WORLD CLOCK SYSTEM ====================

// Major cities with IANA timezone identifiers
const WORLD_CITIES = [
    { name: 'Seoul', timezone: 'Asia/Seoul', country: 'South Korea' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan' },
    { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'Hong Kong' },
    { name: 'Singapore', timezone: 'Asia/Singapore', country: 'Singapore' },
    { name: 'Shanghai', timezone: 'Asia/Shanghai', country: 'China' },
    { name: 'Dubai', timezone: 'Asia/Dubai', country: 'UAE' },
    { name: 'Mumbai', timezone: 'Asia/Kolkata', country: 'India' },
    { name: 'Moscow', timezone: 'Europe/Moscow', country: 'Russia' },
    { name: 'Istanbul', timezone: 'Europe/Istanbul', country: 'Turkey' },
    { name: 'Paris', timezone: 'Europe/Paris', country: 'France' },
    { name: 'London', timezone: 'Europe/London', country: 'UK' },
    { name: 'Berlin', timezone: 'Europe/Berlin', country: 'Germany' },
    { name: 'New York', timezone: 'America/New_York', country: 'USA' },
    { name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'USA' },
    { name: 'Chicago', timezone: 'America/Chicago', country: 'USA' },
    { name: 'Toronto', timezone: 'America/Toronto', country: 'Canada' },
    { name: 'Mexico City', timezone: 'America/Mexico_City', country: 'Mexico' },
    { name: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'Brazil' },
    { name: 'Sydney', timezone: 'Australia/Sydney', country: 'Australia' },
    { name: 'Auckland', timezone: 'Pacific/Auckland', country: 'New Zealand' }
];

// World clocks storage
let worldClocks = [];
let worldClockUpdateInterval = null;

/**
 * Initialize World Clock system
 */
function initWorldClockSystem() {
    // Populate city dropdown
    const citySelect = document.getElementById('citySelect');
    WORLD_CITIES.forEach(city => {
        const option = document.createElement('option');
        option.value = city.timezone;
        option.textContent = `${city.name} (${city.country})`;
        option.dataset.cityName = city.name;
        option.dataset.country = city.country;
        citySelect.appendChild(option);
    });

    // Load saved world clocks
    loadWorldClocks();

    // Modal open/close
    const worldClockBtn = document.getElementById('worldClockBtn');
    const worldClockModal = document.getElementById('worldClockModal');
    const worldClockCloseBtn = document.getElementById('worldClockCloseBtn');

    worldClockBtn.addEventListener('click', () => {
        worldClockModal.classList.add('show');
        updateWorldClocks(); // Update times when modal opens
    });

    worldClockCloseBtn.addEventListener('click', () => {
        worldClockModal.classList.remove('show');
    });

    worldClockModal.addEventListener('click', (e) => {
        if (e.target === worldClockModal) {
            worldClockModal.classList.remove('show');
        }
    });

    // Add city button
    const addCityBtn = document.getElementById('addCityBtn');
    addCityBtn.addEventListener('click', () => {
        const selectedOption = citySelect.options[citySelect.selectedIndex];
        if (citySelect.value && selectedOption) {
            addWorldClock(
                citySelect.value,
                selectedOption.dataset.cityName,
                selectedOption.dataset.country
            );
            citySelect.selectedIndex = 0; // Reset selection
        }
    });

    // Start auto-update (every second)
    worldClockUpdateInterval = setInterval(updateWorldClocks, 1000);
}

/**
 * Add a new world clock
 * @param {string} timezone - IANA timezone identifier
 * @param {string} cityName - City name
 * @param {string} country - Country name
 */
function addWorldClock(timezone, cityName, country) {
    // Check if already exists
    if (worldClocks.some(clock => clock.timezone === timezone)) {
        alert(`${cityName} is already added`);
        return;
    }

    const clock = {
        id: Date.now().toString(),
        timezone,
        cityName,
        country
    };

    worldClocks.push(clock);
    saveWorldClocks();
    renderWorldClocks();
}

/**
 * Delete a world clock
 * @param {string} id - Clock ID
 */
function deleteWorldClock(id) {
    worldClocks = worldClocks.filter(clock => clock.id !== id);
    saveWorldClocks();
    renderWorldClocks();
}

/**
 * Render world clocks list
 */
function renderWorldClocks() {
    const worldClockList = document.getElementById('worldClockList');
    const emptyState = document.getElementById('emptyWorldClockState');

    if (worldClocks.length === 0) {
        emptyState.style.display = 'block';
        worldClockList.querySelectorAll('.clock-card').forEach(card => card.remove());
        return;
    }

    emptyState.style.display = 'none';

    // Remove old cards
    worldClockList.querySelectorAll('.clock-card').forEach(card => card.remove());

    // Create new cards
    worldClocks.forEach(clock => {
        const card = createClockCard(clock);
        worldClockList.appendChild(card);
    });

    // Update times immediately
    updateWorldClocks();
}

/**
 * Create a clock card element
 * @param {Object} clock - Clock data
 * @returns {HTMLElement} Clock card element
 */
function createClockCard(clock) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.dataset.clockId = clock.id;
    card.dataset.timezone = clock.timezone;

    card.innerHTML = `
        <div class="clock-info">
            <div class="clock-city">${clock.cityName}</div>
            <div class="clock-time" data-clock-time>--:--:--</div>
            <div class="clock-date" data-clock-date>---</div>
            <div class="clock-offset" data-clock-offset>UTC --</div>
        </div>
        <div class="clock-actions">
            <button class="delete-clock-btn" aria-label="Delete ${clock.cityName}">
                🗑️
            </button>
        </div>
    `;

    // Delete button
    const deleteBtn = card.querySelector('.delete-clock-btn');
    deleteBtn.addEventListener('click', () => {
        deleteWorldClock(clock.id);
    });

    return card;
}

/**
 * Update all world clock times
 */
function updateWorldClocks() {
    const cards = document.querySelectorAll('.clock-card');

    cards.forEach(card => {
        const timezone = card.dataset.timezone;
        const timeElement = card.querySelector('[data-clock-time]');
        const dateElement = card.querySelector('[data-clock-date]');
        const offsetElement = card.querySelector('[data-clock-offset]');

        try {
            // Get current time in the timezone
            const now = new Date();

            // Format time
            const timeFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
            const formattedTime = timeFormatter.format(now);
            timeElement.textContent = formattedTime;

            // Format date
            const dateFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            const formattedDate = dateFormatter.format(now);
            dateElement.textContent = formattedDate;

            // Calculate UTC offset
            const timezoneFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                timeZoneName: 'shortOffset'
            });
            const parts = timezoneFormatter.formatToParts(now);
            const offsetPart = parts.find(part => part.type === 'timeZoneName');
            const offset = offsetPart ? offsetPart.value : 'UTC';
            offsetElement.textContent = offset;
        } catch (error) {
            console.error(`Error updating time for timezone ${timezone}:`, error);
            timeElement.textContent = 'Error';
            dateElement.textContent = 'Invalid timezone';
            offsetElement.textContent = '';
        }
    });
}

/**
 * Save world clocks to localStorage
 */
function saveWorldClocks() {
    try {
        localStorage.setItem('ringClockWorldClocks', JSON.stringify(worldClocks));
    } catch (error) {
        console.error('Error saving world clocks:', error);
    }
}

/**
 * Load world clocks from localStorage
 */
function loadWorldClocks() {
    try {
        const saved = localStorage.getItem('ringClockWorldClocks');
        if (saved) {
            worldClocks = JSON.parse(saved);
            renderWorldClocks();
        }
    } catch (error) {
        console.error('Error loading world clocks:', error);
        worldClocks = [];
    }
}

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

    // Open stopwatch modal
    stopwatchBtn.addEventListener('click', () => {
        stopwatchModal.classList.add('show');
        if (stopwatchRunning) {
            startStopwatchAnimation();
        }
    });

    // Close stopwatch modal
    stopwatchCloseBtn.addEventListener('click', () => {
        stopwatchModal.classList.remove('show');
    });

    // Close on backdrop click
    stopwatchModal.addEventListener('click', (e) => {
        if (e.target === stopwatchModal) {
            stopwatchModal.classList.remove('show');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && stopwatchModal.classList.contains('show')) {
            stopwatchModal.classList.remove('show');
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

// Start the clock when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
