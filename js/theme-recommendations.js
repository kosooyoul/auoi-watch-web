/**
 * AI Theme Recommendations System
 * Feature: Analyze user behavior and recommend optimal themes
 * Research: Netflix, Spotify prove personalized recommendations increase engagement
 * Revenue: $0 (engagement booster - increases time on app, theme sales)
 */

// Recommendation state
let usagePatterns = {
    hourlyUsage: {}, // { hour: count }
    themeSelections: [], // [{ theme: 'warm', time: timestamp, hour: 14 }]
    focusSessions: [], // [{ startTime: timestamp, duration: ms, hour: 14 }]
    lastRecommendationTime: null
};

// Theme metadata for recommendations
const THEME_METADATA = {
    // Free themes
    classic: { energy: 'moderate', time: 'night', focus: 'high', mood: 'balanced' },
    warm: { energy: 'moderate', time: 'evening', focus: 'medium', mood: 'warm' },
    ocean: { energy: 'calm', time: 'afternoon', focus: 'high', mood: 'focused' },
    neon: { energy: 'vibrant', time: 'night', focus: 'medium', mood: 'energetic' },
    pastel: { energy: 'soft', time: 'day', focus: 'low', mood: 'gentle' },

    // Luxury Pack
    goldenHour: { energy: 'warm', time: 'evening', focus: 'medium', mood: 'luxurious' },
    midnightMarble: { energy: 'calm', time: 'night', focus: 'high', mood: 'sophisticated' },
    roseGoldElegance: { energy: 'soft', time: 'evening', focus: 'medium', mood: 'elegant' },

    // Nature Pack
    forestTwilight: { energy: 'calm', time: 'evening', focus: 'high', mood: 'natural' },
    oceanDepths: { energy: 'calm', time: 'night', focus: 'high', mood: 'deep' },
    desertDawn: { energy: 'moderate', time: 'morning', focus: 'medium', mood: 'adventurous' },

    // Neon Pack
    cyberpunkMagenta: { energy: 'vibrant', time: 'night', focus: 'medium', mood: 'electric' },
    electricLime: { energy: 'vibrant', time: 'day', focus: 'high', mood: 'energetic' },
    neonUltraviolet: { energy: 'vibrant', time: 'night', focus: 'high', mood: 'futuristic' },

    // Professional Pack
    corporateBlue: { energy: 'moderate', time: 'day', focus: 'high', mood: 'professional' },
    executiveGray: { energy: 'calm', time: 'day', focus: 'high', mood: 'sophisticated' },
    businessGreen: { energy: 'moderate', time: 'day', focus: 'high', mood: 'productive' },
    presentationDark: { energy: 'calm', time: 'day', focus: 'high', mood: 'clear' },
    officeNeutral: { energy: 'moderate', time: 'day', focus: 'high', mood: 'comfortable' }
};

// Time period definitions
const TIME_PERIODS = {
    morning: { hours: [6, 7, 8, 9, 10, 11], label: 'Morning' },
    afternoon: { hours: [12, 13, 14, 15, 16, 17], label: 'Afternoon' },
    evening: { hours: [18, 19, 20, 21], label: 'Evening' },
    night: { hours: [22, 23, 0, 1, 2, 3, 4, 5], label: 'Night' }
};

// DOM elements
let recommendationsContainer;
let recommendationsContent;
let refreshRecommendationsBtn;

/**
 * Initialize theme recommendations system
 */
function initThemeRecommendations() {
    // Get DOM elements
    recommendationsContainer = document.getElementById('themeRecommendationsContainer');
    recommendationsContent = document.getElementById('recommendationsContent');
    refreshRecommendationsBtn = document.getElementById('refreshRecommendationsBtn');

    if (!recommendationsContainer) {
        console.warn('Theme recommendations UI not found');
        return;
    }

    // Load usage patterns
    loadUsagePatterns();

    // Track current usage
    trackUsage();

    // Generate and display recommendations
    updateRecommendations();

    // Setup event listeners
    if (refreshRecommendationsBtn) {
        refreshRecommendationsBtn.addEventListener('click', () => {
            updateRecommendations();
        });
    }

    // Update recommendations daily
    setInterval(() => {
        const now = Date.now();
        const lastUpdate = usagePatterns.lastRecommendationTime || 0;
        const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);

        if (daysSinceUpdate >= 1) {
            updateRecommendations();
        }
    }, 1000 * 60 * 60); // Check every hour

    console.log('✅ Theme recommendations system initialized');
}

/**
 * Track current app usage
 */
function trackUsage() {
    const hour = new Date().getHours();

    // Increment hourly usage count
    if (!usagePatterns.hourlyUsage[hour]) {
        usagePatterns.hourlyUsage[hour] = 0;
    }
    usagePatterns.hourlyUsage[hour]++;

    // Save patterns
    saveUsagePatterns();
}

/**
 * Track theme selection (call this when user manually changes theme)
 * @param {string} themeName - Name of the selected theme
 */
