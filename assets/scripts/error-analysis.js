// Error Analysis Module for TypeRacer
// This module provides advanced error tracking and visualization

// Create a namespace to avoid global pollution
window.errorAnalysis = window.errorAnalysis || {};

/**
 * Track character-level errors in a typing test
 * @param {Array} characters - Array of DOM elements representing typed characters
 * @return {Object} Map of character errors by character
 */
window.errorAnalysis.trackCharacterErrors = function(characters) {
    const charErrorMap = {};
    
    characters.forEach(char => {
        if (char.classList.contains('incorrect')) {
            const letter = char.innerText;
            charErrorMap[letter] = (charErrorMap[letter] || 0) + 1;
        }
    });
    
    return charErrorMap;
};

/**
 * Render a heatmap chart showing word errors
 * @param {Object} errorMap - Map of errors by word
 */
window.errorAnalysis.renderHeatmapChart = function(errorMap) {
    const heatmapContainer = document.getElementById('heatmap-container');
    const errorHeatmap = document.getElementById('error-heatmap');
    
    // Safety check - make sure we have the container
    if (!heatmapContainer || !errorHeatmap) {
        console.error('Error heatmap container not found');
        return;
    }
    
    // Show the heatmap section
    errorHeatmap.classList.remove('hidden');
    
    // Transform errorMap { word: count } → datasets
    const labels = Object.keys(errorMap);
    const data = labels.map(w => errorMap[w]);
    
    // Check if we have any error data
    if (labels.length === 0 || data.every(d => d === 0)) {
        // No errors to display - show a placeholder message
        heatmapContainer.innerHTML = 
            '<div class="no-errors-message">No errors detected! Perfect typing or not enough data to generate a chart.</div>';
        return;
    }
    
    // Make sure we have a canvas element
    heatmapContainer.innerHTML = '<canvas id="heatmap-chart"></canvas>';
    
    // Now get the context of our new canvas
    const ctx = document.getElementById('heatmap-chart').getContext('2d');
    
    // Create an enhanced bar chart with better styling
    // Create the chart with the error data
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels, 
            datasets: [{
                label: 'Mistakes per word',
                data,
                backgroundColor: data.map(v => `rgba(239,71,111, ${Math.min(1, 0.3 + v / 5)})`),
                borderColor: data.map(v => `rgba(239,71,111, 1)`),
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Words with Errors',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(items) {
                            return `Word: "${items[0].label}"`;
                        },
                        label: function(item) {
                            return `Errors: ${item.raw} ${item.raw === 1 ? 'mistake' : 'mistakes'}`;
                        }
                    }
                }
            },
            scales: {
                x: { 
                    ticks: { 
                        autoSkip: false,
                        maxRotation: 45,
                        minRotation: 45
                    },
                    title: {
                        display: true,
                        text: 'Words'
                    }
                },
                y: { 
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Error Count'
                    },
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
};

/**
 * Show detailed results after a typing test
 * @param {Object} data - Test result data including WPM, accuracy, errors, etc.
 */
window.errorAnalysis.showDetailedResults = function(data) {
    const { wpm, accuracy, timeElapsed, errors, errorMap, charErrorMap } = data;
    
    // Main metrics
    const resultsContainer = document.getElementById('results-container');
    const wpmValue = document.getElementById('wpm-value');
    const accuracyValue = document.getElementById('accuracy-value');
    const timeValue = document.getElementById('time-value');
    const errorValue = document.getElementById('error-value');
    
    // Safety check
    if (!resultsContainer) {
        console.error("Results container not found!");
        return;
    }
    
    // Show the results container
    resultsContainer.classList.remove('hidden');
    
    // Update values
    if (wpmValue) wpmValue.textContent = Math.round(wpm);
    if (accuracyValue) accuracyValue.textContent = Math.round(accuracy) + '%';
    if (timeValue) timeValue.textContent = `${timeElapsed}s`;
    if (errorValue) errorValue.textContent = errors;
    
    // Render the heatmap if we have error data
    if (errorMap && Object.keys(errorMap).length > 0) {
        this.renderHeatmapChart(errorMap);
    } else {
        // Hide the heatmap container if no errors
        const errorHeatmap = document.getElementById('error-heatmap');
        if (errorHeatmap) {
            errorHeatmap.classList.add('hidden');
        }
    }
    
    // Update statistics display if StatsManager is available
    if (typeof updateStatsDisplay === 'function') {
        updateStatsDisplay();
    }
};

// Export functions globally for backward compatibility
window.showDetailedResults = window.errorAnalysis.showDetailedResults;
window.renderHeatmapChart = window.errorAnalysis.renderHeatmapChart;
window.trackCharacterErrors = window.errorAnalysis.trackCharacterErrors;