/**
 * Circadian Rhythm Insights System
 * Feature: Track peak activity hours and suggest optimal focus times
 * Research: Sleep science + productivity apps prove circadian alignment boosts performance
 * Revenue: $4.99/year (premium analytics feature)
 */

// Activity data
let activityData = {
    hourlyActivity: {},  // { hour: activityCount }
    activityHistory: [], // [{ timestamp, hour, type: 'visit'|'focus'|'theme_change' }]
    lastAnalysisDate: null,
    insights: {
        peakHours: [],
        lowEnergyHours: [],
        suggestedFocusTime: null,
        suggestedBreakTime: null,
        productivity Score: 0
    }
};

// DOM elements
let insightsContainer;
let peakHoursDisplay;
let focusTimeDisplay;
let breakTimeDisplay;
let productivityScore;
let upgradeInsightsBtn;

/**
 * Initialize circadian insights system
 */
function initCircadianInsights() {
    // Get DOM elements
    insightsContainer = document.getElementById('circadianInsightsContainer');
    peakHoursDisplay = document.getElementById('peakHoursDisplay');
    focusTimeDisplay = document.getElementById('focusTimeDisplay');
    breakTimeDisplay = document.getElementById('breakTimeDisplay');
    productivityScore = document.getElementById('productivityScore');
    upgradeInsightsBtn = document.getElementById('upgradeInsightsBtn');

    if (!insightsContainer) {
        console.warn('Circadian insights UI not found');
        return;
    }

    // Load activity data
    loadActivityData();

    // Track current visit
    trackActivity('visit');

    // Analyze patterns and generate insights
    analyzeCircadianPatterns();

    // Update display
    updateInsightsDisplay();

    // Setup event listeners
    if (upgradeInsightsBtn) {
        upgradeInsightsBtn.addEventListener('click', () => {
            // Show payment modal or upgrade prompt
            alert('Upgrade to Premium for detailed circadian insights and personalized recommendations!');
        });
    }

    // Re-analyze daily
    setInterval(() => {
        const now = new Date();
        const lastAnalysis = activityData.lastAnalysisDate
            ? new Date(activityData.lastAnalysisDate)
            : null;

        const shouldAnalyze =
            !lastAnalysis ||
            now.getDate() !== lastAnalysis.getDate() ||
            now.getMonth() !== lastAnalysis.getMonth();

        if (shouldAnalyze) {
            analyzeCircadianPatterns();
            updateInsightsDisplay();
        }
    }, 1000 * 60 * 60); // Check every hour

    console.log('✅ Circadian insights system initialized');
}

/**
 * Track activity event
 * @param {string} type - Type of activity ('visit', 'focus', 'theme_change')
 */
function trackActivity(type = 'visit') {
    const now = Date.now();
    const hour = new Date().getHours();

    // Increment hourly activity
    if (!activityData.hourlyActivity[hour]) {
        activityData.hourlyActivity[hour] = 0;
    }
    activityData.hourlyActivity[hour]++;

    // Add to history
    activityData.activityHistory.push({
        timestamp: now,
        hour: hour,
        type: type
    });

    // Keep only last 200 events
    if (activityData.activityHistory.length > 200) {
        activityData.activityHistory = activityData.activityHistory.slice(-200);
    }

    saveActivityData();
}

/**
 * Track focus activity (call when focus session ends)
 * @param {number} duration - Duration in milliseconds
 */
function trackFocusActivity(duration) {
    if (duration >= 60000) { // Only track sessions >= 1 minute
        trackActivity('focus');
    }
}

/**
 * Analyze circadian patterns and generate insights
 */
function analyzeCircadianPatterns() {
    // Find peak activity hours
    const peakHours = findPeakHours();
    activityData.insights.peakHours = peakHours;

    // Find low energy hours
    const lowEnergyHours = findLowEnergyHours();
    activityData.insights.lowEnergyHours = lowEnergyHours;

    // Suggest optimal focus time (during peak hours)
    const suggestedFocusTime = peakHours.length > 0 ? peakHours[0] : null;
    activityData.insights.suggestedFocusTime = suggestedFocusTime;

    // Suggest optimal break time (after peak hours)
    const suggestedBreakTime = suggestedFocusTime !== null
        ? (suggestedFocusTime + 2) % 24
        : null;
    activityData.insights.suggestedBreakTime = suggestedBreakTime;

    // Calculate productivity score (0-100)
    const productivityScore = calculateProductivityScore();
    activityData.insights.productivityScore = productivityScore;

    // Update analysis date
    activityData.lastAnalysisDate = new Date().toISOString();

    saveActivityData();

    console.log('📊 Circadian analysis complete:', activityData.insights);
}

/**
 * Find peak activity hours
 * @returns {Array} Array of hours (0-23)
 */
