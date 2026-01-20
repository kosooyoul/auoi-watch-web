// Payment system using Stripe Payment Links
// No server required - direct redirect to Stripe-hosted checkout

// Stripe Payment Links (Test Mode)
// TODO: Replace these URLs with actual Payment Links from Stripe Dashboard
const PAYMENT_LINKS = {
    luxury: 'https://buy.stripe.com/test_PLACEHOLDER_LUXURY',
    nature: 'https://buy.stripe.com/test_PLACEHOLDER_NATURE',
    neon: 'https://buy.stripe.com/test_PLACEHOLDER_NEON',
    bundle: 'https://buy.stripe.com/test_PLACEHOLDER_BUNDLE'
};

// Purchase flow: Redirect to Stripe Payment Link
function purchasePack(packId) {
    const paymentLink = PAYMENT_LINKS[packId];

    if (!paymentLink || paymentLink.includes('PLACEHOLDER')) {
        alert('Payment system is not configured yet. Please set up Stripe Payment Links first.\n\nSee instructions in STRIPE_SETUP.md');
        console.error('Payment link not configured for pack:', packId);
        return;
    }

    // Store pack ID in localStorage (to identify which pack was purchased after redirect)
    localStorage.setItem('pendingPurchase', packId);

    // Redirect to Stripe Payment Link
    window.location.href = paymentLink;
}

// Handle successful payment (called after redirect back from Stripe)
function handlePurchaseSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const purchaseStatus = urlParams.get('purchase');
    const packId = urlParams.get('pack');

    if (purchaseStatus === 'success' && packId) {
        // Unlock the purchased pack
        unlockPack(packId, { source: 'stripe', date: new Date().toISOString() });

        // Clear pending purchase
        localStorage.removeItem('pendingPurchase');

        // Show success message
        showPurchaseSuccessMessage(packId);

        // Clean URL (remove query params)
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    } else if (purchaseStatus === 'cancel') {
        // User cancelled payment
        localStorage.removeItem('pendingPurchase');

        // Show cancel message
        alert('Payment cancelled. Your themes remain locked.');

        // Clean URL
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
}

// Show success message after purchase
function showPurchaseSuccessMessage(packId) {
    const packNames = {
        luxury: 'Luxury Pack',
        nature: 'Nature Pack',
        neon: 'Neon Pack',
        bundle: 'All Themes Bundle'
    };

    const packName = packNames[packId] || packId;

    // Create success modal
    const successModal = document.createElement('div');
    successModal.className = 'purchase-success-modal';
    successModal.innerHTML = `
        <div class="purchase-success-content">
            <div class="success-checkmark">✓</div>
            <h2>Purchase Successful!</h2>
            <p>You've unlocked the <strong>${packName}</strong></p>
            <p class="success-subtitle">Your themes are ready to use</p>
            <button class="explore-themes-btn" onclick="closePurchaseSuccessModal()">Explore Your Themes</button>
        </div>
    `;

    document.body.appendChild(successModal);

    // Fade in
    setTimeout(() => successModal.classList.add('active'), 10);

    // Auto-close after 5 seconds
    setTimeout(() => {
        closePurchaseSuccessModal();
    }, 5000);
}

// Close success modal
function closePurchaseSuccessModal() {
    const modal = document.querySelector('.purchase-success-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Initialize payment system
function initPaymentSystem() {
    // Check for payment redirect on page load
    handlePurchaseSuccess();

    console.log('Payment system initialized');
}

// Make functions globally accessible
window.purchasePack = purchasePack;
window.closePurchaseSuccessModal = closePurchaseSuccessModal;
