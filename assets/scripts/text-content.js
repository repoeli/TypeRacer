// Text content for TypeRacer organized by theme and difficulty
const textContent = {
    general: {
        beginner: [
            "The quick brown fox jumps over the lazy dog.",
            "A journey of a thousand miles begins with a single step.",
            "All that glitters is not gold, all who wander are not lost."
        ],
        intermediate: [
            "Success is not final, failure is not fatal: It is the courage to continue that counts.",
            "The greatest glory in living lies not in never falling, but in rising every time we fall.",
            "Life is what happens when you're busy making other plans."
        ],
        advanced: [
            "Yesterday is history, tomorrow is a mystery, but today is a gift. That is why it is called the present.",
            "The future belongs to those who believe in the beauty of their dreams, so remember to keep moving forward.",
            "You say this survey is monotonous rather than glorious. You should surely hurry to Vancouver for some delicious yuletide fare."
        ]
    },
    code: {
        beginner: [
            "function greet() { return 'Hello, world!'; }",
            "const sum = (a, b) => a + b;",
            "if (isTrue) { console.log('This condition is valid'); }"
        ],
        intermediate: [
            "document.addEventListener('DOMContentLoaded', function() { console.log('DOM fully loaded and parsed'); });",
            "const result = array.map(item => item.value).filter(value => value > 10).reduce((sum, val) => sum + val, 0);",
            "class Rectangle { constructor(height, width) { this.height = height; this.width = width; } }"
        ],
        advanced: [
            "async function fetchData() { try { const response = await fetch('https://api.example.com/data'); const data = await response.json(); return data; } catch (error) { console.error('Error:', error); } }",
            "const memoize = (fn) => { const cache = {}; return (...args) => { const key = JSON.stringify(args); if (key in cache) { return cache[key]; } const result = fn(...args); cache[key] = result; return result; }; };",
            "interface User { id: number; name: string; email?: string; } class UserService { getUsers(): Promise<User[]> { return fetch('/api/users').then(response => response.json()); } }"
        ]
    },
    literature: {
        beginner: [
            "It was the best of times, it was the worst of times.",
            "Call me Ishmael. Some years ago, never mind how long precisely.",
            "In a hole in the ground there lived a hobbit."
        ],
        intermediate: [
            "All happy families are alike; each unhappy family is unhappy in its own way.",
            "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
            "The past is never dead. It's not even past."
        ],
        advanced: [
            "I am an invisible man. No, I am not a spook like those who haunted Edgar Allan Poe; nor am I one of your Hollywood-movie ectoplasms.",
            "Many years later, as he faced the firing squad, Colonel Aureliano Buendía was to remember that distant afternoon when his father took him to discover ice.",
            "Stately, plump Buck Mulligan came from the stairhead, bearing a bowl of lather on which a mirror and a razor lay crossed."
        ]
    },
    quotes: {
        beginner: [
            "Be yourself; everyone else is already taken.",
            "Two things are infinite: the universe and human stupidity.",
            "Be the change that you wish to see in the world."
        ],
        intermediate: [
            "In three words I can sum up everything I've learned about life: it goes on.",
            "Darkness cannot drive out darkness: only light can do that. Hate cannot drive out hate: only love can do that.",
            "I have not failed. I've just found 10,000 ways that won't work."
        ],
        advanced: [
            "I am enough of an artist to draw freely upon my imagination. Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.",
            "The fear of death follows from the fear of life. A man who lives fully is prepared to die at any time, because he has experienced all life has to offer.",
            "It is not our abilities that show what we truly are. It is our choices."
        ]
    }
};