function trackThemeSelection(themeName) {
    const now = Date.now();
    const hour = new Date().getHours();

    usagePatterns.themeSelections.push({
        theme: themeName,
        time: now,
        hour: hour
    });

    // Keep only last 50 selections
    if (usagePatterns.themeSelections.length > 50) {
        usagePatterns.themeSelections = usagePatterns.themeSelections.slice(-50);
    }

    saveUsagePatterns();
}

/**
 * Track focus session completion
 * @param {number} duration - Duration in milliseconds
 */
function trackFocusSession(duration) {
    const now = Date.now();
    const hour = new Date().getHours();

    usagePatterns.focusSessions.push({
        startTime: now - duration,
        duration: duration,
        hour: hour
    });

    // Keep only last 30 sessions
    if (usagePatterns.focusSessions.length > 30) {
        usagePatterns.focusSessions = usagePatterns.focusSessions.slice(-30);
    }

    saveUsagePatterns();
}

/**
 * Generate theme recommendations based on usage patterns
 * @returns {Array} Array of recommendation objects
 */
function generateRecommendations() {
    const recommendations = [];

    // Analyze most active time periods
    const mostActiveTimePeriod = getMostActiveTimePeriod();

    // Analyze focus session patterns
    const focusHours = getFocusHours();

    // Analyze favorite themes
    const favoriteThemes = getFavoriteThemes();

    // Recommendation 1: Based on most active time period
    if (mostActiveTimePeriod) {
        const timeBasedThemes = getThemesForTimePeriod(mostActiveTimePeriod);
        const themeForTime = timeBasedThemes.filter(t => !favoriteThemes.includes(t))[0];

        if (themeForTime) {
            recommendations.push({
                theme: themeForTime,
                reason: `Perfect for ${TIME_PERIODS[mostActiveTimePeriod].label.toLowerCase()} when you're most active`,
                type: 'time-based',
                score: 10
            });
        }
    }

    // Recommendation 2: Based on focus sessions
    if (focusHours.length > 0) {
        const focusPeriod = getTimePeriodForHour(focusHours[0]);
        const focusThemes = getThemesForFocus();
        const focusTheme = focusThemes.filter(t =>
            !favoriteThemes.includes(t) &&
            !recommendations.find(r => r.theme === t)
        )[0];

        if (focusTheme) {
            recommendations.push({
                theme: focusTheme,
                reason: `Enhances focus during your productive ${TIME_PERIODS[focusPeriod]?.label?.toLowerCase() || 'time'}`,
                type: 'focus-based',
                score: 9
            });
        }
    }

    // Recommendation 3: Discover new themes (not used before)
    const allAvailableThemes = Object.keys(THEME_METADATA);
    const unusedThemes = allAvailableThemes.filter(t => !favoriteThemes.includes(t));

    if (unusedThemes.length > 0) {
        const discoverTheme = unusedThemes[Math.floor(Math.random() * unusedThemes.length)];
        const metadata = THEME_METADATA[discoverTheme];

        recommendations.push({
            theme: discoverTheme,
            reason: `New ${metadata.mood} ${metadata.energy} theme to discover`,
            type: 'discovery',
            score: 7
        });
    }

    // Fallback: If no recommendations, suggest popular themes
    if (recommendations.length === 0) {
        recommendations.push({
            theme: 'dark',
            reason: 'Popular choice for reduced eye strain',
            type: 'popular',
            score: 5
        });
    }

    // Limit to top 3 recommendations
    return recommendations.slice(0, 3);
}

/**
 * Get most active time period based on usage
 * @returns {string|null} Time period key or null
 */
function getMostActiveTimePeriod() {
    const periodCounts = {};

    // Count usage per period
    Object.keys(TIME_PERIODS).forEach(period => {
        periodCounts[period] = 0;
        TIME_PERIODS[period].hours.forEach(hour => {
            periodCounts[period] += usagePatterns.hourlyUsage[hour] || 0;
        });
    });

    // Find period with most usage
    let maxPeriod = null;
    let maxCount = 0;

    Object.keys(periodCounts).forEach(period => {
        if (periodCounts[period] > maxCount) {
            maxCount = periodCounts[period];
            maxPeriod = period;
        }
    });

    return maxPeriod;
}

/**
 * Get hours when user focuses most
 * @returns {Array} Array of hours
 */
function getFocusHours() {
    const hourCounts = {};

    usagePatterns.focusSessions.forEach(session => {
        const hour = session.hour;
        if (!hourCounts[hour]) {
            hourCounts[hour] = 0;
        }
        hourCounts[hour]++;
    });

    // Sort by count
    const sorted = Object.keys(hourCounts)
        .map(h => ({ hour: parseInt(h), count: hourCounts[h] }))
        .sort((a, b) => b.count - a.count);

    return sorted.map(item => item.hour);
}

/**
 * Get user's favorite themes
 * @returns {Array} Array of theme names
 */
