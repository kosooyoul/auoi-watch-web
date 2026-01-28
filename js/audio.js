/**
 * Ambient Sound System
 * Feature: Lofi music, nature sounds, white noise
 * Research: Lofi Bear proves music + timer = high retention
 * Revenue: +$2.99 (Ambient Sound Pack)
 */

// Audio context for Web Audio API (noise generation)
let audioContext = null;
let noiseNode = null;
let gainNode = null;

// HTML Audio elements for file-based sounds
const audioPlayers = {};

// Current playing sound
let currentSound = null;
let isPlaying = false;

// Volume (0-100)
let volume = 50;

// Sound definitions
const SOUNDS = {
    // Lofi Beats (require audio files - placeholders for now)
    'lofi-chill': {
        name: 'Chill Lofi',
        type: 'file',
        url: 'assets/audio/lofi-chill.mp3',  // User needs to add file
        icon: '🎸'
    },
    'lofi-jazzy': {
        name: 'Jazzy Lofi',
        type: 'file',
        url: 'assets/audio/lofi-jazzy.mp3',  // User needs to add file
        icon: '🎹'
    },
    'lofi-ambient': {
        name: 'Ambient Lofi',
        type: 'file',
        url: 'assets/audio/lofi-ambient.mp3',  // User needs to add file
        icon: '🌌'
    },

    // Nature Sounds (require audio files - placeholders for now)
    'rain': {
        name: 'Rain',
        type: 'file',
        url: 'assets/audio/rain.mp3',  // User needs to add file
        icon: '🌧️'
    },
    'ocean': {
        name: 'Ocean Waves',
        type: 'file',
        url: 'assets/audio/ocean.mp3',  // User needs to add file
        icon: '🌊'
    },
    'forest': {
        name: 'Forest',
        type: 'file',
        url: 'assets/audio/forest.mp3',  // User needs to add file
        icon: '🌲'
    },
    'fire': {
        name: 'Fireplace',
        type: 'file',
        url: 'assets/audio/fire.mp3',  // User needs to add file
        icon: '🔥'
    },

    // White Noise (generated with Web Audio API)
    'white-noise': {
        name: 'White Noise',
        type: 'generated',
        generator: 'white',
        icon: '📻'
    },
    'brown-noise': {
        name: 'Brown Noise',
        type: 'generated',
        generator: 'brown',
        icon: '🎚️'
    },
    'pink-noise': {
        name: 'Pink Noise',
        type: 'generated',
        generator: 'pink',
        icon: '🌸'
    }
};

// DOM elements
let soundBtn;
let soundModal;
let soundCloseBtn;
let volumeSlider;
let volumeValue;
let nowPlaying;
let nowPlayingName;
let stopBtn;

/**
 * Initialize audio system
 */
function initAudioSystem() {
    // Get DOM elements
    soundBtn = document.getElementById('soundBtn');
    soundModal = document.getElementById('soundModal');
    soundCloseBtn = document.getElementById('soundCloseBtn');
    volumeSlider = document.getElementById('volumeSlider');
    volumeValue = document.getElementById('volumeValue');
    nowPlaying = document.getElementById('nowPlaying');
    nowPlayingName = document.getElementById('nowPlayingName');
    stopBtn = document.getElementById('stopBtn');

    if (!soundBtn || !soundModal) {
        console.error('Audio UI elements not found');
        return;
    }

    // Initialize Web Audio API
    initAudioContext();

    // Load settings
    loadAudioSettings();

    // Setup event listeners
    setupAudioEventListeners();

    // Initialize audio players for file-based sounds
    initAudioPlayers();

    console.log('✅ Audio system initialized');
}

/**
 * Initialize Web Audio Context
 */
function initAudioContext() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);
        updateVolume(volume);
    } catch (error) {
        console.error('Web Audio API not supported:', error);
    }
}

/**
 * Setup event listeners
 */
function setupAudioEventListeners() {
    // Open modal
    soundBtn.addEventListener('click', () => {
        soundModal.classList.add('active');
        updatePlayButtonStates();
    });

    // Close modal
    const closeModal = () => {
        soundModal.classList.remove('active');
        soundBtn.focus();
    };

    soundCloseBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    soundModal.addEventListener('click', (e) => {
        if (e.target === soundModal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && soundModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Play button clicks
    const playButtons = document.querySelectorAll('.sound-play-btn');
    playButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const soundId = btn.dataset.sound;
            if (currentSound === soundId && isPlaying) {
                stopSound();
            } else {
                playSound(soundId);
            }
        });
    });

    // Stop button
    if (stopBtn) {
        stopBtn.addEventListener('click', stopSound);
    }

    // Volume slider
    if (volumeSlider) {
        volumeSlider.addEventListener('input', () => {
            const vol = parseInt(volumeSlider.value);
            updateVolume(vol);
            volumeValue.textContent = `${vol}%`;
        });

        volumeSlider.addEventListener('change', () => {
            saveAudioSettings();
        });
    }
}

/**
 * Initialize HTML Audio players for file-based sounds
 */
function initAudioPlayers() {
    Object.keys(SOUNDS).forEach(soundId => {
        const sound = SOUNDS[soundId];
        if (sound.type === 'file') {
            const audio = new Audio();
            audio.loop = true;
            audio.preload = 'none';
            audio.src = sound.url;

            // Error handling for missing files
            audio.addEventListener('error', () => {
                console.warn(`Audio file not found: ${sound.url}`);
                console.warn(`To enable this sound, add the audio file to the assets/audio/ directory`);
            });

            audioPlayers[soundId] = audio;
        }
    });
}

