// Test passages with different difficulties
const textPassages = {
    beginner: [
        "The quick brown fox jumps over the lazy dog.",
        "A journey of a thousand miles begins with a single step.",
        "All that glitters is not gold; all that wanders is not lost."
    ],
    intermediate: [
        "Programming is the art of telling another human being what one wants the computer to do.",
        "The best error message is the one that never shows up because the user interface is intuitive.",
        "The greatest enemy of knowledge is not ignorance, it is the illusion of knowledge."
    ],
    advanced: [
        "The function of good software is to make the complex appear to be simple. Good software doesn't make simple things complex.",
        "Computer programming is an art, because it applies accumulated knowledge to the world, because it requires skill and ingenuity, and especially because it produces objects of beauty.",
        "You say this survey is monotonous rather than glorious. You should surely hurry to Vancouver for some delicious yuletide fare. It seems only yesterday that I was there."
    ]
};

// DOM elements
const setupContainer = document.getElementById('setup-container');
const testContainer = document.getElementById('test-container');
const resultsContainer = document.getElementById('results-container');
const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');
const progressBar = document.getElementById('progress-bar');
const startButton = document.getElementById('start-test');
const retryButton = document.getElementById('retry-btn');
const wpmValue = document.getElementById('wpm-value');
const accuracyValue = document.getElementById('accuracy-value');
const timeValue = document.getElementById('time-value');

// New DOM elements
const difficultySelect = document.getElementById('difficulty');
const themeSelect = document.getElementById('theme');
const timer = document.getElementById('timer');
const currentWpm = document.getElementById('current-wpm');
const restartBtn = document.getElementById('restart-btn');
const newTestBtn = document.getElementById('new-test-btn');
const themeToggle = document.getElementById('theme-toggle');
const errorValue = document.getElementById('error-value');
const statsBtn = document.getElementById('stats-btn');
const chartContainer = document.getElementById('progress-chart');

// Test variables
let currentText = '';
let startTime;
let endTime;
let errors = 0;
let totalCharactersTyped = 0;
let testActive = false;
let errorSound; // Sound for typing errors
let completeSound; // Sound for test completion

// Timer variables
let timerInterval;
let timeElapsed = 0;

// Initialize the application
function init() {
    setupEventListeners();
    checkSavedPreferences();
    initSounds();
    
    // Initialize the virtual keyboard if available
    if (typeof VirtualKeyboard !== 'undefined') {
        VirtualKeyboard.init();
    }
    
    console.log("TypeRacer initialized");
}

// Initialize sound effects
function initSounds() {
    if (typeof Howl !== 'undefined') {
        errorSound = new Howl({
            src: ['https://assets.mixkit.co/sfx/preview/mixkit-video-game-retro-click-237.mp3'],
            volume: 0.3
        });
        
        completeSound = new Howl({
            src: ['https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3'],
            volume: 0.5
        });
        
        // Set sound state based on checkbox
        updateSoundState();
    }
}

