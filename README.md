# Focus Mode - Study Companion

A simple, effective web application that helps students concentrate and manage their study time using the Pomodoro Technique.

## Project Description

Focus Mode is a vanilla HTML, CSS, and JavaScript web application designed to improve student productivity through scientifically-proven study intervals. The app features a 25-minute focus session followed by 5-minute breaks, with automatic session tracking and progress visualization.

## Features

- **Smart Timer**: 25-minute focus sessions with 5-minute breaks
- **Visual Progress Circle**: Real-time circular progress indicator with smooth animations
- **Session Tracking**: Automatic logging of all study sessions with timestamps
- **Statistics Dashboard**: View comprehensive statistics including:
  - Total sessions completed
  - Total focus time accumulated
  - Today's session count
  - Consecutive study day streak
  - Detailed session history
- **Auto-Save Functionality**: All data is automatically saved to browser's localStorage
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Browser Notifications**: Optional notifications when sessions end
- **Audio Feedback**: Sound notification when timer completes

## Technologies Used

- **HTML5**: Semantic structure and form elements
- **CSS3**: 
  - Flexbox and CSS Grid for responsive layouts
  - CSS Variables for consistent design tokens
  - SVG for circular progress indicator
  - Media queries for mobile responsiveness
- **Vanilla JavaScript**: 
  - DOM manipulation and event handling
  - LocalStorage API for data persistence
  - Web Audio API for audio notifications
  - Browser Notification API

## Project Structure

```
focus-mode/
├── index.html              # Home page
├── pages/
│   ├── timer.html         # Timer/focus session page
│   └── statistics.html    # Statistics and history page
├── styles/
│   └── styles.css         # Main stylesheet with design tokens
├── js/
│   ├── timer.js           # Timer logic and state management
│   └── statistics.js      # Statistics calculation and rendering
└── README.md              # Project documentation
```

## How to Run

1. **Clone or Download** the project files
2. **Open in Browser**: Simply open `index.html` in any modern web browser
3. **No Installation Required**: The app runs entirely in the browser with no build tools or dependencies

### Browser Compatibility

- Chrome/Chromium (Recommended)
- Firefox
- Safari
- Edge
- Any modern browser supporting ES6 JavaScript

## How to Use

### Starting a Focus Session

1. Navigate to the **Timer** page
2. Click the **Start** button to begin a 25-minute focus session
3. The circular progress indicator will show your remaining time
4. When the timer ends:
   - You'll receive a notification
   - A 5-minute break will automatically begin
   - Your session will be logged

### Viewing Statistics

1. Go to the **Statistics** page
2. View your study metrics:
   - Total sessions and focus time
   - Today's progress
   - Consecutive day streak
3. See detailed session history with timestamps
4. Click **Clear All Data** to reset (with confirmation)

### Pausing and Resetting

- **Pause**: Click the Pause button to temporarily stop the timer
- **Resume**: Click Start again to continue
- **Reset**: Click Reset to return to the initial state

## Technical Highlights

### Code Quality
- Clean, readable, and well-commented code
- Proper separation of concerns (HTML/CSS/JS)
- Meaningful variable and function names
- Consistent indentation and formatting

### Course Concepts Demonstrated

✅ **Semantic HTML5**
- Proper document structure with header, nav, main, section, article, footer
- Form inputs and labels
- Accessibility attributes (alt text, aria roles)

✅ **CSS Layout & Design**
- Flexbox for responsive navigation and controls
- CSS Grid for multi-column layouts
- Box Model and spacing principles
- CSS Variables for design token system
- Responsive design (mobile-first approach)

✅ **JavaScript Fundamentals**
- DOM manipulation (querySelector, addEventListener)
- Event handling (click, submit)
- State management and data persistence
- Function composition and modular code
- Array and object manipulation
- Date/Time handling

✅ **Interactivity Features**
- Interactive timer with start/pause/reset
- Real-time progress visualization
- Modal notifications
- Dynamic content rendering
- Form validation and data handling

## Data Storage

All user data is stored locally using the **Browser's LocalStorage API**:
- Session history
- Total sessions and focus time
- Daily session tracking with automatic reset
- Data persists across browser sessions

**Note**: Data is device and browser-specific. Clearing browser cache will remove all saved data.

## Future Enhancement Ideas

- Dark mode toggle
- Custom session durations
- Weekly statistics chart
- Export statistics as CSV
- Sound selection for notifications
- Goal-setting and milestone tracking
- Multi-device sync (with backend)

## Presentation Guidelines

This project demonstrates:

1. **Core Frontend Skills**: HTML structure, CSS styling, JavaScript logic
2. **User Experience**: Intuitive interface, clear feedback, responsive design
3. **Data Management**: Client-side persistence with localStorage
4. **Code Organization**: Clean architecture with separated concerns
5. **Modern Web APIs**: Notifications, Audio, LocalStorage

## Credits

Project created as the final project for Introduction to Web Development course.

---

**Version**: 1.0  
**Last Updated**: January 2024  
**Built with**: HTML5, CSS3, Vanilla JavaScript
