/**
 * Advanced Analytics Dashboard
 * Feature: Visualize app usage, conversion funnel, and user behavior
 * Revenue: $0 (internal insights for optimization)
 */

// Analytics storage
let analyticsData = {
    events: [], // All tracked events
    sessions: [], // Session data
    currentSession: null
};

// DOM elements
let analyticsDashboardModal;
let analyticsDashboardCloseBtn;
let analyticsBtn;

/**
 * Initialize analytics dashboard system
 */
function initAnalyticsDashboard() {
    // Get DOM elements
    analyticsDashboardModal = document.getElementById('analyticsDashboardModal');
    analyticsDashboardCloseBtn = document.getElementById('analyticsDashboardCloseBtn');
    analyticsBtn = document.getElementById('analyticsBtn');

    if (!analyticsDashboardModal || !analyticsBtn) {
        console.warn('Analytics dashboard UI elements not found');
        return;
    }

    // Load analytics data
    loadAnalyticsData();

    // Start new session
    startNewSession();

    // Setup modal
    initModal({
        openButton: analyticsBtn,
        modal: analyticsDashboardModal,
        closeButton: analyticsDashboardCloseBtn,
        onOpen: renderAnalyticsDashboard
    });

    // Hook into existing analytics system to capture events
    hookAnalyticsTracking();

    console.log('✅ Analytics dashboard initialized');
}

/**
 * Hook into analytics tracking to capture events locally
 */
function hookAnalyticsTracking() {
    // Override trackEvent to also store locally
    const originalTrackEvent = window.Analytics.trackEvent;

    window.Analytics.trackEvent = function(eventName, eventParams = {}) {
        // Call original function
        originalTrackEvent(eventName, eventParams);

        // Store event locally
        captureEvent(eventName, eventParams);
    };
}

/**
 * Start a new session
 */
function startNewSession() {
    analyticsData.currentSession = {
        sessionId: generateSessionId(),
        startTime: Date.now(),
        endTime: null,
        duration: 0,
        events: [],
        pageViews: 0,
        actions: 0
    };
}

/**
 * Generate unique session ID
 * @returns {string} Session ID
 */
function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Capture analytics event
 * @param {string} eventName - Event name
 * @param {object} eventParams - Event parameters
 */
function captureEvent(eventName, eventParams) {
    const event = {
        eventName,
        eventParams,
        timestamp: Date.now(),
        sessionId: analyticsData.currentSession?.sessionId || 'unknown'
    };

    // Add to global events
    analyticsData.events.push(event);

    // Add to current session
    if (analyticsData.currentSession) {
        analyticsData.currentSession.events.push(event);
        analyticsData.currentSession.actions++;

        if (eventName === 'page_view') {
            analyticsData.currentSession.pageViews++;
        }
    }

    // Keep only last 500 events (prevent storage overflow)
    if (analyticsData.events.length > 500) {
        analyticsData.events = analyticsData.events.slice(-500);
    }

    // Save to storage
    saveAnalyticsData();
}

/**
 * End current session
 */
function endCurrentSession() {
    if (!analyticsData.currentSession) return;

    analyticsData.currentSession.endTime = Date.now();
    analyticsData.currentSession.duration = analyticsData.currentSession.endTime - analyticsData.currentSession.startTime;

    // Save session
    analyticsData.sessions.push(analyticsData.currentSession);

    // Keep only last 50 sessions
    if (analyticsData.sessions.length > 50) {
        analyticsData.sessions = analyticsData.sessions.slice(-50);
    }

    saveAnalyticsData();
    analyticsData.currentSession = null;
}

/**
 * Load analytics data from localStorage
 */
function loadAnalyticsData() {
    try {
        const data = loadFromStorage('AnalyticsDashboardData', {
            events: [],
            sessions: [],
            currentSession: null
        });
        analyticsData = data;

        // Resume session if exists and is recent (< 30 minutes ago)
        if (analyticsData.currentSession) {
            const sessionAge = Date.now() - analyticsData.currentSession.startTime;
            const thirtyMinutes = 30 * 60 * 1000;

            if (sessionAge < thirtyMinutes) {
                // Resume session
                console.log('📊 Resuming analytics session');
            } else {
                // Session too old, end it and start new
                endCurrentSession();
                startNewSession();
            }
        }
    } catch (error) {
        console.error('Error loading analytics data:', error);
    }
}

