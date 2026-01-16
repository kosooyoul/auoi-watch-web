// ==================== THEME SYSTEM ====================

// Current theme state
let currentTheme = 'classic';
let timeFormat = '24h';
let animationSpeed = 1.0;

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
        timeFormat: timeFormat,
        animationSpeed: animationSpeed
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
            if (settings.animationSpeed !== undefined) {
                applyAnimationSpeed(settings.animationSpeed);
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

    // Re-render components with new time format
    const now = new Date();
    renderAlarmMarkers(now.getHours(), now.getMinutes(), now.getSeconds());

    // Re-render alarm list if it exists
    if (typeof renderAlarms === 'function') {
        renderAlarms();
    }

    // Update world clocks if they exist
    if (typeof updateWorldClocks === 'function') {
        updateWorldClocks();
    }
}

/**
 * Apply animation speed setting
 * @param {number} speed - Animation speed multiplier (0.5 - 2.0)
 */
function applyAnimationSpeed(speed) {
    animationSpeed = parseFloat(speed);

    // Update UI - slider and value display
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');

    if (speedSlider) {
        speedSlider.value = animationSpeed;
    }
    if (speedValue) {
        speedValue.textContent = `${animationSpeed.toFixed(1)}x`;
    }

    // Update color smooth factor in clock (if function exists)
    if (typeof updateColorSmoothFactor === 'function') {
        updateColorSmoothFactor(animationSpeed);
    }
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
        document.querySelector('.theme-option').focus();
    });

    // Close modal
    const closeModal = () => {
        settingsModal.classList.remove('active');
        settingsBtn.focus();
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

    // Animation speed slider
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');

    if (speedSlider && speedValue) {
        // Update value display on slider input
        speedSlider.addEventListener('input', () => {
            const speed = parseFloat(speedSlider.value);
            speedValue.textContent = `${speed.toFixed(1)}x`;
        });

        // Apply speed on slider change
        speedSlider.addEventListener('change', () => {
            const speed = parseFloat(speedSlider.value);
            applyAnimationSpeed(speed);
            saveSettings();
        });
    }
}
