// ==================== THEME SYSTEM ====================

// Current theme state
let currentTheme = 'classic';
let timeFormat = '24h';
let animationSpeed = 1.0;

/**
 * Convert premium theme (simplified structure) to full theme structure
 * @param {Object} premiumTheme - Premium theme with simplified structure
 * @returns {Object} Full theme object compatible with existing system
 */
function convertPremiumThemeToFull(premiumTheme) {
    const textRgb = hexToRgb(premiumTheme.text);
    const hourRingRgb = hexToRgb(premiumTheme.hourRing);

    return {
        name: premiumTheme.name,
        bgPrimary: premiumTheme.background,
        bgSecondary: adjustBrightness(premiumTheme.background, 10),
        textPrimary: premiumTheme.text,
        textSecondary: premiumTheme.text,
        textMuted: `rgba(${textRgb[0]}, ${textRgb[1]}, ${textRgb[2]}, 0.5)`,
        textTime: `rgba(${textRgb[0]}, ${textRgb[1]}, ${textRgb[2]}, 0.7)`,
        ringBg: `rgba(${hourRingRgb[0]}, ${hourRingRgb[1]}, ${hourRingRgb[2]}, 0.2)`,
        ringHour: createGradient(premiumTheme.hourRing),
        ringMinute: createGradient(premiumTheme.minuteRing),
        ringSecond: createGradient(premiumTheme.secondRing),
        ringMs: createGradient(premiumTheme.millisecondRing)
    };
}

/**
 * Find theme by name (checks both free and premium themes)
 * @param {string} themeId - Theme ID to find
 * @returns {Object|null} Theme object or null if not found
 */
function findTheme(themeId) {
    // Check free themes first
    if (THEMES[themeId]) {
        return { theme: THEMES[themeId], isPremium: false, themeId };
    }

    // Check premium themes
    const premiumTheme = PREMIUM_THEMES.find(t => t.id === themeId);
    if (premiumTheme) {
        return { theme: convertPremiumThemeToFull(premiumTheme), isPremium: true, themeId, premiumData: premiumTheme };
    }

    return null;
}

/**
 * Apply a theme to the page
 * @param {string} themeId - ID of the theme to apply
 */
function applyTheme(themeId) {
    const result = findTheme(themeId);
    if (!result) {
        console.error(`Theme "${themeId}" not found`);
        return;
    }

    const theme = result.theme;

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
    currentTheme = themeId;

    // Save to localStorage
    saveSettings();

    // Update URL with new theme
    updateURL();

    // Update active theme option in UI
    updateThemeUI(themeId);
}

/**
 * Update a single SVG gradient with colors
 * @param {string} gradientId - ID of the gradient element
 * @param {Object} colors - Object with start and mid color properties
 */
function updateGradient(gradientId, colors) {
    const gradient = document.getElementById(gradientId);
    if (gradient && gradient.children.length >= 2) {
        gradient.children[0].setAttribute('style', `stop-color:${colors.start};stop-opacity:1`);
        gradient.children[1].setAttribute('style', `stop-color:${colors.mid};stop-opacity:1`);
    }
}

/**
 * Update SVG gradient definitions with theme colors
 * @param {Object} theme - Theme object
 */
function updateSVGGradients(theme) {
    const gradients = [
        { id: 'hourGradient', colors: theme.ringHour },
        { id: 'minuteGradient', colors: theme.ringMinute },
        { id: 'secondGradient', colors: theme.ringSecond },
        { id: 'msGradient', colors: theme.ringMs }
    ];

    gradients.forEach(({ id, colors }) => updateGradient(id, colors));
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
 * @returns {string|null} Theme ID from URL or null
 */
function getThemeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const themeId = urlParams.get('theme');
    if (themeId && findTheme(themeId)) {
        return themeId;
    }
    return null;
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
    saveToStorage('Settings', settings);
}

/**
 * Load settings from URL params (priority) or localStorage
 */
