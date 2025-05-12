# TypeRacer
A simple project for a Typing Speed Test Website built with HTML, CSS and JavaScript. The goal is to create an intuitive and user-friendly platform that allows users to test and improve their typing speed. Its a part of Code Institute and WAES collaborative Full Stack Developer Bootcamp program. 

## TypeRacer User Stories (Enhanced)

<!-- Enhanced and Modernized User Stories ordered by implementation priority -->

1. **Test Initialization & Setup (must-have)**
   - As a new visitor, I want to launch the typing test with a single click or Enter key, so that I can begin practicing immediately.

2. **Difficulty & Content Selection (must-have)**
   - As a user, I want to select my skill level (Beginner, Intermediate, Advanced) and text theme (Code, Literature, News), so that I can practice on content that motivates me.

3. **Real-Time Typing Experience (must-have)**
   - As a learner, I want instant visual feedback (correct keystrokes in green, mistakes in red) and an animated progress bar, so that I stay focused and correct errors on the fly.

4. **Detailed Results & Analytics (must-have)**
   - As a competitive typist, I want a detailed breakdown of WPM, accuracy percentage, and an error heatmap, so that I can pinpoint areas for improvement.

5. **Accessibility Support (must-have)**
   - As a user requiring accessibility support, I want screen-reader compatibility and high-contrast themes, so that I can use the app regardless of ability.

6. **Keyboard Shortcuts (should-have)**
   - As a power user, I want convenient keyboard shortcuts (Pause/Resume, Restart), so that I can control the test without leaving the typing area.

7. **UI Personalization (should-have)**
   - As a user with visual preferences, I want light/dark mode and adjustable font sizes, so that I can type comfortably in any environment.

8. **Performance Trends & Personal Bests (should-have)**
   - As a returning user, I want to view my performance trends and personal bests per difficulty level, so that I can track progress over time.

9. **Social Sharing & Leaderboard (could-have)**
   - As a social learner, I want to share my results and achievements on social media or a community leaderboard, so that I can challenge friends and celebrate milestones.

10. **Gamification & Badges (could-have)**
   - As a motivated user, I want to unlock badges and new text themes as I progress, so that I stay engaged and rewarded for consistent practice.

## Enhanced Stories: Acceptance Criteria & Tasks

### 1. Test Initialization & Setup (must-have) ✅ COMPLETED
**As a new visitor, I want to launch the typing test with a single click or Enter key, so that I can begin practicing immediately.**

**Acceptance Criteria:**
- [x] A clearly labeled "Start Test" button is visible on page load.
- [x] Pressing the Enter key when focused on the page also starts the test.
- [x] The test area appears immediately without full page reload.
- [x] Input field is auto-focused when the test starts.

**Tasks:**
- [x] Design and place a prominent "Start Test" button on the homepage.
- [x] Add JavaScript listener for the Enter key to trigger test start.
- [x] Implement DOM update to reveal test area dynamically.
- [x] Auto-focus the typing input when the test initializes.

### 2. Difficulty & Content Selection (must-have) ✅ COMPLETED
**As a user, I want to select my skill level (Beginner, Intermediate, Advanced) and text theme (Code, Literature, News), so that I can practice on content that motivates me.**

**Acceptance Criteria:**
- [x] Dropdown menus or segmented controls allow choosing level and theme before starting.
- [x] Selection persists until reset or retry.
- [x] Available options are distinctly styled and accessible.

**Tasks:**
- [x] Create level and theme selection UI components.
- [x] Store user selections in session state or variables.
- [x] Style controls for focus, hover, and active states.
- [x] Validate that selections load corresponding text passages.

### 3. Real-Time Typing Experience (must-have) ✅ COMPLETED
**As a learner, I want instant visual feedback (correct keystrokes in green, mistakes in red) and an animated progress bar, so that I stay focused and correct errors on the fly.**

**Acceptance Criteria:**
- [x] Correct characters highlight in green; mistakes in red in real time.
- [x] A progress bar fills proportionally to text completion.
- [x] Feedback and animation remain smooth at 60fps.

**Tasks:**
- [x] Implement character-by-character comparison logic in JS.
- [x] Apply CSS classes for correct/incorrect highlights.
- [x] Add an animated progress bar component tied to input length.
- [x] Optimize rendering to avoid jank.