// Update sound state based on settings
function updateSoundState() {
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    const soundToggle = document.getElementById('sound-effects');
    
    if (soundToggle) {
        soundToggle.checked = soundEnabled;
    }
    
    if (errorSound && completeSound) {
        errorSound.mute(!soundEnabled);
        completeSound.mute(!soundEnabled);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Start button click
    startButton.addEventListener('click', () => {
        console.log("Start button clicked");
        startTest();
    });
    
    // Enter key to start test
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && setupContainer.classList.contains('active')) {
            console.log("Enter key pressed in setup");
            startTest();
        }
    });
    
    // Input events for typing
    typingInput.addEventListener('input', checkInput);
    
    // Retry button - Back to setup
    retryButton.addEventListener('click', resetTest);
    
    // Restart button
    if (restartBtn) {
        restartBtn.addEventListener('click', resetTest);
    }
    
    // New test button - Try again with same settings
    if (newTestBtn) {
        newTestBtn.addEventListener('click', () => {
            // Since we've changed the button text to "Try Again", 
            // we'll start a new test with the same settings without going back to setup
            testContainer.classList.add('hidden');
            resultsContainer.classList.add('hidden');
            startTest();
        });
    }
    
    // Stats button
    if (statsBtn) {
        statsBtn.addEventListener('click', () => {
            const statsSection = document.getElementById('stats-section');
            if (statsSection) {
                statsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Option checkboxes
    const keyboardToggle = document.getElementById('show-keyboard');
    if (keyboardToggle) {
        keyboardToggle.addEventListener('change', function() {
            const keyboardContainer = document.getElementById('keyboard-container');
            if (keyboardContainer) {
                keyboardContainer.style.display = this.checked ? 'block' : 'none';
            }
            localStorage.setItem('showKeyboard', this.checked);
        });
    }
    
    const soundToggle = document.getElementById('sound-effects');
    if (soundToggle) {
        soundToggle.addEventListener('change', function() {
            const soundEnabled = this.checked;
            localStorage.setItem('soundEnabled', soundEnabled);
        });
    }
    
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Start the typing test
function startTest() {
    console.log("Starting test");
    
    // Get selected difficulty and theme
    const difficulty = difficultySelect ? difficultySelect.value : 'beginner';
    const theme = themeSelect ? themeSelect.value : 'general';
    
    // Store preferences in localStorage
    localStorage.setItem('difficulty', difficulty);
    if (theme) localStorage.setItem('theme', theme);
    
    console.log(`Difficulty: ${difficulty}, Theme: ${theme}`);
    
    // Get appropriate text based on selections
    currentText = getRandomText(difficulty, theme);
    
    // Display text with character spans for styling
    displayText(currentText);
    
    // Show test container, hide setup
    setupContainer.classList.remove('active');
    setupContainer.classList.add('hidden');
    testContainer.classList.remove('hidden');
    testContainer.classList.add('active');
    
    // Focus input field
    typingInput.value = '';
    typingInput.focus();
    
    // Reset variables
    errors = 0;
    timeElapsed = 0;
    totalCharactersTyped = 0;
    startTime = new Date().getTime();
    testActive = true;
    
    // Start timer
    startTimer();
    
    if (timer) timer.textContent = "0s";
    if (currentWpm) currentWpm.textContent = "0 WPM";
    
    console.log("Test started successfully");
}

// Get random text based on difficulty and theme
function getRandomText(difficulty, theme) {
    console.log(`Getting text for ${difficulty} difficulty and ${theme} theme`);
    
    // Check if we have textContent from the external file
    if (typeof textContent !== 'undefined') {
        // Try to get text from the theme and difficulty
        try {
            const texts = textContent[theme][difficulty];
            return texts[Math.floor(Math.random() * texts.length)];
        } catch (error) {
            console.warn(`Couldn't find text for ${theme}/${difficulty}, falling back to default`);
        }
    }
    
    // Fallback to the default textPassages if textContent isn't available
    // or if the requested theme/difficulty combination doesn't exist
    if (textPassages[difficulty]) {
        return textPassages[difficulty][Math.floor(Math.random() * textPassages[difficulty].length)];
    }
    
    // Ultimate fallback
    return "The quick brown fox jumps over the lazy dog.";
}

// Display text in the text display area
function displayText(text) {
    textDisplay.innerHTML = '';
    
    // Split text into characters and create spans
    text.split('').forEach((char, index) => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        charSpan.classList.add('char');
        
        // Highlight the first character as current
        if (index === 0) {
            charSpan.classList.add('current');
        }
        
        textDisplay.appendChild(charSpan);
    });
}

// Check user input against the text
function checkInput() {
    if (!testActive) return;
    
    const inputText = typingInput.value;
    const characters = textDisplay.querySelectorAll('.char');
    
    // Reset character states
    characters.forEach(char => {
        char.classList.remove('current');
        char.classList.remove('correct');
        char.classList.remove('incorrect');
    });
    
    // Check each character
    let correctCharacters = 0;
    errors = 0; // Reset errors count for accurate calculation
    
    for (let i = 0; i < inputText.length; i++) {
        // If we've typed past the text length, stop checking
        if (i >= characters.length) break;
        
        // Check if character is correct
        if (inputText[i] === characters[i].innerText) {
            characters[i].classList.add('correct');
            correctCharacters++;
            
            // Update virtual keyboard
            if (typeof VirtualKeyboard !== 'undefined' && i === inputText.length - 1) {
                VirtualKeyboard.highlightCorrect(inputText[i]);
            }
        } else {
            characters[i].classList.add('incorrect');
            errors++;
            
            // Play sound and update virtual keyboard for new error
            if (i === inputText.length - 1) {
                if (errorSound) errorSound.play();
                
                if (typeof VirtualKeyboard !== 'undefined') {
                    VirtualKeyboard.highlightIncorrect(inputText[i]);
                }
            }
        }
    }
    
    // Set the current character
    if (inputText.length < characters.length) {
        characters[inputText.length].classList.add('current');
    }
    
    // Update total characters typed for WPM calculation
    totalCharactersTyped = inputText.length;
    
    // Update progress bar
    const progress = (correctCharacters / characters.length) * 100;
    progressBar.style.width = `${progress}%`;
    
    // Check if test is complete (all characters typed correctly)
    if (correctCharacters === characters.length && inputText.length === characters.length) {
        finishTest();
    }
}

// Finish the test and show results
function finishTest() {
    testActive = false;
    clearInterval(timerInterval);
    endTime = new Date().getTime();
    const timeElapsed = (endTime - startTime) / 1000; // in seconds
    
    // Calculate WPM: (characters / 5) / minutes
    const minutes = timeElapsed / 60;
    const words = currentText.length / 5;
    const wpm = Math.round(words / minutes);
    
    // Calculate accuracy
    const accuracy = Math.round(((totalCharactersTyped - errors) / totalCharactersTyped) * 100);
    
    // Display results
    wpmValue.textContent = wpm;
    accuracyValue.textContent = `${accuracy}%`;
    timeValue.textContent = `${timeElapsed.toFixed(1)}s`;
    errorValue.textContent = errors;
    
    // Show results container, hide test
    testContainer.classList.add('hidden');
    testContainer.classList.remove('active');
    resultsContainer.classList.remove('hidden');
    
    // Play completion sound
    if (completeSound) {
        completeSound.play();
    }
    
    // Add some confetti effect on good results
    if (wpm > 40 && accuracy > 90) {
        celebrateSuccess();
    }
    
    // Save results and update statistics
    const difficulty = difficultySelect ? difficultySelect.value : 'beginner';
    const theme = themeSelect ? themeSelect.value : 'general';
    saveResult(wpm, accuracy, timeElapsed, errors, difficulty, theme);
    
    console.log("Test finished with WPM:", wpm);
}

// Reset the test
function resetTest() {
    console.log("Resetting test");
    
    // Hide both results and test containers, show setup
    resultsContainer.classList.add('hidden');
    testContainer.classList.add('hidden');
    setupContainer.classList.remove('hidden');
    setupContainer.classList.add('active');
    
    // Reset progress bar
    progressBar.style.width = '0%';
    
    // Clear any timer
    clearInterval(timerInterval);
    
    // Reset all state
    timeElapsed = 0;
    errors = 0;
    totalCharactersTyped = 0;
    testActive = false;
    
    console.log("Test reset complete, showing selectors");
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl+R for restart
    if (e.ctrlKey && e.key === 'r' && testContainer.classList.contains('active')) {
        e.preventDefault(); // Prevent browser refresh
        resetTest();
    }
    
    // Escape to quit test
    if (e.key === 'Escape' && testContainer.classList.contains('active')) {
        resetTest();
    }
}

// Start timer
function startTimer() {
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        if (testActive) {
            timeElapsed++;
            if (timer) timer.textContent = `${timeElapsed}s`;
            
            // Update current WPM every second
            updateCurrentWpm();
        }
    }, 1000);
}

// Update current WPM during the test
function updateCurrentWpm() {
    if (totalCharactersTyped === 0) return;
    
    const minutes = timeElapsed / 60;
    const words = totalCharactersTyped / 5;
    const wpm = Math.round(words / minutes);
    
    if (currentWpm) {
        currentWpm.textContent = `${wpm} WPM`;
    }
}

// Toggle dark/light theme
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Save test result and update statistics display
function saveResult(wpm, accuracy, time, errors, difficulty, theme) {
    // Use the StatsManager if it exists
    if (typeof StatsManager !== 'undefined') {
        StatsManager.saveResult(wpm, accuracy, time, errors, difficulty, theme);
        
        // Update stats display
        updateStatsDisplay();
    } else {
        // Fallback to simple localStorage saving
        const existingResults = JSON.parse(localStorage.getItem('typeracerResults')) || [];
        
        const newResult = {
            date: new Date().toISOString(),
            wpm,
            accuracy,
            time,
            errors,
            difficulty,
            theme
        };
        
        existingResults.push(newResult);
        localStorage.setItem('typeracerResults', JSON.stringify(existingResults));
    }
}

// Update statistics display
function updateStatsDisplay() {
    if (typeof StatsManager === 'undefined') return;
    
    // Get elements
    const bestWpm = document.getElementById('best-wpm');
    const bestAccuracy = document.getElementById('best-accuracy');
    const avgWpm = document.getElementById('avg-wpm');
    const avgAccuracy = document.getElementById('avg-accuracy');
    const chartContainer = document.getElementById('progress-chart');
    
    if (!bestWpm || !bestAccuracy || !avgWpm || !avgAccuracy || !chartContainer) return;
    
    // Get stats from StatsManager
    const bests = StatsManager.getPersonalBests();
    const averageWpm = StatsManager.getAverageWPM(5);
    const averageAccuracy = StatsManager.getAverageAccuracy(5);
    
    // Update the display
    bestWpm.textContent = bests.wpm;
    bestAccuracy.textContent = `${bests.accuracy}%`;
    avgWpm.textContent = averageWpm;
    avgAccuracy.textContent = `${averageAccuracy}%`;
    
    // Create a chart if Chart.js is available
    if (typeof Chart !== 'undefined') {
        createProgressChart(chartContainer);
    }
}

// Create a progress chart showing WPM over time
function createProgressChart(canvas) {
    // Clear any existing chart
    if (window.typeRacerChart) {
        window.typeRacerChart.destroy();
    }
    
    // Get the last 10 results
    const results = StatsManager.getResults().slice(-10);
    
    if (results.length < 2) {
        canvas.parentElement.style.display = 'none';
        return;
    }
    
    canvas.parentElement.style.display = 'block';
    
    // Format dates for labels
    const labels = results.map(r => {
        const date = new Date(r.date);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    });
    
    // WPM data
    const wpmData = results.map(r => r.wpm);
    
    // Create the chart
    window.typeRacerChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'WPM',
                data: wpmData,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Your WPM Progress'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            const result = results[index];
                            return [
                                `WPM: ${result.wpm}`,
                                `Accuracy: ${result.accuracy}%`,
                                `Errors: ${result.errors}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Words Per Minute'
                    }
                }
            }
        }
    });
}

// Check for saved preferences on page load
function checkSavedPreferences() {
    console.log("Checking saved preferences");
    
    // Check for dark mode preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Check for saved difficulty
    const savedDifficulty = localStorage.getItem('difficulty');
    if (savedDifficulty && difficultySelect && difficultySelect.querySelector(`option[value="${savedDifficulty}"]`)) {
        difficultySelect.value = savedDifficulty;
    }
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && themeSelect && themeSelect.querySelector(`option[value="${savedTheme}"]`)) {
        themeSelect.value = savedTheme;
    }
    
    // Check keyboard preference
    const showKeyboard = localStorage.getItem('showKeyboard') !== 'false';
    const keyboardToggle = document.getElementById('show-keyboard');
    const keyboardContainer = document.getElementById('keyboard-container');
    
    if (keyboardToggle) {
        keyboardToggle.checked = showKeyboard;
    }
    
    if (keyboardContainer) {
        keyboardContainer.style.display = showKeyboard ? 'block' : 'none';
    }
    
    // Check sound effects preference
    const soundToggle = document.getElementById('sound-effects');
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    
    if (soundToggle) {
        soundToggle.checked = soundEnabled;
    }
    
    console.log("Preferences loaded");
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing TypeRacer");
    init();
});
