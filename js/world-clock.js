// ==================== WORLD CLOCK SYSTEM ====================

// WORLD_CITIES is imported from constants.js

// World clocks storage
let worldClocks = [];
let worldClockUpdateInterval = null;

/**
 * Initialize World Clock system
 */
function initWorldClockSystem() {
    // Populate city dropdown
    const citySelect = document.getElementById('citySelect');
    WORLD_CITIES.forEach(city => {
        const option = document.createElement('option');
        option.value = city.timezone;
        option.textContent = `${city.name} (${city.country})`;
        option.dataset.cityName = city.name;
        option.dataset.country = city.country;
        citySelect.appendChild(option);
    });

    // Populate converter city dropdowns
    populateConverterDropdowns();

    // Populate meeting finder dropdown
    populateMeetingFinderDropdown();

    // Load saved world clocks
    loadWorldClocks();

    // Initialize world clock modal
    const worldClockBtn = document.getElementById('worldClockBtn');
    const worldClockModal = document.getElementById('worldClockModal');
    const worldClockCloseBtn = document.getElementById('worldClockCloseBtn');

    initModal({
        openButton: worldClockBtn,
        modal: worldClockModal,
        closeButton: worldClockCloseBtn,
        onOpen: updateWorldClocks
    });

    // Add city button
    const addCityBtn = document.getElementById('addCityBtn');
    addCityBtn.addEventListener('click', () => {
        const selectedOption = citySelect.options[citySelect.selectedIndex];
        if (citySelect.value && selectedOption) {
            addWorldClock(
                citySelect.value,
                selectedOption.dataset.cityName,
                selectedOption.dataset.country
            );
            citySelect.selectedIndex = 0; // Reset selection
        }
    });

    // Initialize time zone converter
    initTimeZoneConverter();

    // Initialize meeting time finder
    initMeetingTimeFinder();

    // Start auto-update (every second)
    worldClockUpdateInterval = setInterval(updateWorldClocks, 1000);
}

/**
 * Add a new world clock
 * @param {string} timezone - IANA timezone identifier
 * @param {string} cityName - City name
 * @param {string} country - Country name
 */
function addWorldClock(timezone, cityName, country) {
    // Check if already exists
    if (worldClocks.some(clock => clock.timezone === timezone)) {
        alert(`${cityName} is already added`);
        return;
    }

    const clock = {
        id: Date.now().toString(),
        timezone,
        cityName,
        country
    };

    worldClocks.push(clock);
    saveWorldClocks();
    renderWorldClocks();
}

/**
 * Delete a world clock
 * @param {string} id - Clock ID
 */
function deleteWorldClock(id) {
    worldClocks = worldClocks.filter(clock => clock.id !== id);
    saveWorldClocks();
    renderWorldClocks();
}

/**
 * Render world clocks list
 */
function renderWorldClocks() {
    const worldClockList = document.getElementById('worldClockList');
    const emptyState = document.getElementById('emptyWorldClockState');

    if (worldClocks.length === 0) {
        emptyState.style.display = 'block';
        worldClockList.querySelectorAll('.clock-card').forEach(card => card.remove());
        return;
    }

    emptyState.style.display = 'none';

    // Remove old cards
    worldClockList.querySelectorAll('.clock-card').forEach(card => card.remove());

    // Create new cards
    worldClocks.forEach(clock => {
        const card = createClockCard(clock);
        worldClockList.appendChild(card);
    });

    // Update times immediately
    updateWorldClocks();
}

/**
 * Create a clock card element
 * @param {Object} clock - Clock data
 * @returns {HTMLElement} Clock card element
 */
function createClockCard(clock) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.dataset.clockId = clock.id;
    card.dataset.timezone = clock.timezone;

    card.innerHTML = `
        <div class="clock-day-night-indicator" data-day-night></div>
        <div class="clock-info">
            <div class="clock-city">${clock.cityName}</div>
            <div class="clock-time" data-clock-time>--:--:--</div>
            <div class="clock-date" data-clock-date>---</div>
            <div class="clock-offset" data-clock-offset>UTC --</div>
        </div>
        <div class="clock-actions">
            <button class="delete-clock-btn" aria-label="Delete ${clock.cityName}">
                🗑️
            </button>
        </div>
    `;

    // Delete button
    const deleteBtn = card.querySelector('.delete-clock-btn');
    deleteBtn.addEventListener('click', () => {
        deleteWorldClock(clock.id);
    });

    return card;
}