### 4. Detailed Results & Analytics (must-have) ✅ COMPLETED
**As a competitive typist, I want a detailed breakdown of WPM, accuracy percentage, and an error heatmap, so that I can pinpoint areas for improvement.**

**Acceptance Criteria:**
- [x] Results page shows WPM, accuracy, time elapsed, and error count.
- [x] An error heatmap highlights mistyped words by frequency.
- [x] A download button exports results as CSV.

**Tasks:**
- [x] Compute metrics (WPM, accuracy, errors) after test completion.
- [x] Render an error heatmap chart using Chart.js or similar.
- [x] Add CSV export functionality for results.

### 5. Accessibility Support (must-have) ✅ COMPLETED
**As a user requiring accessibility support, I want screen-reader compatibility and high-contrast themes, so that I can use the app regardless of ability.**

**Acceptance Criteria:**
- [x] All interactive elements have ARIA labels and keyboard focus states.
- [x] High-contrast theme meets WCAG AA standards.
- [x] Screen readers announce test progress and results.

**Tasks:**
- [x] Audit and apply appropriate ARIA roles and labels.
- [x] Define a high-contrast theme variant in CSS.
- [x] Test with screen readers (NVDA, VoiceOver).

### 6. Keyboard Shortcuts (should-have) ✅ COMPLETED
**As a power user, I want convenient keyboard shortcuts (Pause/Resume, Restart), so that I can control the test without leaving the typing area.**

**Acceptance Criteria:**
- [x] Pressing Ctrl+P (or ⌘+P) pauses/resumes the test.
- [x] Pressing Ctrl+R (or ⌘+R) restarts the test.
- [x] Shortcuts are documented in a help tooltip.

**Tasks:**
- [x] Add global keydown listeners for all keyboard shortcuts.
- [x] Implement pause/resume function in JS.
- [x] Document keyboard shortcuts in the UI (shown in keyboard-shortcuts section).

### 7. UI Personalization (should-have) ✅ COMPLETED
**As a user with visual preferences, I want light/dark mode and adjustable font sizes, so that I can type comfortably in any environment.**

**Acceptance Criteria:**
- [x] Toggle switch for light/dark mode persists user choice.
- [x] Font size slider adjusts text size in real time.
- [x] Preference is stored and applied on return visits.

**Tasks:**
- [x] Implement theme toggler with CSS custom properties.
- [x] Add font size control slider and bind to text elements.
- [x] Persist settings to localStorage (for dark mode and font size).

### 8. Performance Trends & Personal Bests (should-have) ✅ COMPLETED
**As a returning user, I want to view my performance trends and personal bests per difficulty level, so that I can track progress over time.**

**Acceptance Criteria:**
- [x] Past test records are stored in localStorage or indexedDB.
- [x] A line chart visualizes trend of WPM over time.
- [x] Personal best per level is displayed prominently.

**Tasks:**
- [x] Save test results to browser storage.
- [x] Integrate charting library to plot historical data.
- [x] Highlight and label personal best records.

### 9. Social Sharing & Leaderboard (could-have) 🔄 NEXT PRIORITY
**As a social learner, I want to share my results and achievements on social media or a community leaderboard, so that I can challenge friends and celebrate milestones.**

**Acceptance Criteria:**
- [ ] Buttons for Twitter, Facebook, and LinkedIn share pre-filled results.
- [ ] Public leaderboard displays top WPM scores for each level.
- [ ] Users can opt in/out of public leaderboard.

**Tasks:**
- [ ] Integrate social share links with URL parameters.
- [ ] Build a simple JSON file or API to store leaderboard entries.
- [ ] Create leaderboard UI with filters by level.

### 10. Gamification & Badges (could-have)
**As a motivated user, I want to unlock badges and new text themes as I progress, so that I stay engaged and rewarded for consistent practice.**

**Acceptance Criteria:**
- [ ] Badges are earned for milestones (e.g., 50 WPM, 100 tests taken).
- [ ] New text themes unlock after preset achievements.
- [ ] Users can view earned badges in a profile section.

**Tasks:**
- [ ] Define a set of badges and unlock criteria.
- [ ] Implement badge awarding logic on result submission.
- [ ] Design a profile page to display badges and themes unlocked.

<!-- Original user stories follow for reference -->