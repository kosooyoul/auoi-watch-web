// ==================== CONSTANTS ====================

// Theme definitions
const THEMES = {
    classic: {
        name: 'Classic',
        bgPrimary: '#1e1e2e',
        bgSecondary: '#2d2d44',
        textPrimary: '#ffffff',
        textSecondary: '#e0e0e0',
        textMuted: 'rgba(255, 255, 255, 0.5)',
        textTime: 'rgba(255, 255, 255, 0.7)',
        ringBg: 'rgba(128, 128, 128, 0.2)',
        ringHour: { start: '#667eea', mid: '#764ba2', end: '#9333ea' },
        ringMinute: { start: '#f093fb', mid: '#f5576c', end: '#ff6b81' },
        ringSecond: { start: '#4facfe', mid: '#00f2fe', end: '#40e0d0' },
        ringMs: { start: '#43e97b', mid: '#38f9d7', end: '#7fffd4' }
    },
    warm: {
        name: 'Warm Sunset',
        bgPrimary: '#2d1b1b',
        bgSecondary: '#4a2828',
        textPrimary: '#ffffff',
        textSecondary: '#ffe4e4',
        textMuted: 'rgba(255, 228, 228, 0.5)',
        textTime: 'rgba(255, 228, 228, 0.7)',
        ringBg: 'rgba(255, 107, 107, 0.15)',
        ringHour: { start: '#ff6b6b', mid: '#ee5a6f', end: '#ff4757' },
        ringMinute: { start: '#ffa600', mid: '#ff8c42', end: '#ff7f50' },
        ringSecond: { start: '#ff8c42', mid: '#ff6348', end: '#ff4757' },
        ringMs: { start: '#ffd93d', mid: '#feca57', end: '#ffb142' }
    },
    ocean: {
        name: 'Ocean Breeze',
        bgPrimary: '#0a1929',
        bgSecondary: '#1a2332',
        textPrimary: '#ffffff',
        textSecondary: '#e0f2fe',
        textMuted: 'rgba(224, 242, 254, 0.5)',
        textTime: 'rgba(224, 242, 254, 0.7)',
        ringBg: 'rgba(14, 165, 233, 0.15)',
        ringHour: { start: '#1e3a8a', mid: '#1e40af', end: '#2563eb' },
        ringMinute: { start: '#0ea5e9', mid: '#0284c7', end: '#0369a1' },
        ringSecond: { start: '#06b6d4', mid: '#0891b2', end: '#0e7490' },
        ringMs: { start: '#67e8f9', mid: '#22d3ee', end: '#06b6d4' }
    },
    neon: {
        name: 'Neon Night',
        bgPrimary: '#0d0221',
        bgSecondary: '#1a0b3f',
        textPrimary: '#ffffff',
        textSecondary: '#f0f0ff',
        textMuted: 'rgba(240, 240, 255, 0.5)',
        textTime: 'rgba(240, 240, 255, 0.7)',
        ringBg: 'rgba(255, 0, 255, 0.15)',
        ringHour: { start: '#ff00ff', mid: '#d946ef', end: '#c026d3' },
        ringMinute: { start: '#00ffff', mid: '#06b6d4', end: '#0891b2' },
        ringSecond: { start: '#ff00aa', mid: '#ec4899', end: '#db2777' },
        ringMs: { start: '#00ff00', mid: '#22c55e', end: '#16a34a' }
    },
    pastel: {
        name: 'Soft Pastel',
        bgPrimary: '#f8f9fa',
        bgSecondary: '#e9ecef',
        textPrimary: '#212529',
        textSecondary: '#495057',
        textMuted: 'rgba(73, 80, 87, 0.5)',
        textTime: 'rgba(73, 80, 87, 0.7)',
        ringBg: 'rgba(173, 181, 189, 0.3)',
        ringHour: { start: '#ffc6ff', mid: '#e7c6ff', end: '#c8b6ff' },
        ringMinute: { start: '#bdb2ff', mid: '#a0c4ff', end: '#9bf6ff' },
        ringSecond: { start: '#a0c4ff', mid: '#9bf6ff', end: '#caffbf' },
        ringMs: { start: '#caffbf', mid: '#a7f3d0', end: '#6ee7b7' }
    }
};