/**
 * Save analytics data to localStorage
 */
function saveAnalyticsData() {
    try {
        saveToStorage('AnalyticsDashboardData', analyticsData);
    } catch (error) {
        console.error('Error saving analytics data:', error);
    }
}

/**
 * Render analytics dashboard
 */
function renderAnalyticsDashboard() {
    // Update current session duration
    if (analyticsData.currentSession) {
        analyticsData.currentSession.duration = Date.now() - analyticsData.currentSession.startTime;
    }

    // Render overview stats
    renderOverviewStats();

    // Render conversion funnel
    renderConversionFunnel();

    // Render event timeline
    renderEventTimeline();

    // Render session stats
    renderSessionStats();
}

/**
 * Render overview stats
 */
function renderOverviewStats() {
    const container = document.getElementById('overviewStatsContainer');
    if (!container) return;

    const totalEvents = analyticsData.events.length;
    const totalSessions = analyticsData.sessions.length + (analyticsData.currentSession ? 1 : 0);
    const avgSessionDuration = calculateAverageSessionDuration();
    const mostCommonEvent = findMostCommonEvent();

    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${totalEvents}</div>
            <div class="stat-label">Total Events</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${totalSessions}</div>
            <div class="stat-label">Total Sessions</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${formatDuration(avgSessionDuration)}</div>
            <div class="stat-label">Avg Session</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${mostCommonEvent || 'N/A'}</div>
            <div class="stat-label">Top Event</div>
        </div>
    `;
}

/**
 * Render conversion funnel
 */
function renderConversionFunnel() {
    const container = document.getElementById('conversionFunnelContainer');
    if (!container) return;

    // Count funnel events
    const galleryViews = countEvents('theme_gallery_view');
    const premiumViews = countEvents('premium_theme_view');
    const buyClicks = countEvents('buy_button_click');
    const checkouts = countEvents('stripe_checkout_redirect');
    const purchases = countEvents('purchase_success');

    // Calculate conversion rates
    const premiumViewRate = galleryViews > 0 ? ((premiumViews / galleryViews) * 100).toFixed(1) : 0;
    const buyClickRate = premiumViews > 0 ? ((buyClicks / premiumViews) * 100).toFixed(1) : 0;
    const checkoutRate = buyClicks > 0 ? ((checkouts / buyClicks) * 100).toFixed(1) : 0;
    const purchaseRate = checkouts > 0 ? ((purchases / checkouts) * 100).toFixed(1) : 0;

    container.innerHTML = `
        <div class="funnel-step">
            <div class="funnel-step-label">Theme Gallery Views</div>
            <div class="funnel-step-count">${galleryViews}</div>
            <div class="funnel-bar" style="width: 100%;"></div>
        </div>
        <div class="funnel-step">
            <div class="funnel-step-label">Premium Section Views</div>
            <div class="funnel-step-count">${premiumViews} <span class="conversion-rate">(${premiumViewRate}%)</span></div>
            <div class="funnel-bar" style="width: ${premiumViewRate}%;"></div>
        </div>
        <div class="funnel-step">
            <div class="funnel-step-label">Buy Button Clicks</div>
            <div class="funnel-step-count">${buyClicks} <span class="conversion-rate">(${buyClickRate}%)</span></div>
            <div class="funnel-bar" style="width: ${buyClickRate}%;"></div>
        </div>
        <div class="funnel-step">
            <div class="funnel-step-label">Checkout Initiated</div>
            <div class="funnel-step-count">${checkouts} <span class="conversion-rate">(${checkoutRate}%)</span></div>
            <div class="funnel-bar" style="width: ${checkoutRate}%;"></div>
        </div>
        <div class="funnel-step">
            <div class="funnel-step-label">Purchases Completed</div>
            <div class="funnel-step-count">${purchases} <span class="conversion-rate">(${purchaseRate}%)</span></div>
            <div class="funnel-bar success" style="width: ${purchaseRate}%;"></div>
        </div>
    `;
}

/**
 * Render event timeline
 */
function renderEventTimeline() {
    const container = document.getElementById('eventTimelineContainer');
    if (!container) return;

    // Get last 20 events
    const recentEvents = analyticsData.events.slice(-20).reverse();

    if (recentEvents.length === 0) {
        container.innerHTML = '<div class="empty-state">No events tracked yet</div>';
        return;
    }

    container.innerHTML = recentEvents.map(event => {
        const time = new Date(event.timestamp).toLocaleTimeString();
        const eventLabel = formatEventName(event.eventName);
        const eventDetails = formatEventParams(event.eventParams);

        return `
            <div class="timeline-event">
                <div class="timeline-time">${time}</div>
                <div class="timeline-event-name">${eventLabel}</div>
                ${eventDetails ? `<div class="timeline-event-details">${eventDetails}</div>` : ''}
            </div>
        `;
    }).join('');
}

/**
 * Render session stats
 */
function renderSessionStats() {
    const container = document.getElementById('sessionStatsContainer');
    if (!container) return;

    const allSessions = [...analyticsData.sessions];
    if (analyticsData.currentSession) {
        allSessions.push({
            ...analyticsData.currentSession,
            duration: Date.now() - analyticsData.currentSession.startTime,
            isCurrent: true
        });
    }

    if (allSessions.length === 0) {
        container.innerHTML = '<div class="empty-state">No sessions yet</div>';
        return;
    }

    container.innerHTML = allSessions.slice(-10).reverse().map(session => {
        const startTime = new Date(session.startTime).toLocaleString();
        const duration = formatDuration(session.duration);
        const currentBadge = session.isCurrent ? '<span class="current-badge">Current</span>' : '';

        return `
            <div class="session-card ${session.isCurrent ? 'current-session' : ''}">
                <div class="session-header">
                    <span class="session-time">${startTime}</span>
                    ${currentBadge}
                </div>
                <div class="session-stats">
                    <span>Duration: ${duration}</span>
                    <span>Events: ${session.events.length}</span>
                    <span>Actions: ${session.actions}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Calculate average session duration
 * @returns {number} Average duration in milliseconds
 */
function calculateAverageSessionDuration() {
    const allSessions = [...analyticsData.sessions];
    if (analyticsData.currentSession) {
        allSessions.push({
            ...analyticsData.currentSession,
            duration: Date.now() - analyticsData.currentSession.startTime
        });
    }

    if (allSessions.length === 0) return 0;

    const totalDuration = allSessions.reduce((sum, session) => sum + session.duration, 0);
    return totalDuration / allSessions.length;
}

/**
 * Find most common event
 * @returns {string} Most common event name
 */
function findMostCommonEvent() {
    if (analyticsData.events.length === 0) return null;

    const eventCounts = {};
    analyticsData.events.forEach(event => {
        eventCounts[event.eventName] = (eventCounts[event.eventName] || 0) + 1;
    });

    let maxCount = 0;
    let mostCommon = null;

    Object.entries(eventCounts).forEach(([eventName, count]) => {
        if (count > maxCount) {
            maxCount = count;
            mostCommon = eventName;
        }
    });

    return formatEventName(mostCommon);
}

/**
 * Count events by name
 * @param {string} eventName - Event name to count
 * @returns {number} Event count
 */
function countEvents(eventName) {
    return analyticsData.events.filter(e => e.eventName === eventName).length;
}

/**
 * Format event name for display
 * @param {string} eventName - Event name
 * @returns {string} Formatted name
 */
function formatEventName(eventName) {
    return eventName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Format event parameters for display
 * @param {object} params - Event parameters
 * @returns {string} Formatted params
 */
function formatEventParams(params) {
    const relevantParams = ['pack_id', 'theme_id', 'pack_price'];
    const formatted = [];

    relevantParams.forEach(key => {
        if (params[key]) {
            formatted.push(`${key}: ${params[key]}`);
        }
    });

    return formatted.join(', ');
}

/**
 * Export analytics data as JSON
 */
function exportAnalyticsData() {
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-export-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('📊 Analytics data exported');
}

/**
 * Clear all analytics data
 */
function clearAnalyticsData() {
    if (!confirm('Are you sure you want to clear all analytics data? This cannot be undone.')) {
        return;
    }

    analyticsData = {
        events: [],
        sessions: [],
        currentSession: null
    };

    startNewSession();
    saveAnalyticsData();
    renderAnalyticsDashboard();

    console.log('🗑️ Analytics data cleared');
}

// End session before page unload
window.addEventListener('beforeunload', () => {
    endCurrentSession();
});

// Expose functions to window
window.exportAnalyticsData = exportAnalyticsData;
window.clearAnalyticsData = clearAnalyticsData;
