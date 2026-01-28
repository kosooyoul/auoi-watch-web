/**
 * Custom Wake-up Message System
 * Feature: Record/upload custom alarm sounds, share with others
 * Research: YouUp, WakeMe prove social alarms are loved
 * Revenue: +$1.99 (unlimited messages)
 */

// Recording state
let mediaRecorder = null;
let audioChunks = [];
let recordingStartTime = null;
let recordingInterval = null;
let isRecording = false;

// Message storage
let savedMessages = [];
let selectedMessage = 'default';

// Free tier limit
const FREE_MESSAGE_LIMIT = 1;

// DOM elements
let messageModal;
let messageCloseBtn;
let recordBtn;
let stopRecordBtn;
let recordingIndicator;
let recordingTime;
let previewSection;
let audioPreview;
let saveMessageBtn;
let discardBtn;
let messagesList;
let messagePremiumNotice;
let messageUpgradeBtn;
let messageSelect;

/**
 * Initialize custom message system
 */
async function initCustomMessageSystem() {
    // Get DOM elements
    messageModal = document.getElementById('messageModal');
    messageCloseBtn = document.getElementById('messageCloseBtn');
    recordBtn = document.getElementById('recordBtn');
    stopRecordBtn = document.getElementById('stopRecordBtn');
    recordingIndicator = document.getElementById('recordingIndicator');
    recordingTime = document.getElementById('recordingTime');
    previewSection = document.getElementById('previewSection');
    audioPreview = document.getElementById('audioPreview');
    saveMessageBtn = document.getElementById('saveMessageBtn');
    discardBtn = document.getElementById('discardBtn');
    messagesList = document.getElementById('messagesList');
    messagePremiumNotice = document.getElementById('messagePremiumNotice');
    messageUpgradeBtn = document.getElementById('messageUpgradeBtn');
    messageSelect = document.getElementById('messageSelect');

    if (!messageModal) {
        console.error('Custom message UI not found');
        return;
    }

    // Load saved messages
    loadMessages();

    // Setup event listeners
    setupMessageEventListeners();

    // Check microphone permission
    await checkMicrophonePermission();

    console.log('✅ Custom message system initialized');
}

/**
 * Setup event listeners
 */
function setupMessageEventListeners() {
    // Close modal
    const closeModal = () => {
        messageModal.classList.remove('active');
    };

    if (messageCloseBtn) {
        messageCloseBtn.addEventListener('click', closeModal);
    }

    // Close on backdrop
    messageModal.addEventListener('click', (e) => {
        if (e.target === messageModal) {
            closeModal();
        }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && messageModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Record button
    if (recordBtn) {
        recordBtn.addEventListener('click', startRecording);
    }

    // Stop recording
    if (stopRecordBtn) {
        stopRecordBtn.addEventListener('click', stopRecording);
    }

    // Save message
    if (saveMessageBtn) {
        saveMessageBtn.addEventListener('click', saveMessage);
    }

    // Discard
    if (discardBtn) {
        discardBtn.addEventListener('click', discardRecording);
    }

    // Premium upgrade
    if (messageUpgradeBtn) {
        messageUpgradeBtn.addEventListener('click', () => {
            // Show payment modal or redirect to purchase page
            alert('Premium feature coming soon! Upgrade to unlock unlimited messages.');
        });
    }

    // Message selector (in alarm panel)
    if (messageSelect) {
        messageSelect.addEventListener('change', (e) => {
            const value = e.target.value;
            if (value === 'record-new') {
                openMessageModal();
                // Reset to previous selection
                setTimeout(() => {
                    messageSelect.value = selectedMessage;
                }, 100);
            } else {
                selectedMessage = value;
                saveMessageSelection();
            }
        });
    }
}

/**
 * Check microphone permission
 */
async function checkMicrophonePermission() {
    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.warn('Media devices not supported');
            return false;
        }

        // Just check, don't actually request yet
        const result = await navigator.permissions.query({ name: 'microphone' });
        console.log('Microphone permission:', result.state);
        return result.state === 'granted';
    } catch (error) {
        console.warn('Permission check failed:', error);
        return false;
    }
}

/**
 * Start recording
 */
async function startRecording() {
    try {
        // Request microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });

        // Create MediaRecorder
        const options = { mimeType: 'audio/webm' };
        mediaRecorder = new MediaRecorder(stream, options);

        audioChunks = [];

        mediaRecorder.addEventListener('dataavailable', (event) => {
            audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPreview.src = audioUrl;

            // Show preview section
            previewSection.style.display = 'block';

            // Stop all tracks
            stream.getTracks().forEach(track => track.stop());
        });

        // Start recording
        mediaRecorder.start();
        isRecording = true;
        recordingStartTime = Date.now();

        // Update UI
        recordBtn.disabled = true;
        stopRecordBtn.disabled = false;
        recordingIndicator.style.display = 'flex';
        previewSection.style.display = 'none';

        // Start timer
        recordingInterval = setInterval(updateRecordingTime, 1000);

        console.log('🎤 Recording started');
    } catch (error) {
        console.error('Failed to start recording:', error);
        alert('Failed to access microphone. Please allow microphone permission.');
    }
}

/**
 * Stop recording
 */
function stopRecording() {
    if (!mediaRecorder || !isRecording) {
        return;
    }

    mediaRecorder.stop();
    isRecording = false;

    // Stop timer
    if (recordingInterval) {
        clearInterval(recordingInterval);
        recordingInterval = null;
    }

    // Update UI
    recordBtn.disabled = false;
    stopRecordBtn.disabled = true;
    recordingIndicator.style.display = 'none';

    console.log('⏹️ Recording stopped');
}

/**
 * Update recording time display
 */