/**
 * Update all world clock times
 */
function updateWorldClocks() {
    const cards = document.querySelectorAll('.clock-card');

    cards.forEach(card => {
        const timezone = card.dataset.timezone;
        const timeElement = card.querySelector('[data-clock-time]');
        const dateElement = card.querySelector('[data-clock-date]');
        const offsetElement = card.querySelector('[data-clock-offset]');
        const dayNightIndicator = card.querySelector('[data-day-night]');

        try {
            // Get current time in the timezone
            const now = new Date();

            // Format time based on timeFormat setting
            const use12Hour = (timeFormat === '12h');
            const timeFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: use12Hour
            });
            const formattedTime = timeFormatter.format(now);
            timeElement.textContent = formattedTime;

            // Format date
            const dateFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            const formattedDate = dateFormatter.format(now);
            dateElement.textContent = formattedDate;

            // Calculate UTC offset
            const timezoneFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                timeZoneName: 'shortOffset'
            });
            const parts = timezoneFormatter.formatToParts(now);
            const offsetPart = parts.find(part => part.type === 'timeZoneName');
            const offset = offsetPart ? offsetPart.value : 'UTC';
            offsetElement.textContent = offset;

            // Update day/night indicator
            const hourFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                hour: 'numeric',
                hour12: false
            });
            const hourStr = hourFormatter.format(now);
            const hour = parseInt(hourStr);

            if (dayNightIndicator) {
                if (hour >= 6 && hour < 12) {
                    dayNightIndicator.className = 'clock-day-night-indicator morning';
                    dayNightIndicator.textContent = '🌅';
                } else if (hour >= 12 && hour < 18) {
                    dayNightIndicator.className = 'clock-day-night-indicator day';
                    dayNightIndicator.textContent = '☀️';
                } else if (hour >= 18 && hour < 22) {
                    dayNightIndicator.className = 'clock-day-night-indicator evening';
                    dayNightIndicator.textContent = '🌆';
                } else {
                    dayNightIndicator.className = 'clock-day-night-indicator night';
                    dayNightIndicator.textContent = '🌙';
                }
            }
        } catch (error) {
            console.error(`Error updating time for timezone ${timezone}:`, error);
            timeElement.textContent = 'Error';
            dateElement.textContent = 'Invalid timezone';
            offsetElement.textContent = '';
        }
    });
}

/**
 * Save world clocks to localStorage
 */
function saveWorldClocks() {
    saveToStorage('WorldClocks', worldClocks);
}

/**
 * Load world clocks from localStorage
 */
function loadWorldClocks() {
    worldClocks = loadFromStorage('WorldClocks', []);
    if (worldClocks.length > 0) {
        renderWorldClocks();
    }
}

// ==================== TIME ZONE CONVERTER ====================

/**
 * Populate converter dropdowns with cities
 */
function populateConverterDropdowns() {
    const fromSelect = document.getElementById('converterFromCity');
    const toSelect = document.getElementById('converterToCity');

    if (!fromSelect || !toSelect) return;

    WORLD_CITIES.forEach(city => {
        const option1 = document.createElement('option');
        option1.value = city.timezone;
        option1.textContent = `${city.name} (${city.country})`;
        option1.dataset.cityName = city.name;
        fromSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = city.timezone;
        option2.textContent = `${city.name} (${city.country})`;
        option2.dataset.cityName = city.name;
        toSelect.appendChild(option2);
    });
}

/**
 * Initialize time zone converter
 */
function initTimeZoneConverter() {
    const fromSelect = document.getElementById('converterFromCity');
    const toSelect = document.getElementById('converterToCity');
    const timeInput = document.getElementById('converterTime');

    if (!fromSelect || !toSelect || !timeInput) return;

    // Set default values to user's timezone and UTC
    try {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        fromSelect.value = userTimezone;

        // Set To to UTC or New York
        const nyTimezone = 'America/New_York';
        if (toSelect.querySelector(`option[value="${nyTimezone}"]`)) {
            toSelect.value = nyTimezone;
        }
    } catch (error) {
        console.warn('Could not set default timezones:', error);
    }

    // Event listeners
    fromSelect.addEventListener('change', convertTime);
    toSelect.addEventListener('change', convertTime);
    timeInput.addEventListener('change', convertTime);

    // Initial conversion
    convertTime();
}

