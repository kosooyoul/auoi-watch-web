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

    // Load saved world clocks
    loadWorldClocks();

    // Modal open/close
    const worldClockBtn = document.getElementById('worldClockBtn');
    const worldClockModal = document.getElementById('worldClockModal');
    const worldClockCloseBtn = document.getElementById('worldClockCloseBtn');

    worldClockBtn.addEventListener('click', () => {
        worldClockModal.classList.add('show');
        updateWorldClocks(); // Update times when modal opens
    });

    worldClockCloseBtn.addEventListener('click', () => {
        worldClockModal.classList.remove('show');
    });

    worldClockModal.addEventListener('click', (e) => {
        if (e.target === worldClockModal) {
            worldClockModal.classList.remove('show');
        }
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

        try {
            // Get current time in the timezone
            const now = new Date();

            // Format time
            const timeFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
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
    try {
        localStorage.setItem('ringClockWorldClocks', JSON.stringify(worldClocks));
    } catch (error) {
        console.error('Error saving world clocks:', error);
    }
}

/**
 * Load world clocks from localStorage
 */
function loadWorldClocks() {
    try {
        const saved = localStorage.getItem('ringClockWorldClocks');
        if (saved) {
            worldClocks = JSON.parse(saved);
            renderWorldClocks();
        }
    } catch (error) {
        console.error('Error loading world clocks:', error);
        worldClocks = [];
    }
}
