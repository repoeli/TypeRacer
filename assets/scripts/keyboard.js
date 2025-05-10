// Virtual Keyboard functionality for TypeRacer
const VirtualKeyboard = {
    // Store key elements by character for quick access
    keys: {},
    
    // Initialize the virtual keyboard display
    init: function() {
        // Get container
        this.container = document.getElementById('keyboard-container');
        if (!this.container) return false;
        
        // Create keyboard layout
        this.createLayout();
        
        // Listen for keypresses to highlight keys
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        return true;
    },
    
    // Create keyboard layout
    createLayout: function() {
        const layout = [
            ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
            ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
            ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
            ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
            ['Ctrl', 'Alt', 'Space', 'Alt', 'Ctrl']
        ];
        
        // Create rows and keys
        layout.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'keyboard-row';
            
            row.forEach(key => {
                const keyDiv = document.createElement('div');
                keyDiv.className = 'key';
                keyDiv.textContent = key;
                
                // Add special classes for wider keys
                switch(key) {
                    case 'Backspace':
                    case 'Enter':
                        keyDiv.classList.add('wider');
                        break;
                    case 'Tab':
                    case 'Caps':
                    case 'Shift':
                        keyDiv.classList.add('wide');
                        break;
                    case 'Ctrl':
                    case 'Alt':
                        keyDiv.classList.add('wide');
                        break;
                    case 'Space':
                        keyDiv.classList.add('space');
                        break;
                }
                
                // Store reference to this key element
                this.keys[key.toLowerCase()] = keyDiv;
                
                rowDiv.appendChild(keyDiv);
            });
            
            this.container.appendChild(rowDiv);
        });
    },
    
    // Handle key down events
    handleKeyDown: function(e) {
        const key = e.key.toLowerCase();
        
        // Map some special keys
        const mappedKey = this.mapSpecialKey(key);
        
        if (this.keys[mappedKey]) {
            this.keys[mappedKey].classList.add('active');
        }
    },
    
    // Handle key up events
    handleKeyUp: function(e) {
        const key = e.key.toLowerCase();
        
        // Map some special keys
        const mappedKey = this.mapSpecialKey(key);
        
        if (this.keys[mappedKey]) {
            this.keys[mappedKey].classList.remove('active');
            
            // Remove other states after a short delay
            setTimeout(() => {
                this.keys[mappedKey].classList.remove('correct', 'incorrect');
            }, 300);
        }
    },
    
    // Map special keys to their display names
    mapSpecialKey: function(key) {
        switch(key) {
            case ' ':
                return 'space';
            case 'control':
                return 'ctrl';
            case 'shift':
            case 'enter':
            case 'backspace':
            case 'tab':
            case 'capslock':
                return key.toLowerCase();
            default:
                return key;
        }
    },
    
    // Highlight a key as correctly typed
    highlightCorrect: function(char) {
        const key = char.toLowerCase();
        if (this.keys[key]) {
            this.keys[key].classList.add('correct');
            
            // Remove the class after a short delay
            setTimeout(() => {
                this.keys[key].classList.remove('correct');
            }, 300);
        }
    },
    
    // Highlight a key as incorrectly typed
    highlightIncorrect: function(char) {
        const key = char.toLowerCase();
        if (this.keys[key]) {
            this.keys[key].classList.add('incorrect');
            
            // Remove the class after a short delay
            setTimeout(() => {
                this.keys[key].classList.remove('incorrect');
            }, 300);
        }
    }
};