function findPeakHours() {
    const hourlyActivity = activityData.hourlyActivity;

    // Sort hours by activity count
    const sortedHours = Object.keys(hourlyActivity)
        .map(h => ({ hour: parseInt(h), count: hourlyActivity[h] }))
        .sort((a, b) => b.count - a.count);

    // Return top 3 peak hours
    return sortedHours.slice(0, 3).map(item => item.hour);
}

/**
 * Find low energy hours
 * @returns {Array} Array of hours (0-23)
 */
function findLowEnergyHours() {
    const hourlyActivity = activityData.hourlyActivity;

    // Get average activity
    const allCounts = Object.values(hourlyActivity);
    const avgActivity = allCounts.length > 0
        ? allCounts.reduce((a, b) => a + b, 0) / allCounts.length
        : 0;

    // Find hours below average
    const lowHours = Object.keys(hourlyActivity)
        .map(h => ({ hour: parseInt(h), count: hourlyActivity[h] }))
        .filter(item => item.count < avgActivity * 0.5)
        .sort((a, b) => a.count - b.count)
        .slice(0, 3)
        .map(item => item.hour);

    return lowHours;
}

/**
 * Calculate productivity score based on activity patterns
 * @returns {number} Score 0-100
 */
function calculateProductivityScore() {
    let score = 50; // Base score

    // Check for consistent activity (good sign)
    const uniqueHours = Object.keys(activityData.hourlyActivity).length;
    if (uniqueHours >= 5) score += 10;
    if (uniqueHours >= 10) score += 10;

    // Check for focus sessions (very good sign)
    const focusSessions = activityData.activityHistory.filter(e => e.type === 'focus');
    if (focusSessions.length >= 3) score += 10;
    if (focusSessions.length >= 7) score += 10;

    // Check for morning activity (early bird boost)
    const morningHours = [6, 7, 8, 9, 10];
    const morningActivity = morningHours.reduce((sum, h) =>
        sum + (activityData.hourlyActivity[h] || 0), 0
    );
    if (morningActivity > 0) score += 5;
    if (morningActivity >= 5) score += 5;

    // Cap at 100
    return Math.min(100, score);
}

/**
 * Update insights display
 */
function updateInsightsDisplay() {
    const insights = activityData.insights;
    const isPremium = isPremiumUser();

    // Peak hours
    if (peakHoursDisplay && insights.peakHours.length > 0) {
        const hours = insights.peakHours.map(h => formatHour(h)).join(', ');
        peakHoursDisplay.textContent = hours;
    } else if (peakHoursDisplay) {
        peakHoursDisplay.textContent = 'Not enough data';
    }

    // Suggested focus time
    if (focusTimeDisplay && insights.suggestedFocusTime !== null) {
        focusTimeDisplay.textContent = formatHour(insights.suggestedFocusTime);
    } else if (focusTimeDisplay) {
        focusTimeDisplay.textContent = 'Analyzing...';
    }

    // Suggested break time
    if (breakTimeDisplay && insights.suggestedBreakTime !== null) {
        if (isPremium) {
            breakTimeDisplay.textContent = formatHour(insights.suggestedBreakTime);
        } else {
            breakTimeDisplay.textContent = '🔒 Premium';
        }
    } else if (breakTimeDisplay) {
        breakTimeDisplay.textContent = 'Analyzing...';
    }

    // Productivity score
    if (productivityScore) {
        if (isPremium) {
            productivityScore.textContent = `${insights.productivityScore}/100`;

            // Color code the score
            if (insights.productivityScore >= 80) {
                productivityScore.style.color = '#43e97b';
            } else if (insights.productivityScore >= 60) {
                productivityScore.style.color = '#ffa45b';
            } else {
                productivityScore.style.color = '#ff6b6b';
            }
        } else {
            productivityScore.textContent = '🔒 Premium';
            productivityScore.style.color = 'var(--text-muted)';
        }
    }

    // Show/hide premium notice
    const premiumNotice = document.getElementById('insightsPremiumNotice');
    if (premiumNotice) {
        premiumNotice.style.display = isPremium ? 'none' : 'block';
    }
}

/**
 * Format hour for display (e.g., 9 -> "9:00 AM")
 * @param {number} hour - Hour (0-23)
 * @returns {string} Formatted time
 */
function formatHour(hour) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:00 ${period}`;
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
 * Load activity data from localStorage
 */
function loadActivityData() {
    try {
        const data = loadFromStorage('CircadianInsightsData', {
            hourlyActivity: {},
            activityHistory: [],
            lastAnalysisDate: null,
            insights: {
                peakHours: [],
                lowEnergyHours: [],
                suggestedFocusTime: null,
                suggestedBreakTime: null,
                productivityScore: 0
            }
        });
        activityData = data;
    } catch (error) {
        console.error('Error loading activity data:', error);
    }
}

/**
 * Save activity data to localStorage
 */
function saveActivityData() {
    try {
        saveToStorage('CircadianInsightsData', activityData);
    } catch (error) {
        console.error('Error saving activity data:', error);
    }
}

/**
 * Export functions for use by other modules
 */
window.trackFocusActivity = trackFocusActivity;
