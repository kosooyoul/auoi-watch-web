# Analytics Testing Guide

This guide explains how to test the analytics event tracking system.

## Configuration

The analytics system is currently in **DEBUG MODE**, which means:
- Events are logged to browser console instead of being sent to Google Analytics
- You can test all events without needing a Google Analytics account
- No actual data is sent to external servers

To see the debug logs, open your browser's Developer Console (F12 or Cmd+Option+I on Mac).

---

## Testing Checklist

### Prerequisites
1. Open `index.html` with Live Server
2. Open Browser Developer Console (F12)
3. Look for `[Analytics] Module loaded` message in console

---

### Event 1: Theme Gallery View
**What it tracks:** User opens Settings modal

**How to test:**
1. Click the ⚙️ Settings button (top-right corner)
2. **Expected console output:**
   ```
   [Analytics] Event: theme_gallery_view {event_category: 'engagement', event_label: 'settings_modal_open'}
   ```

**✅ Status:** ___________

---

### Event 2: Premium Theme View
**What it tracks:** User scrolls to premium section

**How to test:**
1. Open Settings modal (⚙️ button)
2. Scroll down to the "Premium Themes" section until it becomes visible
3. **Expected console output:**
   ```
   [Analytics] Event: premium_theme_view {event_category: 'engagement', event_label: 'premium_section_scroll'}
   ```

**Note:** This event tracks only once per session (uses IntersectionObserver)

**✅ Status:** ___________

---

### Event 3: Buy Button Click
**What it tracks:** User clicks "Buy Pack" button

**How to test:**
1. Open Settings modal
2. Scroll to Premium Themes section
3. Click any "Buy Pack" button (e.g., "Buy Luxury Pack")
4. **Expected console output:**
   ```
   [Analytics] Event: buy_button_click {
     event_category: 'conversion',
     event_label: 'luxury',
     pack_id: 'luxury',
     pack_price: 4.99,
     currency: 'USD'
   }
   ```

**✅ Status:** ___________

---

### Event 4: Stripe Checkout Redirect
**What it tracks:** User redirected to Stripe Checkout

**How to test:**
1. Click "Buy Pack" button
2. If Stripe is configured: Event fires before redirect
3. If Stripe is NOT configured: Error toast appears instead
4. **Expected console output:**
   ```
   [Analytics] Event: stripe_checkout_redirect {
     event_category: 'conversion',
     event_label: 'luxury',
     pack_id: 'luxury',
     pack_price: 4.99,
     currency: 'USD'
   }
   ```

**Note:** This requires Stripe Payment Links to be configured in `js/payment.js`

**✅ Status:** ___________

---

### Event 5: Purchase Success
**What it tracks:** Payment completed successfully

**How to test:**
**Option A: Simulate with URL params**
1. Add `?purchase=success&pack=luxury` to URL
2. Reload page
3. **Expected console output:**
   ```
   [Analytics] Event: purchase_success {
     event_category: 'conversion',
     event_label: 'luxury',
     pack_id: 'luxury',
     pack_price: 4.99,
     currency: 'USD',
     transaction_id: '1234567890123'
   }
   [Analytics] Event: purchase {
     currency: 'USD',
     value: 4.99,
     items: [{...}]
   }
   ```

**Option B: Real Stripe purchase**
1. Complete real Stripe payment with test card (4242 4242 4242 4242)
2. Get redirected back with success params
3. See console output

**✅ Status:** ___________

---

### Event 6: Purchase Cancel
**What it tracks:** User cancelled payment

**How to test:**
**Option A: Simulate with URL params**
1. Add `?purchase=cancel` to URL
2. Reload page
3. **Expected console output:**
   ```
   [Analytics] Event: purchase_cancel {
     event_category: 'conversion',
     event_label: 'unknown',
     pack_id: 'unknown'
   }
   ```

**Option B: Real Stripe cancel**
1. Start Stripe checkout
2. Click "Back" or close checkout
3. Get redirected back with cancel params
4. See console output

**✅ Status:** ___________

---

### Event 7: Theme Unlock
**What it tracks:** Premium theme applied after unlock