// Major cities with IANA timezone identifiers
const WORLD_CITIES = [
    { name: 'Seoul', timezone: 'Asia/Seoul', country: 'South Korea' },
    { name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan' },
    { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'Hong Kong' },
    { name: 'Singapore', timezone: 'Asia/Singapore', country: 'Singapore' },
    { name: 'Shanghai', timezone: 'Asia/Shanghai', country: 'China' },
    { name: 'Dubai', timezone: 'Asia/Dubai', country: 'UAE' },
    { name: 'Mumbai', timezone: 'Asia/Kolkata', country: 'India' },
    { name: 'Moscow', timezone: 'Europe/Moscow', country: 'Russia' },
    { name: 'Istanbul', timezone: 'Europe/Istanbul', country: 'Turkey' },
    { name: 'Paris', timezone: 'Europe/Paris', country: 'France' },
    { name: 'London', timezone: 'Europe/London', country: 'UK' },
    { name: 'Berlin', timezone: 'Europe/Berlin', country: 'Germany' },
    { name: 'New York', timezone: 'America/New_York', country: 'USA' },
    { name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'USA' },
    { name: 'Chicago', timezone: 'America/Chicago', country: 'USA' },
    { name: 'Toronto', timezone: 'America/Toronto', country: 'Canada' },
    { name: 'Mexico City', timezone: 'America/Mexico_City', country: 'Mexico' },
    { name: 'São Paulo', timezone: 'America/Sao_Paulo', country: 'Brazil' },
    { name: 'Sydney', timezone: 'Australia/Sydney', country: 'Australia' },
    { name: 'Auckland', timezone: 'Pacific/Auckland', country: 'New Zealand' }
];

// Clock configuration
const CLOCK_CONFIG = {
    HOURS_IN_DAY: 24,
    MINUTES_IN_HOUR: 60,
    SECONDS_IN_MINUTE: 60,
    MS_IN_SECOND: 1000
};

// Export as standalone constants for convenience
const HOURS_IN_DAY = CLOCK_CONFIG.HOURS_IN_DAY;
const MINUTES_IN_HOUR = CLOCK_CONFIG.MINUTES_IN_HOUR;
const SECONDS_IN_MINUTE = CLOCK_CONFIG.SECONDS_IN_MINUTE;
const MS_IN_SECOND = CLOCK_CONFIG.MS_IN_SECOND;

// ==================== PREMIUM THEMES ====================

/**
 * Premium theme packs for monetization
 * Each theme uses simplified structure that will be expanded to full structure on application
 * See: business/strategy/premium-themes-spec.md
 */
const PREMIUM_THEMES = [
    // ===== LUXURY PACK ($4.99) =====
    {
        id: 'goldenHour',
        name: 'Golden Hour',
        pack: 'luxury',
        price: 4.99,
        description: 'Opulent gold with warm amber tones',
        background: '#1a1410',
        text: '#f4e4c1',
        hourRing: '#d4af37',
        minuteRing: '#ffd700',
        secondRing: '#ffed4e',
        millisecondRing: '#fff8dc'
    },
    {
        id: 'midnightMarble',
        name: 'Midnight Marble',
        pack: 'luxury',
        price: 4.99,
        description: 'Dark marble with silver and blue-gray accents',
        background: '#0f0f13',
        text: '#d8dce6',
        hourRing: '#4a5568',
        minuteRing: '#718096',
        secondRing: '#a0aec0',
        millisecondRing: '#cbd5e0'
    },
    {
        id: 'roseGoldElegance',
        name: 'Rose Gold Elegance',
        pack: 'luxury',
        price: 4.99,
        description: 'Feminine rose gold with warm pink tones',
        background: '#1c1315',
        text: '#f5e6e8',
        hourRing: '#b76e79',
        minuteRing: '#d4a5a5',
        secondRing: '#e8c4bc',
        millisecondRing: '#f7e7e5'
    },

    // ===== NATURE PACK ($3.99) =====
    {
        id: 'forestTwilight',
        name: 'Forest Twilight',
        pack: 'nature',
        price: 3.99,
        description: 'Deep forest greens with moss and sage tones',
        background: '#0d1b0f',
        text: '#d4e4d4',
        hourRing: '#2d5016',
        minuteRing: '#4a7c59',
        secondRing: '#6b9b7e',
        millisecondRing: '#a8d5ba'
    },
    {
        id: 'oceanDepths',
        name: 'Ocean Depths',
        pack: 'nature',
        price: 3.99,
        description: 'Deep ocean blues with turquoise and aqua accents',
        background: '#0a1118',
        text: '#d4f1f9',
        hourRing: '#1e3a5f',
        minuteRing: '#2c5f8d',
        secondRing: '#4a9aba',
        millisecondRing: '#7ec8e3'
    },
    {
        id: 'desertDawn',
        name: 'Desert Dawn',
        pack: 'nature',
        price: 3.99,
        description: 'Warm desert sands with terracotta and amber',
        background: '#1a1410',
        text: '#f9f3e8',
        hourRing: '#8b5a2b',
        minuteRing: '#b8733c',
        secondRing: '#d4a373',
        millisecondRing: '#e8d5b7'
    },

    // ===== NEON PACK ($3.99) =====
    {
        id: 'cyberpunkMagenta',
        name: 'Cyberpunk Magenta',
        pack: 'neon',
        price: 3.99,
        description: 'Electric magenta with hot pink and purple',
        background: '#0d0221',
        text: '#f9d7ff',
        hourRing: '#a40e4c',
        minuteRing: '#d81e5b',
        secondRing: '#f15bb5',
        millisecondRing: '#fda4d8'
    },
    {
        id: 'electricLime',
        name: 'Electric Lime',
        pack: 'neon',
        price: 3.99,
        description: 'Vibrant lime green with neon yellow accents',
        background: '#0a0e09',
        text: '#e8ffd4',
        hourRing: '#3d8b37',
        minuteRing: '#5fbf4c',
        secondRing: '#8fde82',
        millisecondRing: '#c0f2b4'
    },
    {
        id: 'neonUltraviolet',
        name: 'Neon Ultraviolet',
        pack: 'neon',
        price: 3.99,
        description: 'Deep ultraviolet with electric purple and blue',
        background: '#0d0221',
        text: '#e9d5ff',
        hourRing: '#5b21b6',
        minuteRing: '#7c3aed',
        secondRing: '#a78bfa',
        millisecondRing: '#c4b5fd'
    }
];

// Pack metadata for monetization
const THEME_PACKS = {
    luxury: {
        name: 'Luxury Pack',
        price: 4.99,
        themes: ['goldenHour', 'midnightMarble', 'roseGoldElegance'],
        description: '3 opulent themes: Golden Hour, Midnight Marble, Rose Gold Elegance'
    },
    nature: {
        name: 'Nature Pack',
        price: 3.99,
        themes: ['forestTwilight', 'oceanDepths', 'desertDawn'],
        description: '3 natural themes: Forest Twilight, Ocean Depths, Desert Dawn'
    },
    neon: {
        name: 'Neon Pack',
        price: 3.99,
        themes: ['cyberpunkMagenta', 'electricLime', 'neonUltraviolet'],
        description: '3 vibrant themes: Cyberpunk Magenta, Electric Lime, Neon Ultraviolet'
    },
    bundle: {
        name: 'All Themes Bundle',
        price: 12.99,
        themes: ['goldenHour', 'midnightMarble', 'roseGoldElegance', 'forestTwilight', 'oceanDepths', 'desertDawn', 'cyberpunkMagenta', 'electricLime', 'neonUltraviolet'],
        description: 'All 9 premium themes - Save 20%',
        discount: 0.20
    }
};
