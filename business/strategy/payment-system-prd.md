# Payment System PRD (Product Requirements Document)

**Document Version:** 1.0
**Date:** 2026-01-19
**Owner:** Business Planner
**For:** Developer Implementation

---

## Executive Summary

This document specifies the **payment system** required to sell premium theme packs. The system must handle:
- Stripe payment integration
- Purchase flow (select → pay → unlock)
- License key generation and validation
- Purchase history tracking
- Refund handling (future)

**Estimated Development Time:** 8-12 hours
**Priority:** High (blocks monetization launch)

---

## Business Context

**Product:** Ring Time Clock Web App
**Revenue Model:** One-time purchases (no subscriptions)
**Payment Provider:** Stripe
**Products:**
- Luxury Pack: $4.99 USD
- Nature Pack: $3.99 USD
- Neon Pack: $3.99 USD
- All Themes Bundle: $12.99 USD

**Expected Volume (First 6 months):**
- 100 purchases
- $790 total revenue
- Average transaction: $7.90

---

## User Stories

### User Story 1: Purchase a Theme Pack
**As a** free user
**I want to** purchase a premium theme pack
**So that** I can unlock and use premium themes

**Acceptance Criteria:**
- User can see locked premium themes in Settings
- User can click "Buy Pack" button
- User is redirected to Stripe Checkout page
- User completes payment on Stripe
- User is redirected back to app
- Premium themes are immediately unlocked
- User sees "Purchase Successful" confirmation

---

### User Story 2: Apply Purchased Theme
**As a** paying user
**I want to** apply my purchased themes
**So that** I can enjoy the premium design I paid for

**Acceptance Criteria:**
- Purchased themes no longer show lock icon
- User can click on purchased theme to apply it
- Theme applies immediately (no reload needed)
- Theme persists after browser refresh
- Theme syncs across devices (if using cloud storage)

---

### User Story 3: View Purchase History
**As a** paying user
**I want to** see what I've purchased
**So that** I can verify my purchase and access receipt

**Acceptance Criteria:**
- User can view "My Purchases" section
- Shows: Date, product name, price, receipt link
- Provides email receipt from Stripe
- Shows license key (if applicable)

---

## Functional Requirements

### 1. Stripe Integration

**Requirement:** Integrate Stripe Checkout for payment processing

**Implementation Options:**

#### Option A: Stripe Checkout (Recommended)
- **Pros:** Fully hosted, PCI compliant, no backend needed
- **Cons:** Redirects user to Stripe page
- **Best for:** Quick MVP launch

**Flow:**
1. User clicks "Buy Luxury Pack" button
2. Frontend generates Stripe Checkout session via API call to serverless function
3. User redirects to Stripe Checkout page (stripe.com)
4. User completes payment
5. Stripe redirects back to app with success/cancel status
6. Frontend unlocks themes based on success URL parameter

**Code Example:**
```javascript
// In payment.js
async function purchasePack(packId, packPrice) {
  // Call serverless function to create Stripe session
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      packId: packId,
      price: packPrice,
      successUrl: window.location.origin + '?purchase=success&pack=' + packId,
      cancelUrl: window.location.origin + '?purchase=cancel'
    })
  });

  const { sessionId } = await response.json();

  // Redirect to Stripe Checkout
  const stripe = Stripe('pk_live_...');
  await stripe.redirectToCheckout({ sessionId });
}
```

**Serverless Function (e.g., Vercel Function):**
```javascript
// /api/create-checkout-session.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const { packId, price, successUrl, cancelUrl } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: packId + ' Pack' },
        unit_amount: Math.round(price * 100), // $4.99 → 499 cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  res.status(200).json({ sessionId: session.id });
}
```

#### Option B: Stripe Payment Links (Alternative)
- **Pros:** No code needed, fastest setup (5 minutes)
- **Cons:** No dynamic unlocking (manual or webhook needed)
- **Best for:** Testing, beta launch

**Flow:**
1. Create payment links in Stripe Dashboard
2. "Buy Pack" button links to `https://buy.stripe.com/...`
3. User completes payment on Stripe
4. User manually enters license key or waits for email

---

### 2. Purchase Verification

**Requirement:** Verify purchase before unlocking themes

**Implementation:**

#### Approach A: URL Parameter (Simple, for MVP)
**After payment success:**
- Stripe redirects to: `https://yourapp.com?purchase=success&pack=luxury`
- Frontend reads URL param and unlocks pack
- Save purchase to localStorage

**Pros:** Simple, no backend needed
**Cons:** Insecure (users can manually add URL param to unlock)

**Code:**
```javascript
// In main.js or payment.js
function handlePurchaseRedirect() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('purchase') === 'success') {
    const pack = urlParams.get('pack');
    unlockPack(pack);
    showSuccessMessage('Thank you! Your premium themes are now unlocked.');
    // Clean URL
    window.history.replaceState({}, '', window.location.pathname);
  }
}

function unlockPack(packId) {
  const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
  if (!purchases.includes(packId)) {
    purchases.push(packId);
    localStorage.setItem('purchases', JSON.stringify(purchases));
  }
}
```

