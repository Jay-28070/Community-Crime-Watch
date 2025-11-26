// Universal Loading Screen Utility
// Usage: import { showPageLoader, hidePageLoader } from './loader.js';

let loaderElement = null;

// Create loader HTML if it doesn't exist
function createLoader() {
    if (loaderElement) return;

    loaderElement = document.createElement('div');
    loaderElement.id = 'page-loader';
    loaderElement.className = 'page-loader-overlay';
    loaderElement.innerHTML = `
        <div class="page-loader-content">
            <div class="loader-spinner">
                <div class="loader-circle"></div>
                <div class="loader-circle"></div>
                <div class="loader-circle"></div>
                <div class="loader-circle"></div>
            </div>
            <div class="loader-title" id="loader-title">Loading...</div>
            <div class="loader-subtitle" id="loader-subtitle">Please wait</div>
            <div class="loader-progress">
                <div class="loader-progress-bar"></div>
            </div>
        </div>
    `;

    document.body.appendChild(loaderElement);
}

// Show the page loader
export function showPageLoader(title = 'Loading...', subtitle = 'Please wait') {
    createLoader();

    // Update text
    const titleEl = document.getElementById('loader-title');
    const subtitleEl = document.getElementById('loader-subtitle');

    if (titleEl) titleEl.textContent = title;
    if (subtitleEl) subtitleEl.textContent = subtitle;

    // Show loader
    loaderElement.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Hide the page loader
export function hidePageLoader() {
    if (!loaderElement) return;

    loaderElement.classList.remove('active');

    // Restore body scroll
    document.body.style.overflow = '';
}

// Show loader with auto-hide after timeout
export function showPageLoaderWithTimeout(title, subtitle, timeout = 5000) {
    showPageLoader(title, subtitle);

    setTimeout(() => {
        hidePageLoader();
    }, timeout);
}

// Show loader during async operation
export async function withLoader(asyncFunction, title = 'Loading...', subtitle = 'Please wait') {
    showPageLoader(title, subtitle);

    try {
        const result = await asyncFunction();
        return result;
    } finally {
        hidePageLoader();
    }
}