function updateRecordingTime() {
    if (!recordingStartTime) {
        return;
    }

    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    recordingTime.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Save recorded message
 */
async function saveMessage() {
    if (!audioPreview.src) {
        return;
    }

    // Check free tier limit
    if (!isPremiumUser() && savedMessages.length >= FREE_MESSAGE_LIMIT) {
        showPremiumNotice();
        return;
    }

    // Convert blob URL to base64 for storage
    const response = await fetch(audioPreview.src);
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);

    // Create message object
    const message = {
        id: Date.now().toString(),
        name: `Message ${savedMessages.length + 1}`,
        data: base64,
        createdAt: new Date().toISOString(),
        duration: getDuration(audioPreview)
    };

    // Save to storage
    savedMessages.push(message);
    saveMessages();

    // Update UI
    renderMessagesList();
    discardRecording();

    // Update selector
    populateMessageSelector();

    console.log('💾 Message saved:', message.id);
}

/**
 * Discard recording
 */
function discardRecording() {
    if (audioPreview.src) {
        URL.revokeObjectURL(audioPreview.src);
        audioPreview.src = '';
    }

    previewSection.style.display = 'none';
    audioChunks = [];
}

/**
 * Convert Blob to Base64
 */
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Get audio duration
 */
function getDuration(audioElement) {
    return audioElement.duration || 0;
}

/**
 * Render messages list
 */
function renderMessagesList() {
    if (!messagesList) {
        return;
    }

    if (savedMessages.length === 0) {
        messagesList.innerHTML = '<p class="empty-state">No messages yet. Record your first one!</p>';
        return;
    }

    const html = savedMessages.map(msg => `
        <div class="message-item" data-id="${msg.id}">
            <div class="message-info">
                <div class="message-name">${msg.name}</div>
                <div class="message-meta">${formatDuration(msg.duration)}</div>
            </div>
            <div class="message-actions">
                <button class="play-message-btn" data-id="${msg.id}">▶</button>
                <button class="delete-message-btn" data-id="${msg.id}">🗑️</button>
            </div>
        </div>
    `).join('');

    messagesList.innerHTML = html;

    // Add event listeners
    messagesList.querySelectorAll('.play-message-btn').forEach(btn => {
        btn.addEventListener('click', () => playMessage(btn.dataset.id));
    });

    messagesList.querySelectorAll('.delete-message-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteMessage(btn.dataset.id));
    });
}

/**
 * Format duration in seconds
 */
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Play message
 */
function playMessage(id) {
    const message = savedMessages.find(m => m.id === id);
    if (!message) {
        return;
    }

    // Create audio element and play
    const audio = new Audio(message.data);
    audio.play();
}

/**
 * Delete message
 */
function deleteMessage(id) {
    if (!confirm('Delete this message?')) {
        return;
    }

    savedMessages = savedMessages.filter(m => m.id !== id);
    saveMessages();
    renderMessagesList();
    populateMessageSelector();

    // Reset selection if deleted
    if (selectedMessage === id) {
        selectedMessage = 'default';
        saveMessageSelection();
    }

    console.log('🗑️ Message deleted:', id);
}

/**
 * Show premium notice
 */
function showPremiumNotice() {
    if (messagePremiumNotice) {
        messagePremiumNotice.style.display = 'block';
    }
}

/**
 * Check if user is premium
 */
function isPremiumUser() {
    // Check if user owns any premium pack (simple check)
    try {
        const purchases = JSON.parse(localStorage.getItem('PremiumPurchases') || '{}');
        return Object.keys(purchases).length > 0;
    } catch {
        return false;
    }
}

/**
 * Populate message selector in alarm panel
 */
function populateMessageSelector() {
    if (!messageSelect) {
        return;
    }

    // Clear existing options except default and "record new"
    const options = Array.from(messageSelect.options);
    options.forEach(opt => {
        if (opt.value !== 'default' && opt.value !== 'record-new') {
            opt.remove();
        }
    });

    // Add saved messages before "record new"
    const recordNewOption = messageSelect.querySelector('[value="record-new"]');
    savedMessages.forEach(msg => {
        const option = document.createElement('option');
        option.value = msg.id;
        option.textContent = msg.name;
        messageSelect.insertBefore(option, recordNewOption);
    });

    // Set selected
    if (selectedMessage !== 'default' && selectedMessage !== 'record-new') {
        const exists = savedMessages.find(m => m.id === selectedMessage);
        if (exists) {
            messageSelect.value = selectedMessage;
        } else {
            messageSelect.value = 'default';
        }
    }
}

/**
 * Open message modal
 */
function openMessageModal() {
    if (messageModal) {
        messageModal.classList.add('active');
        renderMessagesList();
    }
}

/**
 * Load messages from localStorage
 */
function loadMessages() {
    try {
        const data = loadFromStorage('CustomMessages', {
            messages: [],
            selected: 'default'
        });
        savedMessages = data.messages;
        selectedMessage = data.selected;

        // Populate selector
        populateMessageSelector();
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

/**
 * Save messages to localStorage
 */
function saveMessages() {
    try {
        saveToStorage('CustomMessages', {
            messages: savedMessages,
            selected: selectedMessage
        });
    } catch (error) {
        console.error('Error saving messages:', error);
    }
}

/**
 * Save message selection
 */
function saveMessageSelection() {
    try {
        const data = loadFromStorage('CustomMessages', {
            messages: savedMessages,
            selected: 'default'
        });
        data.selected = selectedMessage;
        saveToStorage('CustomMessages', data);
    } catch (error) {
        console.error('Error saving selection:', error);
    }
}

/**
 * Get selected message for alarm (external use)
 */
function getSelectedMessage() {
    if (selectedMessage === 'default') {
        return null;
    }

    return savedMessages.find(m => m.id === selectedMessage);
}