/**
 * Convert time between time zones
 */
function convertTime() {
    const fromSelect = document.getElementById('converterFromCity');
    const toSelect = document.getElementById('converterToCity');
    const timeInput = document.getElementById('converterTime');
    const convertedTimeDisplay = document.getElementById('convertedTime');

    if (!fromSelect.value || !toSelect.value || !timeInput.value) {
        convertedTimeDisplay.textContent = '--:--';
        return;
    }

    try {
        // Parse input time (HH:MM format)
        const [hours, minutes] = timeInput.value.split(':').map(Number);

        // Create a date object for today with the specified time in the "from" timezone
        const now = new Date();
        const fromFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: fromSelect.value,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        });

        // Get date parts in from timezone
        const fromParts = fromFormatter.formatToParts(now);
        const fromYear = parseInt(fromParts.find(p => p.type === 'year').value);
        const fromMonth = parseInt(fromParts.find(p => p.type === 'month').value) - 1;
        const fromDay = parseInt(fromParts.find(p => p.type === 'day').value);

        // Create date with specified time in UTC, then adjust
        const targetDate = new Date(Date.UTC(fromYear, fromMonth, fromDay, hours, minutes));

        // Get the offset for the from timezone
        const fromDate = new Date(fromYear, fromMonth, fromDay, hours, minutes);
        const fromOffsetMs = getTimezoneOffset(fromDate, fromSelect.value);

        // Adjust target date
        targetDate.setTime(targetDate.getTime() - fromOffsetMs);

        // Format in "to" timezone
        const use12Hour = (timeFormat === '12h');
        const toFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: toSelect.value,
            hour: '2-digit',
            minute: '2-digit',
            hour12: use12Hour
        });

        const convertedTime = toFormatter.format(targetDate);
        convertedTimeDisplay.textContent = convertedTime;

        // Add day difference indicator
        const toParts = new Intl.DateTimeFormat('en-US', {
            timeZone: toSelect.value,
            day: 'numeric'
        }).formatToParts(targetDate);
        const toDay = parseInt(toParts.find(p => p.type === 'day').value);

        if (toDay !== fromDay) {
            const diff = toDay > fromDay ? '+1 day' : '-1 day';
            convertedTimeDisplay.textContent += ` (${diff})`;
        }
    } catch (error) {
        console.error('Time conversion error:', error);
        convertedTimeDisplay.textContent = 'Error';
    }
}

/**
 * Get timezone offset in milliseconds
 */
function getTimezoneOffset(date, timezone) {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return utcDate.getTime() - tzDate.getTime();
}

// ==================== MEETING TIME FINDER ====================

let meetingCities = [];

/**
 * Populate meeting finder dropdown
 */
function populateMeetingFinderDropdown() {
    const meetingSelect = document.getElementById('meetingCitySelect');
    if (!meetingSelect) return;

    WORLD_CITIES.forEach(city => {
        const option = document.createElement('option');
        option.value = city.timezone;
        option.textContent = `${city.name} (${city.country})`;
        option.dataset.cityName = city.name;
        meetingSelect.appendChild(option);
    });
}

/**
 * Initialize meeting time finder
 */
function initMeetingTimeFinder() {
    const addBtn = document.getElementById('addMeetingCityBtn');
    const citySelect = document.getElementById('meetingCitySelect');

    if (!addBtn || !citySelect) return;

    addBtn.addEventListener('click', () => {
        const selectedOption = citySelect.options[citySelect.selectedIndex];
        if (citySelect.value && selectedOption) {
            addMeetingCity(citySelect.value, selectedOption.dataset.cityName);
            citySelect.selectedIndex = 0;
        }
    });
}

/**
 * Add city to meeting finder
 */
