// ==================== PWA SYSTEM ====================

/**
 * Register service worker and handle PWA installation
 */
function initPWA() {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
        // Register service worker
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/sw.js')
                .then((registration) => {
                    console.log('[PWA] Service Worker registered:', registration.scope);

                    // Check for updates periodically
                    setInterval(() => {
                        registration.update();
                    }, 60000); // Check every minute
                })
                .catch((error) => {
                    console.error('[PWA] Service Worker registration failed:', error);
                });
        });

        // Listen for service worker updates
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('[PWA] New service worker activated');
        });
    }

    // Handle PWA install prompt
    let deferredPrompt;

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('[PWA] Install prompt available');
        e.preventDefault();
        deferredPrompt = e;
        console.log('[PWA] App can be installed');
    });

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] App installed successfully');
        deferredPrompt = null;
    });

    // Detect if running as PWA (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
        console.log('[PWA] Running in standalone mode');
        document.body.classList.add('pwa-standalone');
    }
}
