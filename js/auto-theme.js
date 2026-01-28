/**
 * Auto Theme Switching System
 * Feature: Automatically switch themes based on time of day
 * Research: 24 Hour Wallpaper proves users love time-synced visuals
 * Revenue: +$1.99 premium feature or bundle upgrade
 */

// Time-based theme schedule
const THEME_SCHEDULE = {
    morning: {
        hours: [6, 7, 8, 9, 10, 11],
        free: 'warm',          // Warm Sunset
        premium: 'desertDawn', // Desert Dawn (Nature Pack)
        description: '🌅 Morning themes'
    },
    afternoon: {
        hours: [12, 13, 14, 15, 16, 17],
        free: 'ocean',         // Ocean Breeze
        premium: 'classic',    // Classic (fallback)
        description: '☀️ Afternoon themes'
    },
    evening: {
        hours: [18, 19, 20, 21],
        free: 'pastel',        // Soft Pastel
        premium: 'forestTwilight', // Forest Twilight (Nature Pack)
        description: '🌙 Evening themes'
    },
    night: {
        hours: [22, 23, 0, 1, 2, 3, 4, 5],
        free: 'neon',          // Neon Night
        premium: 'midnightMarble', // Midnight Marble (Luxury Pack)
        description: '🌃 Night themes'
    }
};

// Auto-theme settings
let autoThemeEnabled = false;
let lastAutoSwitchHour = -1;
let checkInterval = null;

/**
 * Initialize auto-theme system
 */
function initAutoTheme() {
    // Load settings
    loadAutoThemeSettings();

    // If auto-theme is enabled, start checking
    if (autoThemeEnabled) {
        startAutoTheme();
    }

    console.log('✅ Auto-theme system initialized', { enabled: autoThemeEnabled });
}

/**
 * Get time period for current hour
 */
function getTimePeriod(hour) {
    for (const [period, config] of Object.entries(THEME_SCHEDULE)) {
        if (config.hours.includes(hour)) {
            return { period, ...config };
        }
    }
    // Fallback to morning
    return { period: 'morning', ...THEME_SCHEDULE.morning };
}

/**
 * Get theme ID for current time
 * @param {boolean} usePremium - Whether to use premium themes if available
 */
function getThemeForCurrentTime(usePremium = true) {
    const hour = new Date().getHours();
    const timePeriod = getTimePeriod(hour);

    // Check if premium theme is unlocked (if we want to use it)
    if (usePremium && timePeriod.premium) {
        // Check if premium theme is unlocked
        if (typeof isThemeUnlocked === 'function') {
            // Find theme object to check pack
            const premiumTheme = PREMIUM_THEMES.find(t => t.id === timePeriod.premium);
            if (premiumTheme && isThemeUnlocked(premiumTheme.id)) {
                return timePeriod.premium;
            }
        }
    }

    // Use free theme
    return timePeriod.free;
}

/**
 * Check and switch theme if needed
 */
function checkAndSwitchTheme() {
    if (!autoThemeEnabled) {
        return;
    }

    const currentHour = new Date().getHours();

    // Only switch if hour has changed
    if (currentHour === lastAutoSwitchHour) {
        return;
    }

    const targetTheme = getThemeForCurrentTime(true);
    const currentTheme = getCurrentTheme();

    // Only switch if different
    if (targetTheme !== currentTheme) {
        console.log('🎨 Auto-switching theme:', currentTheme, '→', targetTheme);
        applyTheme(targetTheme);
        lastAutoSwitchHour = currentHour;
    }
}

/**
 * Start auto-theme checking
 */
function startAutoTheme() {
    if (checkInterval) {
        clearInterval(checkInterval);
    }

    // Check immediately
    checkAndSwitchTheme();

    // Check every minute (to catch hour changes quickly)
    checkInterval = setInterval(checkAndSwitchTheme, 60000);

    console.log('🔄 Auto-theme started');
}

/**
 * Stop auto-theme checking
 */
function stopAutoTheme() {
    if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
    }
    console.log('⏸️ Auto-theme stopped');
}

/**
 * Enable auto-theme
 */
function enableAutoTheme() {
    autoThemeEnabled = true;
    saveAutoThemeSettings();
    startAutoTheme();
}

/**
 * Disable auto-theme
 */
function disableAutoTheme() {
    autoThemeEnabled = false;
    saveAutoThemeSettings();
    stopAutoTheme();
}

/**
 * Toggle auto-theme on/off
 */
function toggleAutoTheme() {
    if (autoThemeEnabled) {
        disableAutoTheme();
    } else {
        enableAutoTheme();
    }
    return autoThemeEnabled;
}

/**
 * Get current auto-theme status
 */
function isAutoThemeEnabled() {
    return autoThemeEnabled;
}

/**
 * Get schedule preview for UI
 */
function getSchedulePreview() {
    const preview = [];
    for (const [period, config] of Object.entries(THEME_SCHEDULE)) {
        const hourRange = `${config.hours[0]}:00-${config.hours[config.hours.length - 1]}:59`;
        preview.push({
            period,
            hours: hourRange,
            theme: config.free,
            premiumTheme: config.premium,
            description: config.description
        });
    }
    return preview;
}

/**
 * Load auto-theme settings from localStorage
 */
function loadAutoThemeSettings() {
    try {
        const settings = loadFromStorage('AutoThemeSettings', {
            enabled: false,
            lastSwitchHour: -1
        });
        autoThemeEnabled = settings.enabled;
        lastAutoSwitchHour = settings.lastSwitchHour;
    } catch (error) {
        console.error('Error loading auto-theme settings:', error);
    }
}

/**
 * Save auto-theme settings to localStorage
 */
function saveAutoThemeSettings() {
    try {
        saveToStorage('AutoThemeSettings', {
            enabled: autoThemeEnabled,
            lastSwitchHour: lastAutoSwitchHour
        });
    } catch (error) {
        console.error('Error saving auto-theme settings:', error);
    }
}

/**
 * Get current theme (helper function)
 * Uses theme.js getCurrentTheme() if available
 */
function getCurrentTheme() {
    if (typeof window.currentTheme !== 'undefined') {
        return window.currentTheme;
    }
    // Fallback: read from localStorage
    try {
        const settings = JSON.parse(localStorage.getItem('ringClockSettings') || '{}');
        return settings.theme || 'classic';
    } catch {
        return 'classic';
    }
}
