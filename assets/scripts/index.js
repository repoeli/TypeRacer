// We use the text content from text-content.js instead of defining passages here

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

// Global variable to track pause state
let testPaused = false;
let pausedAtTime = 0;

// Initialize the application
function init() {
    setupEventListeners();
    checkSavedPreferences();
    initSounds();

    // Initialize the virtual keyboard if available
    if (typeof VirtualKeyboard !== 'undefined') {
        VirtualKeyboard.init();
    }
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
    if (startButton) {
        startButton.addEventListener('click', () => {
            startTest();
        });
    }

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
        keyboardToggle.addEventListener('change', function () {
            const keyboardContainer = document.getElementById('keyboard-container');
            if (keyboardContainer) {
                keyboardContainer.style.display = this.checked ? 'block' : 'none';
            }
            localStorage.setItem('showKeyboard', this.checked);
        });
    }

    const soundToggle = document.getElementById('sound-effects');
    if (soundToggle) {
        soundToggle.addEventListener('change', function () {
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
    // Get selected difficulty and theme
    const difficulty = difficultySelect ? difficultySelect.value : 'beginner';
    const theme = themeSelect ? themeSelect.value : 'general';

    // Store preferences in localStorage
    localStorage.setItem('difficulty', difficulty);
    if (theme) localStorage.setItem('theme', theme);

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
    testActive = true;

    // Timer will now start on first keystroke
    if (timer) {
        timer.textContent = "0s";
        timer.setAttribute('data-tooltip', 'Timer starts when you begin typing');
        timer.classList.add('waiting-to-start');
    }
    if (currentWpm) currentWpm.textContent = "0 WPM";

    // Flag to indicate if timer has started
    window.timerStarted = false;
}

// Get random text based on difficulty and theme
function getRandomText(difficulty, theme) {

    // Check if we have textContent from the external file
    if (typeof textContent !== 'undefined') {
        // Try to get text from the theme and difficulty
        try {
            const texts = textContent[theme][difficulty];
            return texts[Math.floor(Math.random() * texts.length)];
        } catch (error) {
            // Silently fall back to default
        }
    }

    // Fallback to a default passage if textContent isn't available
    const defaultTexts = {
        beginner: "The quick brown fox jumps over the lazy dog.",
        intermediate: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        advanced: "The future belongs to those who believe in the beauty of their dreams, so remember to keep moving forward."
    };

    // Return appropriate default text based on difficulty or ultimate fallback
    return defaultTexts[difficulty] || defaultTexts.beginner;
}

// Display text in the text display area
function displayText(text) {
    textDisplay.innerHTML = '';

    // First, add the original text in a readable format for reference
    const referenceText = document.createElement('div');
    referenceText.innerText = text;
    referenceText.classList.add('reference-text');
    textDisplay.appendChild(referenceText);

    // Split text into characters and create spans for interactive typing
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
    if (!testActive) {
        return;
    }

    const inputText = typingInput.value;

    // Basic safety check - if no text to compare against, don't proceed
    if (!currentText || currentText.length === 0) {
        return;
    }

    // Start timer on first keystroke
    if (inputText.length > 0 && !window.timerStarted) {
        startTimer();
        window.timerStarted = true;

        // Remove the waiting-to-start class and tooltip
        if (timer) {
            timer.classList.remove('waiting-to-start');
            timer.removeAttribute('data-tooltip');
        }
    } else if (inputText.length === 0 && window.timerStarted) {
        // If user deletes all their typing, reset the indicator but keep the timer running
        // We don't want to reset the timer as that would allow cheating
        if (timer) {
            timer.classList.remove('waiting-to-start');
            timer.removeAttribute('data-tooltip');
        }
    }

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

        // Get character's inner text safely
        const charText = characters[i].innerText;

        // Check if character is correct
        if (inputText[i] === charText) {
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
    
    // Update ARIA attributes for screen readers
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.setAttribute('aria-valuenow', Math.round(progress));
    }

    // Check if test is complete (all characters typed correctly)
    if (characters && characters.length > 0) {
        // Primary completion check - all characters are correct and all characters typed
        if (correctCharacters === characters.length && inputText.length === characters.length) {
            // Ensure the timer stops immediately
            testActive = false;
            
            // Stop the test and show results
            finishTest();
            return;
        }
        
        // Secondary completion check - all text entered but maybe with errors
        if (inputText.length === currentText.length && inputText === currentText) {
            testActive = false;
            finishTest();
            return;
        }
    }
}

// Finish the test and show results
function finishTest() {
    // Immediately capture the end time for maximum precision
    endTime = new Date().getTime();

    // Stop the test and timer - make extra sure the timer is stopped
    testActive = false;
    clearInterval(timerInterval);
    timerInterval = null;  // Clear the interval reference completely
    window.timerStarted = false;

    // Calculate exact time elapsed with millisecond precision
    const exactTimeElapsed = (endTime - startTime) / 1000; // in seconds with decimal precision

    // Immediately update the timer display to reflect the final time
    if (timer) {
        // Update the timer display with the exact final time (to show completion)
        timer.textContent = `${exactTimeElapsed.toFixed(2)}s`;
    }

    // Calculate WPM using the precise time measurement
    const minutes = exactTimeElapsed / 60;
    const words = currentText.length / 5;
    const wpm = Math.round(words / minutes);

    // Calculate accuracy
    const accuracy = Math.round(((totalCharactersTyped - errors) / totalCharactersTyped) * 100);

    // Display results with improved precision (one decimal place for time)
    wpmValue.textContent = wpm;
    accuracyValue.textContent = `${accuracy}%`;
    timeValue.textContent = `${exactTimeElapsed.toFixed(2)}s`; // Show 2 decimal places for more precision
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
    saveResult(wpm, accuracy, exactTimeElapsed, errors, difficulty, theme);
    
    // Dispatch custom event for accessibility announcements
    const testCompleteEvent = new CustomEvent('testComplete', { 
        detail: { 
            wpm, 
            accuracy, 
            time: exactTimeElapsed, 
            errors 
        } 
    });
    document.dispatchEvent(testCompleteEvent);
}

// Reset the test
function resetTest() {
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
    window.timerStarted = false;
}

// Toggle pause/resume test
function togglePauseTest() {
    if (!testActive && !testPaused) {
        return; // Test hasn't started or has already finished
    }

    if (testPaused) {
        // Resume test
        testPaused = false;
        
        // Re-enable input
        typingInput.disabled = false;
        typingInput.focus();
        
        // Restore timer
        const pauseDuration = (new Date().getTime() - pausedAtTime) / 1000;
        startTime += (pauseDuration * 1000); // Adjust start time to account for pause
        startTimer();
        
        // Update UI
        if (typingInput.parentElement) {
            typingInput.parentElement.classList.remove('paused');
        }
        
        // Announce to screen readers
        if (typeof AccessibilityManager !== 'undefined') {
            AccessibilityManager.announceToScreenReader('Test resumed');
        }
        
        // Remove pause overlay if it exists
        const pauseOverlay = document.getElementById('pause-overlay');
        if (pauseOverlay) {
            pauseOverlay.remove();
        }
    } else {
        // Pause test
        testPaused = true;
        
        // Stop timer
        clearInterval(timerInterval);
        pausedAtTime = new Date().getTime();
        
        // Disable input
        typingInput.disabled = true;
        
        // Update UI
        if (typingInput.parentElement) {
            typingInput.parentElement.classList.add('paused');
        }
        
        // Add pause overlay
        const overlay = document.createElement('div');
        overlay.id = 'pause-overlay';
        overlay.className = 'pause-overlay';
        overlay.innerHTML = `
            <div class="pause-message">
                <h3>Test Paused</h3>
                <p>Press Ctrl+P to resume</p>
                <button id="resume-btn" class="secondary-btn">Resume Test</button>
            </div>
        `;
        testContainer.appendChild(overlay);
        
        // Add event listener to resume button
        const resumeBtn = document.getElementById('resume-btn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', togglePauseTest);
            
            // Set up focus trap for accessibility
            if (typeof AccessibilityManager !== 'undefined') {
                AccessibilityManager.setupFocusTrap(overlay);
            } else {
                // Fallback - just focus the button
                resumeBtn.focus();
            }
        }
        
        // Announce to screen readers
        if (typeof AccessibilityManager !== 'undefined') {
            AccessibilityManager.announceToScreenReader('Test paused. Press Control+P to resume.');
        }
    }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl+R for restart
    if (e.ctrlKey && e.key === 'r' && testContainer.classList.contains('active')) {
        e.preventDefault(); // Prevent browser refresh
        resetTest();
    }

    // Ctrl+P for pause/resume
    if (e.ctrlKey && e.key === 'p' && testContainer.classList.contains('active')) {
        e.preventDefault(); // Prevent browser print dialog
        togglePauseTest();
    }

    // Escape to quit test
    if (e.key === 'Escape' && testContainer.classList.contains('active')) {
        resetTest();
    }
}

// Start timer
function startTimer() {
    clearInterval(timerInterval);

    // Store the precise start time when first character is typed
    startTime = new Date().getTime();

    // Calculate and display initial time
    const currentTime = new Date().getTime();
    timeElapsed = (currentTime - startTime) / 1000;
    if (timer) timer.textContent = `${Math.floor(timeElapsed)}s`;
    if (currentWpm) updateCurrentWpm();

    timerInterval = setInterval(() => {
        // Double check that the test is still active
        if (!testActive) {
            // If test is not active anymore, clear the interval
            clearInterval(timerInterval);
            timerInterval = null;
            return;
        }

        // Calculate time elapsed in real-time with millisecond precision
        const currentTime = new Date().getTime();
        timeElapsed = (currentTime - startTime) / 1000;

        // Update timer display (showing only whole seconds for cleaner UI during test)
        if (timer) timer.textContent = `${Math.floor(timeElapsed)}s`;

        // Update current WPM using precise time measurement
        updateCurrentWpm();

        // Safety check - if test has been running too long (5 minutes), stop it
        if (timeElapsed > (5 * 60)) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }, 100); // Update more frequently for better responsiveness
}

// Update current WPM during the test
function updateCurrentWpm() {
    if (totalCharactersTyped === 0) return;

    // Use precise timeElapsed for accurate WPM calculation
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
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                        label: function (context) {
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
}


// Simplified function that delegates to error-analysis.js or falls back to basic display
function showResults({ wpm, accuracy, timeElapsed, errors, errorMap }) {
    // Always try to use the error-analysis.js function first
    if (window.errorAnalysis && typeof window.errorAnalysis.showDetailedResults === 'function') {
        window.errorAnalysis.showDetailedResults({ wpm, accuracy, timeElapsed, errors, errorMap });
        return;
    }
    
    // Basic fallback if error-analysis.js is not available
    
    // Show results container
    resultsContainer.classList.remove('hidden');
    
    // Update metrics
    const wpmValue = document.getElementById('wpm-value');
    const accuracyValue = document.getElementById('accuracy-value');
    const timeValue = document.getElementById('time-value');
    const errorValue = document.getElementById('error-value');
    
    if (wpmValue) wpmValue.textContent = Math.round(wpm);
    if (accuracyValue) accuracyValue.textContent = Math.round(accuracy) + '%';
    if (timeValue) timeValue.textContent = `${timeElapsed}s`;
    if (errorValue) errorValue.textContent = errors;
}

// Export results to CSV
function exportResultsCSV({ wpm, accuracy, timeElapsed, errors, errorMap }) {
    const rows = [
        ['Metric', 'Value'],
        ['WPM', wpm],
        ['Accuracy (%)', accuracy],
        ['Time (s)', timeElapsed],
        ['Total Errors', errors],
        [],
        ['Word', 'Error Count'],
        ...Object.entries(errorMap)
    ];
    const csvContent = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `typeracer_results_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
});

// Finalize test and show detailed results
function finalizeTest() {
    // Get time elapsed
    const timeElapsed = (Date.now() - startTime) / 1000;
    
    // Get characters from the display
    const characters = textDisplay.querySelectorAll('.char');
    const correctChars = Array.from(characters).filter(char => char.classList.contains('correct')).length;
    const totalChars = characters.length;
    
    // Calculate WPM similar to the regular method
    const minutes = timeElapsed / 60;
    const words = totalChars / 5; // standard WPM calculation (5 chars = 1 word)
    const wpm = Math.round(words / minutes);
    
    // Calculate accuracy
    const accuracy = Math.round((correctChars / totalChars) * 100);
    
    // Create error map for heatmap
    const errorMap = {};
    // Group errors by word for a better visualization
    let currentWord = '';
    let wordErrorCount = 0;
    
    // Track character-level errors using error analysis module if available
    let charErrorMap = {};
    if (window.errorAnalysis && typeof window.errorAnalysis.trackCharacterErrors === 'function') {
        charErrorMap = window.errorAnalysis.trackCharacterErrors(Array.from(characters));
    }
    
    Array.from(characters).forEach((char, i) => {
        // Word boundary detection (space or punctuation)
        if (/\s/.test(char.innerText) || i === characters.length - 1) {
            // For the last character, add it to the current word if it's not a space
            if (i === characters.length - 1 && !/\s/.test(char.innerText)) {
                currentWord += char.innerText;
                if (char.classList.contains('incorrect')) {
                    wordErrorCount++;
                }
            }
            
            // Save word with errors to map
            if (currentWord && wordErrorCount > 0) {
                errorMap[currentWord] = wordErrorCount;
            }
            
            // Reset for next word
            currentWord = '';
            wordErrorCount = 0;
        } else {
            currentWord += char.innerText;
            if (char.classList.contains('incorrect')) {
                wordErrorCount++;
            }
        }
    });
    
    // Prepare analytics data
    const analyticsData = {
        wpm,
        accuracy,
        timeElapsed: timeElapsed.toFixed(2),
        errors: totalChars - correctChars,
        errorMap,
        charErrorMap
    };
    
    // Display results with error handling
    try {
        // Use the error analysis module if available
        if (window.errorAnalysis && typeof window.errorAnalysis.showDetailedResults === 'function') {
            window.errorAnalysis.showDetailedResults(analyticsData);
        } else {
            // Fallback to basic results
            showResults(analyticsData);
        }
    } catch (e) {
        console.error("Error displaying results:", e);
        alert("There was an error displaying your results. Please try again.");
    }
}
