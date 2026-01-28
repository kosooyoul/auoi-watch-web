/**
 * Streak Counter System
 * Feature: Track consecutive days of app usage
 * Research: Habitica, Athenify prove streaks are addictive
 * Revenue: $0 (retention booster - keeps users coming back)
 */

// Streak state
let currentStreak = 0;
let longestStreak = 0;
let lastVisitDate = null;

// Milestone thresholds
const MILESTONES = [7, 30, 100, 365];

// DOM elements
let streakContainer;
let streakNumber;

/**
 * Initialize streak system
 */
function initStreakSystem() {
    // Get DOM elements
    streakContainer = document.getElementById('streakContainer');
    streakNumber = document.getElementById('streakNumber');

    if (!streakContainer || !streakNumber) {
        console.error('Streak elements not found');
        return;
    }

    // Load streak data
    loadStreakData();

    // Record today's visit
    recordVisit();

    // Update UI
    updateStreakDisplay();

    // Check for milestone
    checkMilestone();

    console.log('✅ Streak system initialized', {
        currentStreak,
        longestStreak
    });
}

/**
 * Record today's visit
 */
function recordVisit() {
    const today = getTodayDateString();

    // If already visited today, do nothing
    if (lastVisitDate === today) {
        console.log('✓ Already visited today');
        return;
    }

    // Check if streak continues
    const yesterday = getYesterdayDateString();

    if (lastVisitDate === yesterday) {
        // Continue streak
        currentStreak++;
        console.log('🔥 Streak continued:', currentStreak);
    } else if (lastVisitDate === null) {
        // First visit ever
        currentStreak = 1;
        console.log('🎉 First visit! Streak started');
    } else {
        // Streak broken - start over
        console.log('💔 Streak broken. Starting over.');
        currentStreak = 1;
    }

    // Update longest streak
    if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
    }

    // Save data
    lastVisitDate = today;
    saveStreakData();

    // Update UI
    updateStreakDisplay();
}

/**
 * Get today's date as string (YYYY-MM-DD)
 */
function getTodayDateString() {
    const date = new Date();
    return formatDateString(date);
}

/**
 * Get yesterday's date as string (YYYY-MM-DD)
 */
function getYesterdayDateString() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return formatDateString(date);
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Update streak display
 */
function updateStreakDisplay() {
    if (!streakContainer || !streakNumber) {
        return;
    }

    if (currentStreak > 0) {
        streakNumber.textContent = currentStreak;
        streakContainer.style.display = 'flex';

        // Add animation on streak increase
        streakContainer.style.animation = 'none';
        setTimeout(() => {
            streakContainer.style.animation = 'streakPulse 0.6s ease';
        }, 10);
    } else {
        streakContainer.style.display = 'none';
    }
}

/**
 * Check if milestone reached and celebrate
 */
function checkMilestone() {
    // Find the milestone just reached (if any)
    const reachedMilestone = MILESTONES.find(m => m === currentStreak);

    if (reachedMilestone) {
        celebrateMilestone(reachedMilestone);
    }
}

/**
 * Celebrate milestone achievement
 */
function celebrateMilestone(days) {
    console.log('🎉 MILESTONE REACHED:', days, 'days!');

    // Show celebration modal
    showMilestoneModal(days);

    // Optional: Play sound, confetti, etc.
}

/**
 * Show milestone celebration modal
 */
function showMilestoneModal(days) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'milestone-modal';
    modal.innerHTML = `
        <div class="milestone-content">
            <div class="milestone-fire">🔥</div>
            <h2 class="milestone-title">${days} Day Streak!</h2>
            <p class="milestone-message">You're on fire! Keep it going!</p>
            <button class="milestone-btn" onclick="this.parentElement.parentElement.remove()">
                Awesome! 🎉
            </button>
        </div>
    `;

    // Add to page
    document.body.appendChild(modal);

    // Show with animation
    setTimeout(() => {
        modal.classList.add('active');
    }, 100);

    // Auto-close after 5 seconds
    setTimeout(() => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }, 5000);
}

/**
 * Load streak data from localStorage
 */
function loadStreakData() {
    try {
        const data = loadFromStorage('StreakData', {
            currentStreak: 0,
            longestStreak: 0,
            lastVisitDate: null
        });

        currentStreak = data.currentStreak;
        longestStreak = data.longestStreak;
        lastVisitDate = data.lastVisitDate;
    } catch (error) {
        console.error('Error loading streak data:', error);
    }
}

/**
 * Save streak data to localStorage
 */
function saveStreakData() {
    try {
        saveToStorage('StreakData', {
            currentStreak,
            longestStreak,
            lastVisitDate
        });
    } catch (error) {
        console.error('Error saving streak data:', error);
    }
}

/**
 * Get current streak (for external use)
 */
function getCurrentStreak() {
    return currentStreak;
}

/**
 * Get longest streak (for external use)
 */
function getLongestStreak() {
    return longestStreak;
}

/**
 * Reset streak (for testing)
 */
function resetStreak() {
    currentStreak = 0;
    longestStreak = 0;
    lastVisitDate = null;
    saveStreakData();
    updateStreakDisplay();
    console.log('🔄 Streak reset');
}
