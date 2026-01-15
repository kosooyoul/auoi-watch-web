// ==================== MAIN INITIALIZATION ====================

/**
 * Initialize the application
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

// Start the clock when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
