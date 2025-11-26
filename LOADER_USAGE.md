# Universal Loading Screen Usage Guide

## Overview
A reusable loading screen component that can be used across your entire application for any long-running operations.

## Features
- Modern animated spinner with 4 rotating circles
- Customizable title and subtitle text
- Smooth fade-in/out animations
- Progress bar animation
- Prevents page scrolling while active
- Blue gradient background matching your app theme

## How to Use

### 1. Import the loader utility
```javascript
import { showPageLoader, hidePageLoader } from './loader.js';
```

### 2. Basic Usage

#### Show loader
```javascript
showPageLoader('Loading...', 'Please wait');
```

#### Hide loader
```javascript
hidePageLoader();
```

### 3. Common Use Cases

#### During API calls
```javascript
showPageLoader('Fetching Data...', 'Loading crime reports');

try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    // Process data
} catch (error) {
    console.error(error);
} finally {
    hidePageLoader();
}
```

#### During form submission
```javascript
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    showPageLoader('Submitting...', 'Processing your request');
    
    try {
        await submitForm();
        hidePageLoader();
        // Show success message
    } catch (error) {
        hidePageLoader();
        // Show error message
    }
});
```

#### During page initialization
```javascript
// Show loader immediately
showPageLoader('Loading Map...', 'Initializing map and fetching data');

// Initialize your content
await initializeMap();
await loadData();

// Hide when done
hidePageLoader();
```

#### With auto-hide timeout
```javascript
import { showPageLoaderWithTimeout } from './loader.js';

// Will automatically hide after 5 seconds
showPageLoaderWithTimeout('Processing...', 'This may take a moment', 5000);
```

#### Wrap async function
```javascript
import { withLoader } from './loader.js';

// Automatically shows/hides loader around async operation
const result = await withLoader(
    async () => {
        return await fetchData();
    },
    'Loading Data...',
    'Fetching from server'
);
```

## Already Integrated

The loader is already integrated in:

1. **Login/Signup Pages** - Shows during authentication
2. **Map Page** - Shows while map tiles load and during location search
3. **Report Page** - Shows during AI analysis and form submission

## Customization

The loader styling can be customized in `assets/css/styles.css` under the `.page-loader-overlay` section.

### Available CSS classes:
- `.page-loader-overlay` - Main container
- `.page-loader-content` - Content wrapper
- `.loader-spinner` - Spinner container
- `.loader-circle` - Individual spinner rings
- `.loader-title` - Main title text
- `.loader-subtitle` - Subtitle text
- `.loader-progress` - Progress bar container
- `.loader-progress-bar` - Animated progress bar

## Tips

1. Always hide the loader in error handlers to prevent it from staying visible
2. Use descriptive titles and subtitles to inform users what's happening
3. For very quick operations (<500ms), consider not showing the loader
4. The loader automatically prevents page scrolling while active
5. Multiple calls to `showPageLoader()` will update the text without creating multiple loaders
