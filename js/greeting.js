/**
 * Greeting System - Time-based personalized greetings
 * Feature: Display greeting that changes throughout the day
 * Research: Flocus (1M+ users) uses this for emotional connection
 */

// Greeting messages based on time of day
const GREETINGS = [
    {
        hours: [5, 6, 7, 8, 9, 10, 11],
        text: 'Good morning',
        emoji: '🌅',
        description: 'focus time'
    },
    {
        hours: [12, 13, 14, 15, 16],
        text: 'Good afternoon',
        emoji: '☀️',
        description: 'productive hours'
    },
    {
        hours: [17, 18, 19, 20],
        text: 'Good evening',
        emoji: '🌙',
        description: 'wind down'
    },
    {
        hours: [21, 22, 23, 0, 1, 2, 3, 4],
        text: 'Good night',
        emoji: '🌃',
        description: 'rest well'
    }
];

// DOM elements
let greetingContainer;
let greetingText;
let greetingEmoji;

// Settings
let userName = null;
let showDescription = true;

/**
 * Initialize greeting system
 */
function initGreeting() {
    // Get DOM elements
    greetingContainer = document.getElementById('greetingContainer');
    greetingText = document.getElementById('greetingText');
    greetingEmoji = document.getElementById('greetingEmoji');

    if (!greetingContainer || !greetingText || !greetingEmoji) {
        console.error('Greeting elements not found');
        return;
    }

    // Load user settings
    loadGreetingSettings();

    // Update greeting immediately
    updateGreeting();

    // Update every minute (in case hour changes)
    setInterval(updateGreeting, 60000);

    console.log('✅ Greeting system initialized');
}

/**
 * Get greeting for current time
 */
function getGreetingForTime(hour) {
    for (const greeting of GREETINGS) {
        if (greeting.hours.includes(hour)) {
            return greeting;
        }
    }
    // Fallback
    return GREETINGS[0];
}

/**
 * Update greeting display
 */
function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const greeting = getGreetingForTime(hour);

    // Build greeting text
    let displayText = greeting.text;

    // Add user name if set
    if (userName) {
        displayText += `, ${userName}`;
    }

    // Add description if enabled
    if (showDescription && greeting.description) {
        displayText += ` · ${greeting.description}`;
    }

    // Update DOM
    greetingText.textContent = displayText;
    greetingEmoji.textContent = greeting.emoji;

    // Add fade-in animation
    greetingContainer.style.animation = 'none';
    setTimeout(() => {
        greetingContainer.style.animation = 'fadeIn 0.5s ease';
    }, 10);
}

/**
 * Set user name for personalization
 * @param {string} name - User's name
 */
function setUserName(name) {
    userName = name || null;
    saveGreetingSettings();
    updateGreeting();
}

/**
 * Toggle description visibility
 * @param {boolean} show - Whether to show description
 */
function setShowDescription(show) {
    showDescription = show;
    saveGreetingSettings();
    updateGreeting();
}

/**
 * Load greeting settings from localStorage
 */
function loadGreetingSettings() {
    try {
        const settings = loadFromStorage('GreetingSettings', {
            userName: null,
            showDescription: true
        });
        userName = settings.userName;
        showDescription = settings.showDescription;
    } catch (error) {
        console.error('Error loading greeting settings:', error);
    }
}

/**
 * Save greeting settings to localStorage
 */
function saveGreetingSettings() {
    try {
        saveToStorage('GreetingSettings', {
            userName,
            showDescription
        });
    } catch (error) {
        console.error('Error saving greeting settings:', error);
    }
}

/**
 * Get current greeting (for external use)
 */
function getCurrentGreeting() {
    const hour = new Date().getHours();
    return getGreetingForTime(hour);
}