function addMeetingCity(timezone, cityName) {
    // Check if already added
    if (meetingCities.some(c => c.timezone === timezone)) {
        alert(`${cityName} is already added`);
        return;
    }

    meetingCities.push({ timezone, cityName });
    renderMeetingCities();
    findOptimalMeetingTimes();
}

/**
 * Remove city from meeting finder
 */
function removeMeetingCity(timezone) {
    meetingCities = meetingCities.filter(c => c.timezone !== timezone);
    renderMeetingCities();

    if (meetingCities.length >= 2) {
        findOptimalMeetingTimes();
    } else {
        document.getElementById('meetingSuggestions').style.display = 'none';
    }
}

/**
 * Render meeting cities list
 */
function renderMeetingCities() {
    const listContainer = document.getElementById('meetingCitiesList');
    if (!listContainer) return;

    if (meetingCities.length === 0) {
        listContainer.innerHTML = '<p class="empty-meeting-state">Add cities to find optimal meeting times</p>';
        return;
    }

    listContainer.innerHTML = meetingCities.map(city => `
        <div class="meeting-city-tag">
            <span>${city.cityName}</span>
            <button class="remove-meeting-city" data-timezone="${city.timezone}">×</button>
        </div>
    `).join('');

    // Add remove event listeners
    listContainer.querySelectorAll('.remove-meeting-city').forEach(btn => {
        btn.addEventListener('click', () => {
            removeMeetingCity(btn.dataset.timezone);
        });
    });
}

/**
 * Find optimal meeting times across all cities
 */
function findOptimalMeetingTimes() {
    if (meetingCities.length < 2) {
        return;
    }

    const suggestions = [];
    const now = new Date();

    // Check hours from 8 AM to 8 PM
    for (let hour = 8; hour <= 20; hour++) {
        const scores = meetingCities.map(city => {
            return scoreMeetingTime(hour, city.timezone);
        });

        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const minScore = Math.min(...scores);

        // Only suggest if minimum score is acceptable (> 50) and avg is good (> 70)
        if (minScore > 50 && avgScore > 70) {
            suggestions.push({
                hour,
                avgScore,
                minScore,
                times: meetingCities.map(city => ({
                    city: city.cityName,
                    time: formatTimeInTimezone(hour, city.timezone)
                }))
            });
        }
    }

    // Sort by average score
    suggestions.sort((a, b) => b.avgScore - a.avgScore);

    // Display top 3 suggestions
    displayMeetingSuggestions(suggestions.slice(0, 3));
}

/**
 * Score a meeting time for a timezone (0-100)
 * Higher score = better time
 */
function scoreMeetingTime(hour, timezone) {
    // Business hours (9 AM - 6 PM) = 100
    // Morning (7-9 AM) / Evening (6-9 PM) = 70
    // Early morning (6-7 AM) / Late evening (9-10 PM) = 40
    // Night/Very early (other times) = 0

    if (hour >= 9 && hour <= 18) return 100;
    if ((hour >= 7 && hour < 9) || (hour > 18 && hour <= 21)) return 70;
    if ((hour >= 6 && hour < 7) || (hour > 21 && hour <= 22)) return 40;
    return 0;
}

/**
 * Format hour in specific timezone
 */
function formatTimeInTimezone(hour, timezone) {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);

    const use12Hour = (timeFormat === '12h');
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: use12Hour
    });

    return formatter.format(date);
}

/**
 * Display meeting suggestions
 */
function displayMeetingSuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('meetingSuggestions');
    const suggestionsList = document.getElementById('suggestionsList');

    if (!suggestionsContainer || !suggestionsList) return;

    if (suggestions.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    suggestionsContainer.style.display = 'block';

    suggestionsList.innerHTML = suggestions.map((suggestion, index) => `
        <div class="suggestion-card">
            <div class="suggestion-rank">#${index + 1}</div>
            <div class="suggestion-times">
                ${suggestion.times.map(t => `
                    <div class="suggestion-time-row">
                        <span class="suggestion-city">${t.city}:</span>
                        <span class="suggestion-time">${t.time}</span>
                    </div>
                `).join('')}
            </div>
            <div class="suggestion-score">Score: ${Math.round(suggestion.avgScore)}/100</div>
        </div>
    `).join('');
}