#### Approach B: License Key (More Secure)
**After payment:**
- Backend generates unique license key
- User enters license key in app
- Frontend validates key with backend
- Backend confirms payment, returns unlock permission

**Pros:** More secure, prevents free unlocks
**Cons:** Requires backend, more complex

---

### 3. Theme Unlock System

**Requirement:** Lock/unlock premium themes based on purchase status

**Implementation:**

**Data Structure (localStorage):**
```javascript
{
  purchases: {
    luxury: {
      purchased: true,
      date: '2026-01-19T10:00:00Z',
      price: 4.99,
      receipt: 'https://stripe.com/receipts/...'
    },
    nature: {
      purchased: false
    },
    neon: {
      purchased: false
    },
    bundle: {
      purchased: false
    }
  }
}
```

**Lock Logic:**
```javascript
// In theme.js
function isThemeUnlocked(themeName) {
  const theme = PREMIUM_THEMES.find(t => t.name === themeName);
  if (!theme) return true; // Free themes always unlocked

  const purchases = JSON.parse(localStorage.getItem('purchases') || '{}');
  const pack = theme.pack; // 'luxury', 'nature', or 'neon'

  // Check if pack or bundle purchased
  return purchases[pack]?.purchased || purchases.bundle?.purchased;
}

function renderThemeSelector() {
  const allThemes = [...THEMES, ...PREMIUM_THEMES];
  allThemes.forEach(theme => {
    const isUnlocked = isThemeUnlocked(theme.name);
    const card = createThemeCard(theme, isUnlocked);
    themeGrid.appendChild(card);
  });
}

function createThemeCard(theme, isUnlocked) {
  const card = document.createElement('div');
  card.className = 'theme-card';

  if (!isUnlocked) {
    card.classList.add('locked');
    card.innerHTML = `
      <div class="theme-preview" style="background: ${theme.background}">
        <div class="ring-preview" style="background: ${theme.hourRing}"></div>
      </div>
      <div class="theme-name">🔒 ${theme.name}</div>
      <button class="buy-button">Buy ${theme.pack} Pack</button>
    `;
    card.querySelector('.buy-button').onclick = () => purchasePack(theme.pack);
  } else {
    card.innerHTML = `
      <div class="theme-preview" style="background: ${theme.background}">
        <div class="ring-preview" style="background: ${theme.hourRing}"></div>
      </div>
      <div class="theme-name">${theme.name}</div>
    `;
    card.onclick = () => applyTheme(theme.name);
  }

  return card;
}
```

---

### 4. Purchase UI Flow

**Requirement:** Clear, intuitive purchase flow

**Screens:**

#### Screen 1: Theme Gallery (Settings Modal)
**Elements:**
- Grid of theme cards
- Free themes: No lock, clickable to apply
- Premium themes: Lock icon, "Buy Pack" button
- Pack badges: "Luxury Pack ($4.99)"
- Bundle banner: "Buy All 9 Themes - Save 20%"

**Actions:**
- Click theme → Apply (if free) OR Show "Buy Pack" button (if locked)
- Click "Buy Pack" → Redirect to Stripe Checkout

#### Screen 2: Stripe Checkout (External)
**Elements:**
- Stripe hosted page
- Product: "Luxury Pack - Ring Time Clock"
- Price: $4.99 USD
- Payment form (card, Apple Pay, Google Pay)

**Actions:**
- User enters payment info
- User clicks "Pay $4.99"
- Stripe processes payment
- Redirects back to app

#### Screen 3: Success Confirmation (Back in App)
**Elements:**
- Success message: "Thank you! Your premium themes are now unlocked."
- Visual feedback: Checkmark animation
- Action button: "Explore My Themes"

**Actions:**
- Auto-unlock purchased themes
- Update theme gallery (remove locks)
- Save purchase to localStorage

---

## Non-Functional Requirements

### 1. Performance
- Stripe Checkout redirect: <1 second
- Theme unlock after purchase: Instant (no reload)
- Purchase verification: <500ms

### 2. Security
- API keys stored in environment variables (not in frontend code)
- Stripe publishable key: `pk_live_...` (safe to expose)
- Stripe secret key: `sk_live_...` (NEVER expose, backend only)
- HTTPS required for Stripe integration
- CORS headers configured for API requests

### 3. Error Handling
- Payment fails → Show error message with retry button
- Network error → Show "Connection lost, please try again"
- Invalid license key → Show "Invalid key, please check and retry"
- Already purchased → Show "You already own this pack"

### 4. Analytics
- Track conversion funnel:
  - Theme gallery views
  - "Buy Pack" button clicks
  - Stripe Checkout redirects
  - Successful purchases
  - Abandoned checkouts

---

## Technical Specifications

### Required Environment Variables