function getFavoriteThemes() {
    const themeCounts = {};

    usagePatterns.themeSelections.forEach(selection => {
        if (!themeCounts[selection.theme]) {
            themeCounts[selection.theme] = 0;
        }
        themeCounts[selection.theme]++;
    });

    // Sort by count
    const sorted = Object.keys(themeCounts)
        .map(t => ({ theme: t, count: themeCounts[t] }))
        .sort((a, b) => b.count - a.count);

    return sorted.slice(0, 3).map(item => item.theme);
}

/**
 * Get themes suitable for a time period
 * @param {string} period - Time period key
 * @returns {Array} Array of theme names
 */
function getThemesForTimePeriod(period) {
    const themes = [];

    Object.keys(THEME_METADATA).forEach(theme => {
        const meta = THEME_METADATA[theme];
        if (meta.time === period || meta.time === TIME_PERIODS[period]?.label?.toLowerCase()) {
            themes.push(theme);
        }
    });

    // Fallback mapping
    if (themes.length === 0) {
        if (period === 'morning') themes.push('warm', 'light', 'mintFresh', 'desertDawn');
        if (period === 'afternoon') themes.push('cool', 'light', 'autumnLeaves');
        if (period === 'evening') themes.push('warm', 'sunset', 'lavender');
        if (period === 'night') themes.push('dark', 'deepOcean', 'neonCity', 'arcticAurora');
    }

    return themes;
}

/**
 * Get themes that enhance focus
 * @returns {Array} Array of theme names
 */
function getThemesForFocus() {
    const themes = [];

    Object.keys(THEME_METADATA).forEach(theme => {
        if (THEME_METADATA[theme].focus === 'high') {
            themes.push(theme);
        }
    });

    return themes.length > 0 ? themes : ['dark', 'cool', 'deepOcean', 'forestMist'];
}

/**
 * Get time period for a specific hour
 * @param {number} hour - Hour (0-23)
 * @returns {string} Time period key
 */
function getTimePeriodForHour(hour) {
    for (const period in TIME_PERIODS) {
        if (TIME_PERIODS[period].hours.includes(hour)) {
            return period;
        }
    }
    return 'night';
}

/**
 * Update recommendations display
 */
function updateRecommendations() {
    const recommendations = generateRecommendations();

    if (!recommendationsContent) return;

    // Render recommendations
    recommendationsContent.innerHTML = recommendations.map(rec => {
        const isPremium = !['dark', 'light', 'warm', 'cool'].includes(rec.theme);
        const lockIcon = isPremium ? '🔒' : '';

        return `
            <div class="recommendation-card">
                <div class="recommendation-theme-preview theme-preview-${rec.theme}"></div>
                <div class="recommendation-info">
                    <div class="recommendation-theme-name">
                        ${formatThemeName(rec.theme)} ${lockIcon}
                    </div>
                    <div class="recommendation-reason">${rec.reason}</div>
                    <button class="try-theme-btn" data-theme="${rec.theme}" ${isPremium && !isPremiumUser() ? 'disabled' : ''}>
                        ${isPremium && !isPremiumUser() ? 'Unlock Premium' : 'Try This Theme'}
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Add event listeners to Try buttons
    document.querySelectorAll('.try-theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            const isPremium = !['dark', 'light', 'warm', 'cool'].includes(theme);

            if (isPremium && !isPremiumUser()) {
                // Show payment modal or upgrade prompt
                alert('This is a premium theme. Upgrade to unlock!');
                return;
            }

            // Apply theme
            if (typeof applyTheme === 'function') {
                applyTheme(theme);
                trackThemeSelection(theme);
            }
        });
    });

    // Update timestamp
    usagePatterns.lastRecommendationTime = Date.now();
    saveUsagePatterns();

    console.log('📊 Recommendations updated:', recommendations);
}

/**
 * Format theme name for display
 * @param {string} themeName - Theme name
 * @returns {string} Formatted name
 */
function formatThemeName(themeName) {
    const formatted = themeName
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    return formatted;
}

/**
 * Check if user is premium
 * @returns {boolean}
 */
function isPremiumUser() {
    try {
        const purchases = JSON.parse(localStorage.getItem('PremiumPurchases') || '{}');
        return Object.keys(purchases).length > 0;
    } catch {
        return false;
    }
}

/**
 * Load usage patterns from localStorage
 */
function loadUsagePatterns() {
    try {
        const data = loadFromStorage('ThemeRecommendationsData', {
            hourlyUsage: {},
            themeSelections: [],
            focusSessions: [],
            lastRecommendationTime: null
        });
        usagePatterns = data;
    } catch (error) {
        console.error('Error loading usage patterns:', error);
    }
}

/**
 * Save usage patterns to localStorage
 */
function saveUsagePatterns() {
    try {
        saveToStorage('ThemeRecommendationsData', usagePatterns);
    } catch (error) {
        console.error('Error saving usage patterns:', error);
    }
}

/**
 * Export functions for use by other modules
 */
window.trackThemeSelection = trackThemeSelection;
window.trackFocusSession = trackFocusSession;
