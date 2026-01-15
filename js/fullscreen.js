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