/**
 * Play a sound
 */
function playSound(soundId) {
    const sound = SOUNDS[soundId];
    if (!sound) {
        console.error('Sound not found:', soundId);
        return;
    }

    // Stop current sound first
    stopSound();

    // Play new sound
    currentSound = soundId;
    isPlaying = true;

    if (sound.type === 'file') {
        playFileSound(soundId);
    } else if (sound.type === 'generated') {
        playGeneratedSound(sound.generator);
    }

    // Update UI
    updateNowPlaying(sound.name, sound.icon);
    updatePlayButtonStates();
    updateSoundButtonState();

    console.log('▶️ Playing:', sound.name);
}

/**
 * Play file-based sound
 */
function playFileSound(soundId) {
    const audio = audioPlayers[soundId];
    if (!audio) {
        console.error('Audio player not found:', soundId);
        return;
    }

    try {
        audio.volume = volume / 100;
        audio.play().catch(error => {
            console.error('Audio playback failed:', error);
            // Show user-friendly message
            showAudioError('Audio file not found. Please add audio files to assets/audio/ directory.');
            stopSound();
        });
    } catch (error) {
        console.error('Audio error:', error);
        stopSound();
    }
}

/**
 * Play generated sound (noise)
 */
function playGeneratedSound(generator) {
    if (!audioContext) {
        console.error('Audio context not available');
        return;
    }

    // Resume audio context if suspended (required by some browsers)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    if (generator === 'white') {
        noiseNode = createWhiteNoise();
    } else if (generator === 'brown') {
        noiseNode = createBrownNoise();
    } else if (generator === 'pink') {
        noiseNode = createPinkNoise();
    }

    if (noiseNode) {
        noiseNode.connect(gainNode);
    }
}

/**
 * Create white noise
 */
function createWhiteNoise() {
    const bufferSize = 4096;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.start(0);

    return whiteNoise;
}

/**
 * Create brown noise (Brownian noise)
 */
function createBrownNoise() {
    const bufferSize = 4096;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Amplify
    }

    const brownNoise = audioContext.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;
    brownNoise.start(0);

    return brownNoise;
}

/**
 * Create pink noise
 */
function createPinkNoise() {
    const bufferSize = 4096;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // Normalize
        b6 = white * 0.115926;
    }

    const pinkNoise = audioContext.createBufferSource();
    pinkNoise.buffer = noiseBuffer;
    pinkNoise.loop = true;
    pinkNoise.start(0);

    return pinkNoise;
}

/**
 * Stop current sound
 */
function stopSound() {
    if (!isPlaying) {
        return;
    }

    // Stop file-based sounds
    Object.values(audioPlayers).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });

    // Stop generated sounds
    if (noiseNode) {
        noiseNode.stop();
        noiseNode.disconnect();
        noiseNode = null;
    }

    currentSound = null;
    isPlaying = false;

    // Update UI
    updateNowPlaying('', '');
    updatePlayButtonStates();
    updateSoundButtonState();

    console.log('⏹️ Sound stopped');
}

/**
 * Update volume
 */
function updateVolume(vol) {
    volume = vol;

    // Update file-based sounds
    Object.values(audioPlayers).forEach(audio => {
        audio.volume = vol / 100;
    });

    // Update generated sounds
    if (gainNode) {
        gainNode.gain.value = vol / 100;
    }
}

/**
 * Update now playing display
 */
function updateNowPlaying(name, icon) {
    if (!nowPlaying || !nowPlayingName) {
        return;
    }

    if (name) {
        nowPlayingName.textContent = `${icon} ${name}`;
        nowPlaying.style.display = 'flex';
    } else {
        nowPlaying.style.display = 'none';
    }
}

/**
 * Update play button states
 */
function updatePlayButtonStates() {
    const playButtons = document.querySelectorAll('.sound-play-btn');
    playButtons.forEach(btn => {
        const soundId = btn.dataset.sound;
        if (soundId === currentSound && isPlaying) {
            btn.textContent = '⏸';
            btn.classList.add('playing');
        } else {
            btn.textContent = '▶';
            btn.classList.remove('playing');
        }
    });
}

/**
 * Update sound button state (main UI button)
 */
function updateSoundButtonState() {
    if (!soundBtn) {
        return;
    }

    if (isPlaying) {
        soundBtn.classList.add('playing');
    } else {
        soundBtn.classList.remove('playing');
    }
}

/**
 * Show audio error message
 */
function showAudioError(message) {
    // Simple toast notification (can enhance later)
    const toast = document.createElement('div');
    toast.className = 'audio-error-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255, 107, 129, 0.9);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Load audio settings from localStorage
 */
function loadAudioSettings() {
    try {
        const settings = loadFromStorage('AudioSettings', {
            volume: 50
        });
        volume = settings.volume;

        if (volumeSlider) {
            volumeSlider.value = volume;
        }
        if (volumeValue) {
            volumeValue.textContent = `${volume}%`;
        }

        updateVolume(volume);
    } catch (error) {
        console.error('Error loading audio settings:', error);
    }
}

/**
 * Save audio settings to localStorage
 */
function saveAudioSettings() {
    try {
        saveToStorage('AudioSettings', {
            volume
        });
    } catch (error) {
        console.error('Error saving audio settings:', error);
    }
}

/**
 * Get current playing sound info (for external use)
 */
function getCurrentSound() {
    return currentSound ? SOUNDS[currentSound] : null;
}

/**
 * Check if sound is playing
 */
function isAudioPlaying() {
    return isPlaying;
}
