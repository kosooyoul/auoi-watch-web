// ==================== MAIN INITIALIZATION ====================

/**
 * Initialize the application
 */
function init() {
    // Initialize clock FIRST (most important - must always work)
    initializeRings();
    updateClock();

    // Initialize settings system (needed for themes)
    initSettingsUI();
    loadSettings(); // Load saved theme from localStorage

    // Initialize core features
    initFullscreen();
    initPWA();

    // Initialize analytics (so other modules can track events)
    Analytics.init();

    // Initialize alarm system
    initAlarmSystem();

    // Initialize world clock system
    initWorldClockSystem();

    // Initialize stopwatch system
    initStopwatchSystem();

    // Initialize greeting system
    initGreeting();

    // Initialize auto-theme system
    initAutoTheme();

    // Initialize focus mode system
    initFocusMode();

    // Initialize audio system
    initAudioSystem();

    // Initialize payment system
    initPaymentSystem();

    // Initialize analytics dashboard
    initAnalyticsDashboard();

    // Initialize experimental features (non-critical)
    try {
        initStreakSystem();
        initCustomMessageSystem();
        initThemeRecommendations();
        initCircadianInsights();
    } catch (error) {
        console.warn('Some experimental features failed to initialize:', error);
    }
}

// Start the clock when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