```bash
# .env file (for serverless function)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Required NPM Packages (if using serverless functions)

```json
{
  "dependencies": {
    "stripe": "^14.0.0"
  }
}
```

### Stripe Account Setup

1. Create Stripe account at stripe.com
2. Complete account verification (business info, bank account)
3. Enable "Checkout" in Stripe Dashboard
4. Generate API keys (test and live)
5. Set up webhooks (optional, for advanced verification)

---

## Testing Checklist

### Before Launch
- [ ] Test Stripe Checkout redirect
- [ ] Test successful payment flow
- [ ] Test payment failure handling
- [ ] Test theme unlock after purchase
- [ ] Verify localStorage saves purchase data
- [ ] Test browser refresh (purchase persists)
- [ ] Test "already purchased" case
- [ ] Test all 4 products (3 packs + bundle)
- [ ] Verify receipt email sent by Stripe
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Test on desktop (Chrome, Firefox, Safari)

### Stripe Test Cards
- Success: `4242 4242 4242 4242` (any future date, any CVC)
- Decline: `4000 0000 0000 0002`
- Requires auth: `4000 0025 0000 3155`

---

## Launch Checklist

### Pre-Launch
- [ ] Stripe account verified
- [ ] Live API keys generated
- [ ] Serverless function deployed
- [ ] Environment variables set
- [ ] Payment flow tested end-to-end
- [ ] Error handling tested
- [ ] Analytics tracking implemented
- [ ] Receipt email template configured

### Post-Launch Monitoring
- [ ] Monitor Stripe Dashboard for transactions
- [ ] Track conversion rate (visits → purchases)
- [ ] Monitor failed payment rate (<5% acceptable)
- [ ] Check customer support emails for purchase issues
- [ ] Review Stripe logs for errors

---

## Revenue Tracking

### Metrics to Track (Monthly)
1. **Total Revenue** - Sum of all successful payments
2. **Transactions** - Count of purchases
3. **Average Order Value (AOV)** - Revenue ÷ Transactions
4. **Conversion Rate** - Purchases ÷ Theme Gallery Views
5. **Pack Breakdown** - % of sales for each pack
6. **Bundle Adoption** - % who buy bundle vs individual packs
7. **Failed Payments** - Count and reasons

### Expected Metrics (Month 1)
- Revenue: $237 (30 purchases × $7.90 avg)
- Transactions: 30
- AOV: $7.90
- Conversion: 3% (1,000 users → 30 purchases)
- Bundle adoption: 20% (6 bundles, 24 packs)

---

## Future Enhancements

### Phase 2 (Month 3-6)
- [ ] License key system for better security
- [ ] Email collection for purchase receipts
- [ ] Discount codes for promotions
- [ ] Gift card purchases
- [ ] Referral rewards (buy → share → earn)

### Phase 3 (Month 7-12)
- [ ] Subscription option ("Clock Pro" monthly)
- [ ] In-app purchase restore (cloud sync)
- [ ] Multiple payment methods (PayPal, Apple Pay)
- [ ] Regional pricing (adjust for local purchasing power)

---

## Developer Questions

**Before starting implementation, please answer:**

1. **Serverless function hosting:**
   - Will you use Vercel, Netlify, or custom backend?
   - Do you have experience with serverless functions?

2. **Stripe account:**
   - Do you have a Stripe account? (If not, Business Planner can create one)
   - Are you comfortable with Stripe API?

3. **Security approach:**
   - MVP: URL parameter (simple, less secure)
   - OR License key system (complex, more secure)?
   - **Recommendation:** URL parameter for MVP, license key for v2

4. **Purchase persistence:**
   - localStorage only (per-device)?
   - OR Cloud sync (requires backend/database)?
   - **Recommendation:** localStorage for MVP

5. **Estimated effort:**
   - How many hours do you estimate? (Business Planner estimate: 8-12h)
   - Any blockers or concerns?

---

## Success Criteria

### Technical Success
- Payment system functional with 0 critical bugs
- Purchase flow completes in <30 seconds
- 99%+ success rate for valid payments
- Themes unlock instantly after purchase

### Business Success (Month 1)
- 15+ successful purchases ($60+ revenue)
- <5% failed payment rate
- 0 refund requests due to bugs
- <2 customer support tickets per 10 purchases

---

## Appendix: Stripe Dashboard Setup Guide

### Step 1: Create Products in Stripe
1. Go to Products → Add Product
2. Create 4 products:
   - "Luxury Pack" - $4.99 USD, one-time
   - "Nature Pack" - $3.99 USD, one-time
   - "Neon Pack" - $3.99 USD, one-time
   - "All Themes Bundle" - $12.99 USD, one-time
3. Copy product/price IDs for code

### Step 2: Set Up Checkout
1. Settings → Checkout settings
2. Enable "Client-only integration" (no backend needed)
3. Set success URL: `https://yourapp.com?purchase=success&pack={CHECKOUT_SESSION_ID}`
4. Set cancel URL: `https://yourapp.com?purchase=cancel`

### Step 3: Generate API Keys
1. Developers → API Keys
2. Copy "Publishable key" (starts with `pk_live_...`)
3. Copy "Secret key" (starts with `sk_live_...`)
4. Store secret key securely (environment variable)

---

**Document Owner:** Business Planner
**Last Updated:** 2026-01-19
**Status:** Ready for Development
**Dependencies:** Premium Themes Spec (completed)
**Next:** Developer implementation + testing
