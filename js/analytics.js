/**
 * Analytics & Tracking Module
 *
 * Tracks user behavior and conversion funnel for monetization optimization.
 * Uses Google Analytics 4 (GA4) for event tracking.
 *
 * GDPR Compliant:
 * - No PII (Personally Identifiable Information) tracked
 * - Only anonymous behavioral events
 * - Users can opt-out via browser settings
 */

// ============================================================
// Configuration
// ============================================================

// Google Analytics Measurement ID (replace with your actual GA4 ID)
// To get your ID: https://analytics.google.com/ → Create Property → Get Measurement ID
// Example formats: 'G-XXXXXXXXXX' (GA4) or 'GTM-XXXXXXX' (Google Tag Manager)
const GA_MEASUREMENT_ID = 'G-TODO'; // TODO: Replace with actual GA4 Measurement ID

// Debug mode: logs events to console instead of sending to GA
const DEBUG_MODE = true; // Set to false in production

// ============================================================
// Core Analytics Functions
// ============================================================

/**
 * Initialize analytics system
 * Loads Google Analytics script and sets up configuration
 */
function initAnalytics() {
    // Skip initialization if GA_MEASUREMENT_ID not configured
    if (GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        console.warn('[Analytics] GA4 Measurement ID not configured. Events will be logged to console only.');
        return;
    }

    // Load gtag.js script (Google Analytics)
    if (!DEBUG_MODE && typeof gtag === 'undefined') {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { dataLayer.push(arguments); };
        gtag('js', new Date());
        gtag('config', GA_MEASUREMENT_ID, {
            anonymize_ip: true, // GDPR: Anonymize IP addresses
            send_page_view: true
        });

        console.log('[Analytics] Google Analytics initialized');
    }
}

/**
 * Track custom event
 * @param {string} eventName - Name of the event
 * @param {object} eventParams - Additional event parameters (optional)
 */
function trackEvent(eventName, eventParams = {}) {
    // Debug mode: log to console
    if (DEBUG_MODE || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        console.log(`[Analytics] Event: ${eventName}`, eventParams);
        return;
    }

    // Production mode: send to Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventParams);
    }
}

// ============================================================
// Conversion Funnel Events
// ============================================================

/**
 * Event 1: User opens Settings modal
 * Tracks when users view the theme gallery
 */
function trackThemeGalleryView() {
    trackEvent('theme_gallery_view', {
        event_category: 'engagement',
        event_label: 'settings_modal_open'
    });
}

/**
 * Event 2: User scrolls to premium section
 * Tracks interest in premium themes
 */
function trackPremiumThemeView() {
    trackEvent('premium_theme_view', {
        event_category: 'engagement',
        event_label: 'premium_section_scroll'
    });
}

/**
 * Event 3: User clicks "Buy Pack" button
 * Tracks purchase intent
 * @param {string} packId - Pack identifier (luxury, nature, neon, bundle)
 * @param {number} price - Pack price
 */
function trackBuyButtonClick(packId, price) {
    trackEvent('buy_button_click', {
        event_category: 'conversion',
        event_label: packId,
        pack_id: packId,
        pack_price: price,
        currency: 'USD'
    });
}

/**
 * Event 4: User redirected to Stripe Checkout
 * Tracks checkout initiation
 * @param {string} packId - Pack identifier
 * @param {number} price - Pack price
 */
function trackStripeCheckoutRedirect(packId, price) {
    trackEvent('stripe_checkout_redirect', {
        event_category: 'conversion',
        event_label: packId,
        pack_id: packId,
        pack_price: price,
        currency: 'USD'
    });
}

/**
 * Event 5: Purchase completed successfully
 * Tracks successful conversions
 * @param {string} packId - Pack identifier
 * @param {number} price - Pack price
 */
function trackPurchaseSuccess(packId, price) {
    trackEvent('purchase_success', {
        event_category: 'conversion',
        event_label: packId,
        pack_id: packId,
        pack_price: price,
        currency: 'USD',
        transaction_id: Date.now().toString() // Anonymous transaction ID
    });

    // Also track as GA4 'purchase' event for e-commerce reports
    trackEvent('purchase', {
        currency: 'USD',
        value: price,
        items: [{
            item_id: packId,
            item_name: `${packId.charAt(0).toUpperCase() + packId.slice(1)} Pack`,
            price: price,
            quantity: 1
        }]
    });
}

/**
 * Event 6: User cancelled payment
 * Tracks checkout abandonment
 * @param {string} packId - Pack identifier (optional)
 */
function trackPurchaseCancel(packId = 'unknown') {
    trackEvent('purchase_cancel', {
        event_category: 'conversion',
        event_label: packId,
        pack_id: packId
    });
}

/**
 * Event 7: Premium theme applied
 * Tracks theme unlock and usage
 * @param {string} themeId - Theme identifier
 */
function trackThemeUnlock(themeId) {
    trackEvent('theme_unlock', {
        event_category: 'engagement',
        event_label: themeId,
        theme_id: themeId
    });
}

// ============================================================
// Additional Utility Events
// ============================================================

/**
 * Track page view (for SPAs or manual tracking)
 * @param {string} pagePath - Page path (e.g., '/settings')
 */
function trackPageView(pagePath) {
    trackEvent('page_view', {
        page_path: pagePath
    });
}

/**
 * Track user timing (performance metrics)
 * @param {string} name - Timing name
 * @param {number} value - Time in milliseconds
 * @param {string} category - Timing category
 */
function trackTiming(name, value, category = 'performance') {
    trackEvent('timing_complete', {
        name: name,
        value: value,
        event_category: category
    });
}

// ============================================================
// Export (Make functions globally available)
// ============================================================

// Make analytics functions available globally
window.Analytics = {
    init: initAnalytics,
    trackEvent: trackEvent,
    trackThemeGalleryView: trackThemeGalleryView,
    trackPremiumThemeView: trackPremiumThemeView,
    trackBuyButtonClick: trackBuyButtonClick,
    trackStripeCheckoutRedirect: trackStripeCheckoutRedirect,
    trackPurchaseSuccess: trackPurchaseSuccess,
    trackPurchaseCancel: trackPurchaseCancel,
    trackThemeUnlock: trackThemeUnlock,
    trackPageView: trackPageView,
    trackTiming: trackTiming
};

console.log('[Analytics] Module loaded. Use Analytics.init() to initialize.');