function loadSettings() {
    // Check URL params first (higher priority)
    const urlTheme = getThemeFromURL();
    if (urlTheme) {
        applyTheme(urlTheme);
    }

    // Fallback to localStorage
    const settings = loadFromStorage('Settings', {});
    if (settings.theme && findTheme(settings.theme) && !urlTheme) {
        applyTheme(settings.theme);
    }
    if (settings.timeFormat) {
        applyTimeFormat(settings.timeFormat);
    }
    if (settings.animationSpeed !== undefined) {
        applyAnimationSpeed(settings.animationSpeed);
    }

    // If no URL param, update URL
    if (!urlTheme) {
        updateURL();
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

    // Render premium themes
    renderPremiumThemes();
}

/**
 * Get purchases data from localStorage
 * @returns {Object} Purchases object
 */
function getPurchases() {
    return loadFromStorage('Purchases', {
        luxury: { purchased: false },
        nature: { purchased: false },
        neon: { purchased: false },
        bundle: { purchased: false }
    });
}

/**
 * Save purchases data to localStorage
 * @param {Object} purchases - Purchases object
 */
function savePurchases(purchases) {
    saveToStorage('Purchases', purchases);
}

/**
 * Check if a theme is unlocked
 * @param {string} themeId - Theme ID to check
 * @returns {boolean} Whether theme is unlocked
 */
function isThemeUnlocked(themeId) {
    // Free themes are always unlocked
    if (THEMES[themeId]) {
        return true;
    }

    // Check if premium theme
    const premiumTheme = PREMIUM_THEMES.find(t => t.id === themeId);
    if (!premiumTheme) {
        return true; // Unknown theme, assume unlocked
    }

    // Check if pack or bundle is purchased
    const purchases = getPurchases();
    return purchases[premiumTheme.pack]?.purchased || purchases.bundle?.purchased;
}

/**
 * Unlock a theme pack
 * @param {string} packId - Pack ID to unlock ('luxury', 'nature', 'neon', or 'bundle')
 * @param {Object} options - Optional purchase details (price, date, receipt)
 */
function unlockPack(packId, options = {}) {
    const purchases = getPurchases();

    purchases[packId] = {
        purchased: true,
        date: options.date || new Date().toISOString(),
        price: options.price || THEME_PACKS[packId]?.price || 0,
        receipt: options.receipt || null
    };

    savePurchases(purchases);

    // Re-render premium themes to update UI
    const container = document.getElementById('premiumThemesContainer');
    if (container) {
        container.innerHTML = '';
        renderPremiumThemes();
    }

    return true;
}

/**
 * Check if a pack is purchased
 * @param {string} packId - Pack ID to check
 * @returns {boolean} Whether pack is purchased
 */
function isPackPurchased(packId) {
    const purchases = getPurchases();
    return purchases[packId]?.purchased || false;
}

/**
 * Render premium themes dynamically
 */
function renderPremiumThemes() {
    const container = document.getElementById('premiumThemesContainer');
    if (!container) return;

    // Group themes by pack
    const packs = {
        luxury: { name: 'Luxury Pack', price: 4.99, themes: [] },
        nature: { name: 'Nature Pack', price: 3.99, themes: [] },
        neon: { name: 'Neon Pack', price: 3.99, themes: [] }
    };

    PREMIUM_THEMES.forEach(theme => {
        if (packs[theme.pack]) {
            packs[theme.pack].themes.push(theme);
        }
    });

    // Render each pack
    Object.entries(packs).forEach(([packId, pack]) => {
        const packSection = document.createElement('div');
        packSection.className = 'premium-pack-section';

        const isPurchased = isPackPurchased(packId);

        // Pack header
        const packHeader = document.createElement('div');
        packHeader.className = 'premium-pack-header';

        if (isPurchased) {
            packHeader.innerHTML = `
                <span class="pack-name">${pack.name}</span>
                <span class="pack-price">$${pack.price.toFixed(2)}</span>
                <button class="buy-pack-btn purchased" disabled>✓ Purchased</button>
            `;
        } else {
            packHeader.innerHTML = `
                <span class="pack-name">${pack.name}</span>
                <span class="pack-price">$${pack.price.toFixed(2)}</span>
                <button class="buy-pack-btn" data-pack="${packId}">Buy Pack</button>
            `;
        }
        packSection.appendChild(packHeader);

        // Theme grid for this pack
        const themeGrid = document.createElement('div');
        themeGrid.className = 'theme-grid premium-theme-grid';

        pack.themes.forEach(theme => {
            const isUnlocked = isThemeUnlocked(theme.id);
            const themeCard = createPremiumThemeCard(theme, isUnlocked);
            themeGrid.appendChild(themeCard);
        });

        packSection.appendChild(themeGrid);
        container.appendChild(packSection);
    });

    // Add event listeners to buy buttons
    const buyButtons = container.querySelectorAll('.buy-pack-btn');
    buyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const packId = btn.dataset.pack;
            handlePurchasePack(packId);
        });
    });
}