**How to test:**
**Option A: Using dev console**
1. Open Browser Console
2. Run: `unlockPack('luxury')`
3. Open Settings modal
4. Click any Luxury Pack theme (e.g., "Golden Hour")
5. **Expected console output:**
   ```
   [Analytics] Event: theme_unlock {
     event_category: 'engagement',
     event_label: 'golden-hour',
     theme_id: 'golden-hour'
   }
   ```

**Option B: After real purchase**
1. Complete purchase flow (or simulate with URL)
2. Premium themes auto-unlock
3. Click unlocked theme to apply
4. See console output

**Note:** This event only fires for **premium** themes, not free themes

**✅ Status:** ___________

---

## Quick Test Commands (Browser Console)

```javascript
// Manually trigger events for testing
Analytics.trackThemeGalleryView();
Analytics.trackPremiumThemeView();
Analytics.trackBuyButtonClick('luxury', 4.99);
Analytics.trackStripeCheckoutRedirect('luxury', 4.99);
Analytics.trackPurchaseSuccess('luxury', 4.99);
Analytics.trackPurchaseCancel('luxury');
Analytics.trackThemeUnlock('golden-hour');

// Unlock all packs for testing Event 7
unlockAllPacks();

// Reset purchases
resetPurchases();

// Check if analytics module loaded
console.log(window.Analytics);
```

---

## Switching to Production Mode

When ready to send real data to Google Analytics:

1. **Get Google Analytics Measurement ID:**
   - Go to https://analytics.google.com/
   - Create a new GA4 property
   - Get your Measurement ID (format: `G-XXXXXXXXXX`)

2. **Update `js/analytics.js`:**
   ```javascript
   const GA_MEASUREMENT_ID = 'G-YOUR-ACTUAL-ID'; // Replace placeholder
   const DEBUG_MODE = false; // Set to false for production
   ```

3. **Deploy and test:**
   - Events will be sent to Google Analytics
   - View real-time reports in GA4 dashboard
   - No more console logs (unless you check DEBUG_MODE)

---

## Conversion Funnel in GA4

Once in production, you can view the funnel:

1. Go to GA4 → Reports → Engagement → Events
2. Create Custom Report with sequence:
   - `theme_gallery_view` (100% - baseline)
   - `premium_theme_view` (% who scrolled to premium)
   - `buy_button_click` (% who clicked buy)
   - `stripe_checkout_redirect` (% who started checkout)
   - `purchase_success` (% who completed payment)

3. Calculate conversion rates:
   - Preview rate: `premium_theme_view / theme_gallery_view`
   - Intent rate: `buy_button_click / premium_theme_view`
   - Checkout rate: `stripe_checkout_redirect / buy_button_click`
   - **Conversion rate: `purchase_success / stripe_checkout_redirect`**

---

## GDPR Compliance

✅ **Privacy-Safe:**
- No PII (Personally Identifiable Information) tracked
- Only anonymous behavioral events
- IP addresses anonymized (`anonymize_ip: true`)
- Users can opt-out via browser Do Not Track settings
- No cookies used for tracking (GA4 uses first-party storage)

---

## Troubleshooting

**Issue: No console logs appearing**
- Check if `js/analytics.js` is loaded (view source)
- Check if `Analytics.init()` is called in `main.js`
- Look for errors in console

**Issue: Events not firing**
- Ensure you're interacting with the UI correctly
- Check if the event conditions are met (e.g., premium theme must be unlocked for Event 7)
- Use manual trigger commands to test

**Issue: GA4 not receiving events (production)**
- Verify `DEBUG_MODE = false` in `js/analytics.js`
- Verify Measurement ID is correct (starts with `G-`)
- Check GA4 Real-time reports (events appear within 30 seconds)
- Check browser console for network errors

---

## Summary

All 7 conversion funnel events are now tracked:
- ✅ Event 1: Theme gallery view
- ✅ Event 2: Premium theme view
- ✅ Event 3: Buy button click
- ✅ Event 4: Stripe checkout redirect
- ✅ Event 5: Purchase success
- ✅ Event 6: Purchase cancel
- ✅ Event 7: Theme unlock

**Current Status:** Debug mode (console logs only)
**Production Ready:** Yes (just update Measurement ID and set DEBUG_MODE=false)
