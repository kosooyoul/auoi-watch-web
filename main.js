// ==================== MAIN INITIALIZATION ====================

/**
 * Initialize the application
 */
function init() {
    // Initialize analytics (first, so other modules can track events)
    Analytics.init();

    // Initialize settings system
    initSettingsUI();
    loadSettings(); // Load saved theme from localStorage

    // Initialize payment system
    initPaymentSystem();

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

    // Initialize greeting system
    initGreeting();

    // Initialize auto-theme system
    initAutoTheme();

    // Initialize focus mode system
    initFocusMode();

    // Initialize audio system
    initAudioSystem();

    // Initialize streak system
    initStreakSystem();

    // Initialize custom message system
    initCustomMessageSystem();

    // Initialize theme recommendations system
    initThemeRecommendations();

    // Initialize circadian insights system
    initCircadianInsights();

    // Initialize analytics dashboard
    initAnalyticsDashboard();

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