/**
 * Create premium theme card element
 * @param {Object} theme - Premium theme object
 * @param {boolean} isUnlocked - Whether theme is unlocked
 * @returns {HTMLElement} Theme card element
 */
function createPremiumThemeCard(theme, isUnlocked) {
    const card = document.createElement('div');
    card.className = isUnlocked ? 'theme-option premium-theme' : 'theme-option premium-theme locked';
    card.dataset.theme = theme.id;
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', 'false');
    card.setAttribute('tabindex', '0');

    // Theme preview with ring colors
    const preview = document.createElement('div');
    preview.className = 'theme-preview';
    preview.innerHTML = `
        <div class="theme-color" style="background: ${theme.hourRing};"></div>
        <div class="theme-color" style="background: ${theme.minuteRing};"></div>
        <div class="theme-color" style="background: ${theme.secondRing};"></div>
        <div class="theme-color" style="background: ${theme.millisecondRing};"></div>
    `;

    // Lock overlay for locked themes
    if (!isUnlocked) {
        const lockOverlay = document.createElement('div');
        lockOverlay.className = 'lock-overlay';
        lockOverlay.innerHTML = '<span class="lock-icon">🔒</span>';
        preview.appendChild(lockOverlay);
    }

    // Theme name
    const name = document.createElement('div');
    name.className = 'theme-name';
    name.textContent = theme.name;

    card.appendChild(preview);
    card.appendChild(name);

    // Add click handler if unlocked
    if (isUnlocked) {
        card.addEventListener('click', () => applyTheme(theme.id));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                applyTheme(theme.id);
            }
        });
    } else {
        // Show message for locked themes
        card.addEventListener('click', () => {
            alert(`This theme is part of the ${theme.pack} pack. Purchase the pack to unlock it.`);
        });
    }

    return card;
}

/**
 * Handle purchase pack button click
 * For now, this unlocks the pack immediately for testing
 * In Task 4, this will redirect to Stripe payment
 * @param {string} packId - Pack ID to purchase
 */
function handlePurchasePack(packId) {
    // Redirect to Stripe Payment Link
    if (typeof window.purchasePack === 'function') {
        window.purchasePack(packId);
    } else {
        console.error('Payment system not loaded. Make sure js/payment.js is included.');
        alert('Payment system is not available. Please refresh the page.');
    }
}

// ==================== DEVELOPER TESTING HELPERS ====================

/**
 * Reset all purchases (for testing)
 * Call in browser console: resetPurchases()
 */
function resetPurchases() {
    savePurchases({
        luxury: { purchased: false },
        nature: { purchased: false },
        neon: { purchased: false },
        bundle: { purchased: false }
    });

    // Re-render premium themes
    const container = document.getElementById('premiumThemesContainer');
    if (container) {
        container.innerHTML = '';
        renderPremiumThemes();
    }

    console.log('✓ All purchases reset');
}

/**
 * Unlock all packs (for testing)
 * Call in browser console: unlockAllPacks()
 */
function unlockAllPacks() {
    ['luxury', 'nature', 'neon'].forEach(packId => {
        unlockPack(packId);
    });
    console.log('✓ All packs unlocked');
}

/**
 * Show purchase status (for testing)
 * Call in browser console: showPurchaseStatus()
 */
function showPurchaseStatus() {
    const purchases = getPurchases();
    console.log('📦 Purchase Status:', purchases);

    Object.entries(purchases).forEach(([packId, data]) => {
        const status = data.purchased ? '✓ Purchased' : '🔒 Locked';
        const name = THEME_PACKS[packId]?.name || packId;
        console.log(`  ${status} ${name}`);
        if (data.purchased && data.date) {
            console.log(`    Date: ${data.date}`);
        }
    });
}

// Expose helpers to window for console access
if (typeof window !== 'undefined') {
    window.resetPurchases = resetPurchases;
    window.unlockAllPacks = unlockAllPacks;
    window.showPurchaseStatus = showPurchaseStatus;
    window.unlockPack = unlockPack;
    window.getPurchases = getPurchases;
}
