// ==================== UTILITY FUNCTIONS ====================

/**
 * Convert hex color to RGB array
 * @param {string} hex - Hex color string (e.g. "#667eea")
 * @returns {Array} RGB array [r, g, b]
 */
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return [r, g, b];
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
 * Format number with leading zeros
 * @param {number} num - The number to format
 * @param {number} digits - Number of digits
 * @returns {string} Formatted string
 */
function padZero(num, digits = 2) {
    return String(num).padStart(digits, '0');
}

/**
 * Calculate the circumference of a circle given its radius
 * @param {number} radius - The radius of the circle
 * @returns {number} The circumference
 */
function getCircumference(radius) {
    return 2 * Math.PI * radius;
}

/**
 * Get target color based on progress through palette
 * @param {Array} palette - Color palette array
 * @param {number} progress - Progress from 0 to 1
 * @returns {Array} Target RGB color [r, g, b]
 */
function getTargetColor(palette, progress) {
    if (progress < 0.5) {
        return interpolateColor(palette[0], palette[1], progress * 2);
    } else {
        return interpolateColor(palette[1], palette[2], (progress - 0.5) * 2);
    }
}
