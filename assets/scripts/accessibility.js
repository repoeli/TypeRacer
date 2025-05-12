/**
 * TypeRacer Accessibility Module
 * Provides accessibility features including screen reader support and high-contrast mode
 */

const AccessibilityManager = {
    // Initialize accessibility features
    init() {
        this.setupHighContrastMode();
        this.setupFontSizeControls();
        this.setupFocusIndicators();
        this.setupScreenReaderAnnouncements();
        this.setupEventListeners();
    },

    // Set up high contrast mode toggle
    setupHighContrastMode() {
        // Check if high contrast mode is enabled in localStorage
        const isHighContrastMode = localStorage.getItem('highContrastMode') === 'true';
        
        if (isHighContrastMode) {
            document.body.classList.add('high-contrast');
        }

        // Set checkbox state if it exists
        const highContrastCheckbox = document.getElementById('high-contrast-mode');
        if (highContrastCheckbox) {
            highContrastCheckbox.checked = isHighContrastMode;
            
            // Add event listener
            highContrastCheckbox.addEventListener('change', () => {
                this.toggleHighContrast(highContrastCheckbox.checked);
            });
        }

        // Create high contrast toggle if it doesn't exist yet
        if (!document.getElementById('accessibility-panel')) {
            this.createAccessibilityPanel();
        }
    },
    
    // Set up font size controls
    setupFontSizeControls() {
        // Get saved font size or use default
        const savedFontSize = parseInt(localStorage.getItem('fontSize')) || 18;
        
        // Setup slider if it exists
        const fontSizeSlider = document.getElementById('font-size-slider');
        const fontSizeValue = document.getElementById('font-size-value');
        const decreaseFontBtn = document.getElementById('decrease-font-btn');
        const increaseFontBtn = document.getElementById('increase-font-btn');
        
        if (fontSizeSlider) {
            // Set initial value
            fontSizeSlider.value = savedFontSize;
            
            if (fontSizeValue) {
                fontSizeValue.textContent = `${savedFontSize}px`;
            }
            
            // Add event listeners
            fontSizeSlider.addEventListener('input', () => {
                const newSize = parseInt(fontSizeSlider.value);
                this.updateFontSize(newSize);
                if (fontSizeValue) {
                    fontSizeValue.textContent = `${newSize}px`;
                }
            });
        }
        
        // Setup button controls
        if (decreaseFontBtn) {
            decreaseFontBtn.addEventListener('click', () => {
                const currentSize = parseInt(localStorage.getItem('fontSize')) || 18;
                const newSize = Math.max(14, currentSize - 2);
                this.updateFontSize(newSize);
                if (fontSizeSlider) fontSizeSlider.value = newSize;
                if (fontSizeValue) fontSizeValue.textContent = `${newSize}px`;
            });
        }
        
        if (increaseFontBtn) {
            increaseFontBtn.addEventListener('click', () => {
                const currentSize = parseInt(localStorage.getItem('fontSize')) || 18;
                const newSize = Math.min(36, currentSize + 2);
                this.updateFontSize(newSize);
                if (fontSizeSlider) fontSizeSlider.value = newSize;
                if (fontSizeValue) fontSizeValue.textContent = `${newSize}px`;
            });
        }
        
        // Apply saved font size initially
        this.updateFontSize(savedFontSize);
    },

    // Create accessibility panel with controls
    createAccessibilityPanel() {
        const accessPanel = document.createElement('div');
        accessPanel.id = 'accessibility-panel';
        accessPanel.className = 'accessibility-panel';
        accessPanel.setAttribute('aria-label', 'Accessibility options');

        // Create high contrast mode toggle
        const contrastToggle = document.createElement('button');
        contrastToggle.id = 'high-contrast-toggle';
        contrastToggle.className = 'accessibility-btn';
        contrastToggle.setAttribute('aria-label', 'Toggle high contrast mode');
        contrastToggle.setAttribute('title', 'Toggle high contrast mode');
        
        // Add contrast icon
        contrastToggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20Z"></path>
                <path d="M12 2v20"></path>
            </svg>
        `;

        // Create font size controls
        const fontSizeControls = document.createElement('div');
        fontSizeControls.className = 'font-size-controls';
        
        const decreaseFontBtn = document.createElement('button');
        decreaseFontBtn.id = 'decrease-font';
        decreaseFontBtn.className = 'accessibility-btn';
        decreaseFontBtn.setAttribute('aria-label', 'Decrease font size');
        decreaseFontBtn.setAttribute('title', 'Decrease font size');
        decreaseFontBtn.innerHTML = 'A<sup>-</sup>';
        
        const increaseFontBtn = document.createElement('button');
        increaseFontBtn.id = 'increase-font';
        increaseFontBtn.className = 'accessibility-btn';
        increaseFontBtn.setAttribute('aria-label', 'Increase font size');
        increaseFontBtn.setAttribute('title', 'Increase font size');
        increaseFontBtn.innerHTML = 'A<sup>+</sup>';
        
        fontSizeControls.appendChild(decreaseFontBtn);
        fontSizeControls.appendChild(increaseFontBtn);

        // Add all controls to the panel
        accessPanel.appendChild(contrastToggle);
        accessPanel.appendChild(fontSizeControls);
        
        // Add panel to the document
        document.querySelector('main').appendChild(accessPanel);
        
        // Setup event listeners for the new controls
        contrastToggle.addEventListener('click', this.toggleHighContrast.bind(this));
        decreaseFontBtn.addEventListener('click', () => this.adjustFontSize(-1));
        increaseFontBtn.addEventListener('click', () => this.adjustFontSize(1));
    },

    // Toggle high contrast mode
    toggleHighContrast(forcedState = null) {
        if (forcedState === true) {
            document.body.classList.add('high-contrast');
        } else if (forcedState === false) {
            document.body.classList.remove('high-contrast');
        } else {
            document.body.classList.toggle('high-contrast');
        }
        
        const isHighContrast = document.body.classList.contains('high-contrast');
        localStorage.setItem('highContrastMode', isHighContrast);
        
        // Synchronize UI
        const highContrastCheckbox = document.getElementById('high-contrast-mode');
        if (highContrastCheckbox && highContrastCheckbox.checked !== isHighContrast) {
            highContrastCheckbox.checked = isHighContrast;
        }
        
        // Announce to screen readers
        this.announceToScreenReader(`High contrast mode ${isHighContrast ? 'enabled' : 'disabled'}`);
    },

    // Adjust font size by an increment
    adjustFontSize(change) {
        const currentSize = parseInt(localStorage.getItem('fontSize')) || 18;
        const newSize = Math.max(14, Math.min(36, currentSize + change));
        this.updateFontSize(newSize);
    },
    
    // Set font size to a specific value
    updateFontSize(newSize) {
        const textDisplay = document.getElementById('text-display');
        const typingInput = document.getElementById('typing-input');
        
        if (!textDisplay || !typingInput) return;
        
        // Apply new font size
        textDisplay.style.fontSize = `${newSize}px`;
        typingInput.style.fontSize = `${newSize}px`;
        
        // Save preference
        localStorage.setItem('fontSize', newSize);
        
        // Update any reference text (which may be separate from text display)
        const referenceText = document.querySelector('.reference-text');
        if (referenceText) {
            referenceText.style.fontSize = `${newSize}px`;
        }
        
        // Announce to screen readers
        this.announceToScreenReader(`Font size changed to ${newSize} pixels`);
    },

    // Set up better focus indicators for keyboard navigation
    setupFocusIndicators() {
        // This is handled via CSS
    },

    // Set up screen reader announcement area
    setupScreenReaderAnnouncements() {
        if (!document.getElementById('sr-announcer')) {
            const announcer = document.createElement('div');
            announcer.id = 'sr-announcer';
            announcer.className = 'sr-only';
            announcer.setAttribute('aria-live', 'polite');
            document.body.appendChild(announcer);
        }
    },

    // Announce message to screen readers
    announceToScreenReader(message) {
        const announcer = document.getElementById('sr-announcer');
        if (announcer) {
            announcer.textContent = message;
        }
    },

    // Announce typing progress
    announceProgress(percentage, wpm) {
        if (percentage % 25 === 0) { // Announce at 25%, 50%, 75%
            this.announceToScreenReader(`${percentage}% complete. Current speed: ${wpm} words per minute.`);
        }
    },

    // Announce test results
    announceResults(wpm, accuracy, time, errors) {
        this.announceToScreenReader(`Test complete. Your results: ${wpm} words per minute, ${accuracy}% accuracy, ${time} seconds, with ${errors} errors.`);
    },

    // Manage focus trap for modal dialogs like the pause overlay
    setupFocusTrap(container) {
        if (!container) return;
        
        // Find all focusable elements
        const focusableElements = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        // Set initial focus
        if (firstFocusableElement) {
            firstFocusableElement.focus();
        }
        
        // Handle tab key presses to trap focus
        container.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                // If shift+tab pressed and focus on first element, move to last
                if (e.shiftKey && document.activeElement === firstFocusableElement) {
                    e.preventDefault();
                    lastFocusableElement.focus();
                }
                // If tab pressed and focus on last element, move to first
                else if (!e.shiftKey && document.activeElement === lastFocusableElement) {
                    e.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        });
    },

    // Set up event listeners
    setupEventListeners() {
        // Listen for test completion to announce results
        document.addEventListener('testComplete', (e) => {
            const detail = e.detail;
            if (detail) {
                this.announceResults(
                    detail.wpm || 0, 
                    detail.accuracy || 0, 
                    detail.time || 0, 
                    detail.errors || 0
                );
            }
        });

        // Apply saved font size on load
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            const textDisplay = document.getElementById('text-display');
            const typingInput = document.getElementById('typing-input');
            if (textDisplay && typingInput) {
                textDisplay.style.fontSize = `${savedFontSize}px`;
                typingInput.style.fontSize = `${savedFontSize}px`;
            }
        }
    }
};

// Initialize accessibility features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    AccessibilityManager.init();
});
