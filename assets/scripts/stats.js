// Statistics and history tracking for TypeRacer
const StatsManager = {
    // Save a new test result
    saveResult: function(wpm, accuracy, time, errors, difficulty, theme) {
        // Get existing results or initialize empty array
        const existingResults = this.getResults();
        
        // Add new result
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
        
        // Only keep the last 50 results
        if (existingResults.length > 50) {
            existingResults.shift(); // Remove oldest
        }
        
        // Store back to localStorage
        localStorage.setItem('typeracerResults', JSON.stringify(existingResults));
        
        // Update personal bests
        this.updatePersonalBests(newResult);
        
        return newResult;
    },
    
    // Get all stored test results
    getResults: function() {
        return JSON.parse(localStorage.getItem('typeracerResults')) || [];
    },
    
    // Get personal best scores
    getPersonalBests: function() {
        return JSON.parse(localStorage.getItem('typeracerBests')) || {
            wpm: 0,
            accuracy: 0
        };
    },
    
    // Update personal best scores if needed
    updatePersonalBests: function(result) {
        const bests = this.getPersonalBests();
        let updated = false;
        
        if (result.wpm > bests.wpm) {
            bests.wpm = result.wpm;
            updated = true;
        }
        
        if (result.accuracy > bests.accuracy) {
            bests.accuracy = result.accuracy;
            updated = true;
        }
        
        if (updated) {
            localStorage.setItem('typeracerBests', JSON.stringify(bests));
        }
        
        return updated;
    },
    
    // Get average WPM from last n tests
    getAverageWPM: function(count = 5) {
        const results = this.getResults();
        if (results.length === 0) return 0;
        
        const lastNResults = results.slice(-Math.min(count, results.length));
        const sum = lastNResults.reduce((total, result) => total + result.wpm, 0);
        return Math.round(sum / lastNResults.length);
    },
    
    // Get average accuracy from last n tests
    getAverageAccuracy: function(count = 5) {
        const results = this.getResults();
        if (results.length === 0) return 0;
        
        const lastNResults = results.slice(-Math.min(count, results.length));
        const sum = lastNResults.reduce((total, result) => total + result.accuracy, 0);
        return Math.round(sum / lastNResults.length);
    },
    
    // Get improvement trend (positive or negative) based on last n tests
    getWPMTrend: function(count = 10) {
        const results = this.getResults();
        if (results.length < 2) return 0;
        
        const lastNResults = results.slice(-Math.min(count, results.length));
        if (lastNResults.length < 2) return 0;
        
        const first = lastNResults[0].wpm;
        const last = lastNResults[lastNResults.length - 1].wpm;
        
        return last - first;
    }
};
