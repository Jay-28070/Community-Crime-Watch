import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC6d_vHUz8lSZgrFi3mxEOSvfQqKrg8-aU",
    authDomain: "communitycrimewatch-5d7fc.firebaseapp.com",
    projectId: "communitycrimewatch-5d7fc",
    storageBucket: "communitycrimewatch-5d7fc.firebasestorage.app",
    messagingSenderId: "560136155706",
    appId: "1:560136155706:web:e70a90e6a227dc40d83b03",
    measurementId: "G-3TYQ09L8W4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Protect page
onAuthStateChanged(auth, user => {
    if (!user) window.location.href = "login.html";
    else loadAlerts();
});

// Logout
document.getElementById("logout-btn").addEventListener("click", async e => {
    e.preventDefault();
    await auth.signOut();
    window.location.href = "../index.html";
});

// Home navigation
const homeBtn = document.getElementById("home-btn");
const homeLink = document.getElementById("home-link");

if (homeBtn) {
    homeBtn.addEventListener("click", e => {
        e.preventDefault();
        window.location.href = "dashboard.html";
    });
}

if (homeLink) {
    homeLink.addEventListener("click", e => {
        e.preventDefault();
        window.location.href = "dashboard.html";
    });
}

// Crime type colors and severity
const crimeData = {
    "Theft": { color: "#e74c3c", severity: "high" },
    "Burglary": { color: "#c0392b", severity: "critical" },
    "Robbery": { color: "#c0392b", severity: "critical" },
    "Assault": { color: "#e67e22", severity: "high" },
    "Vandalism": { color: "#f39c12", severity: "low" },
    "Vehicle Theft": { color: "#e74c3c", severity: "high" },
    "Drug Activity": { color: "#e67e22", severity: "medium" },
    "Fraud": { color: "#f39c12", severity: "medium" },
    "Harassment": { color: "#e67e22", severity: "medium" },
    "Trespassing": { color: "#f39c12", severity: "low" },
    "Arson": { color: "#c0392b", severity: "critical" },
    "Suspicious Activity": { color: "#3498db", severity: "info" },
    "Other": { color: "#95a5a6", severity: "info" }
};

const severityIcons = {
    "critical": `<svg class="alert-severity-icon critical" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
    "high": `<svg class="alert-severity-icon high" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>`,
    "medium": `<svg class="alert-severity-icon medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
    </svg>`,
    "low": `<svg class="alert-severity-icon low" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>`,
    "info": `<svg class="alert-severity-icon info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>`
};

function loadAlerts() {
    let reports = JSON.parse(localStorage.getItem("crimeReports") || "[]");
    
    // Filter out resolved cases from main alerts view
    const now = new Date();
    reports = reports.filter(report => {
        const reportTime = new Date(report.reportedAt);
        const hoursDiff = (now - reportTime) / (1000 * 60 * 60);
        return hoursDiff < 24 && report.status !== 'resolved';
    });
    
    // Sort by most recent first
    reports.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
    
    displayAlerts(reports);
    
    // Update timers every minute
    setInterval(() => {
        updateTimers();
    }, 60000);
}

function displayAlerts(reports) {
    const alertsList = document.getElementById("alerts-list");
    const noAlerts = document.getElementById("no-alerts");
    
    if (reports.length === 0) {
        alertsList.innerHTML = "";
        noAlerts.style.display = "flex";
        return;
    }
    
    noAlerts.style.display = "none";
    alertsList.innerHTML = reports.map(report => createAlertCard(report)).join("");
}

function createAlertCard(report) {
    const date = new Date(report.dateTime);
    const reportedDate = new Date(report.reportedAt);
    const crimeInfo = crimeData[report.type] || { color: "#34495e", severity: "info" };
    const timeRemaining = getTimeRemaining(reportedDate);
    
    return `
        <div class="alert-card severity-${crimeInfo.severity}" data-type="${report.type}" data-time="${report.reportedAt}" data-id="${report.id}">
            <div class="alert-header">
                <div class="alert-header-left">
                    ${severityIcons[crimeInfo.severity]}
                    <div class="alert-type" style="background-color: ${crimeInfo.color};">
                        ${report.type}
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 5px;">
                    <div class="alert-time">
                        ${reportedDate.toLocaleString()}
                    </div>
                    <div class="alert-timer ${timeRemaining.hours < 2 ? 'expiring-soon' : ''}" data-report-time="${report.reportedAt}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span class="timer-text">${timeRemaining.text}</span>
                    </div>
                </div>
            </div>
            <div class="alert-body">
                <h3>${report.type} Incident</h3>
                <p class="alert-description">${report.description}</p>
                <div class="alert-details">
                    <div class="alert-detail">
                        <strong>📅 Occurred:</strong> ${date.toLocaleString()}
                    </div>
                    <div class="alert-detail">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <strong>Location:</strong> ${report.address || 'Location not specified'}
                    </div>
                    ${report.witnesses ? `
                    <div class="alert-detail">
                        <strong>👥 Witnesses:</strong> ${report.witnesses}
                    </div>
                    ` : ''}
                    <div class="alert-detail">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        <strong>Reported by:</strong> ${report.reporterName}
                    </div>
                    <div class="alert-detail">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <strong>Status:</strong> <span class="status-text status-${report.status || 'pending'}">${getStatusText(report.status || 'pending')}</span>
                    </div>
                </div>
                <button class="view-on-map-btn" onclick="viewOnMap(${report.id}, ${report.lat}, ${report.lng})">
                    View on Map
                </button>
            </div>
        </div>
    `;
}

function getTimeRemaining(reportedDate) {
    const now = new Date();
    const expiryTime = new Date(reportedDate.getTime() + 24 * 60 * 60 * 1000);
    const remaining = expiryTime - now;
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    let text = "";
    if (hours > 0) {
        text = `${hours}h ${minutes}m remaining`;
    } else if (minutes > 0) {
        text = `${minutes}m remaining`;
    } else {
        text = "Expiring soon";
    }
    
    return { hours, minutes, text };
}

function updateTimers() {
    document.querySelectorAll('.alert-timer').forEach(timer => {
        const reportTime = new Date(timer.dataset.reportTime);
        const timeRemaining = getTimeRemaining(reportTime);
        
        timer.querySelector('.timer-text').textContent = timeRemaining.text;
        
        if (timeRemaining.hours < 2) {
            timer.classList.add('expiring-soon');
        } else {
            timer.classList.remove('expiring-soon');
        }
        
        // Remove expired alerts
        if (timeRemaining.hours <= 0 && timeRemaining.minutes <= 0) {
            const card = timer.closest('.alert-card');
            card.style.opacity = '0';
            setTimeout(() => {
                card.remove();
                checkIfNoAlerts();
            }, 500);
        }
    });
}

function checkIfNoAlerts() {
    const alertsList = document.getElementById('alerts-list');
    const noAlerts = document.getElementById('no-alerts');
    
    if (alertsList.children.length === 0) {
        noAlerts.style.display = 'flex';
    }
}

// Filter functionality
document.getElementById("filter-type").addEventListener("change", applyFilters);
document.getElementById("filter-time").addEventListener("change", applyFilters);

function applyFilters() {
    const typeFilter = document.getElementById("filter-type").value;
    const timeFilter = document.getElementById("filter-time").value;
    
    let reports = JSON.parse(localStorage.getItem("crimeReports") || "[]");
    
    // Filter by type
    if (typeFilter !== "all") {
        reports = reports.filter(r => r.type === typeFilter);
    }
    
    // Filter by time
    if (timeFilter !== "all") {
        const now = new Date();
        reports = reports.filter(r => {
            const reportDate = new Date(r.reportedAt);
            const diffDays = (now - reportDate) / (1000 * 60 * 60 * 24);
            
            if (timeFilter === "today") return diffDays < 1;
            if (timeFilter === "week") return diffDays < 7;
            if (timeFilter === "month") return diffDays < 30;
            return true;
        });
    }
    
    // Sort by most recent
    reports.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
    
    displayAlerts(reports);
}


// View on Map function
function viewOnMap(reportId, lat, lng) {
    // Store the selected report location in sessionStorage
    sessionStorage.setItem('selectedReport', JSON.stringify({
        id: reportId,
        lat: lat,
        lng: lng
    }));
    
    // Navigate to map
    window.location.href = 'map.html';
}

// Make function available globally
window.viewOnMap = viewOnMap;


function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending Review',
        'confirmed': 'Confirmed',
        'in-progress': 'Being Addressed',
        'resolved': 'Resolved'
    };
    return statusMap[status] || 'Pending Review';
}

// Cases Library
document.getElementById('cases-library-btn').addEventListener('click', () => {
    showCasesLibrary();
});

function showCasesLibrary() {
    const allReports = JSON.parse(localStorage.getItem("crimeReports") || "[]");
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'cases-modal';
    modal.innerHTML = `
        <div class="cases-modal-content">
            <div class="cases-modal-header">
                <h2>Cases Library</h2>
                <button class="close-modal-btn" onclick="this.closest('.cases-modal').remove()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            <div class="cases-tabs">
                <button class="case-tab active" data-status="all">All (${allReports.length})</button>
                <button class="case-tab" data-status="pending">Pending (${allReports.filter(r => r.status === 'pending').length})</button>
                <button class="case-tab" data-status="confirmed">Confirmed (${allReports.filter(r => r.status === 'confirmed').length})</button>
                <button class="case-tab" data-status="in-progress">In Progress (${allReports.filter(r => r.status === 'in-progress').length})</button>
                <button class="case-tab" data-status="resolved">Resolved (${allReports.filter(r => r.status === 'resolved').length})</button>
            </div>
            <div class="cases-list" id="cases-list">
                ${allReports.map(r => createCaseItem(r)).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Tab switching
    modal.querySelectorAll('.case-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            modal.querySelectorAll('.case-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const status = tab.dataset.status;
            const filtered = status === 'all' ? allReports : allReports.filter(r => r.status === status);
            modal.querySelector('#cases-list').innerHTML = filtered.map(r => createCaseItem(r)).join('');
        });
    });
}

function createCaseItem(report) {
    const date = new Date(report.reportedAt);
    const statusClass = report.status || 'pending';
    
    return `
        <div class="case-item">
            <div class="case-item-header">
                <span class="case-id">#${report.id}</span>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <span class="case-status status-${statusClass}">${getStatusText(statusClass)}</span>
                    <button class="delete-case-btn" onclick="deleteCase(${report.id})" title="Delete case">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="case-item-body">
                <div class="case-type">${report.type}</div>
                <div class="case-date">${date.toLocaleString()}</div>
                <div class="case-location">${report.address || 'Location not specified'}</div>
            </div>
        </div>
    `;
}

// Delete case function
window.deleteCase = function(reportId) {
    if (confirm('Are you sure you want to permanently delete this case?')) {
        let reports = JSON.parse(localStorage.getItem("crimeReports") || "[]");
        reports = reports.filter(r => r.id !== reportId);
        localStorage.setItem("crimeReports", JSON.stringify(reports));
        
        // Close and reopen modal to refresh
        document.querySelector('.cases-modal')?.remove();
        showCasesLibrary();
        
        // Reload alerts if on alerts page
        if (typeof loadAlerts === 'function') {
            loadAlerts();
        }
    }
};


// Notification System
function checkForNotifications() {
    const notifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
    const unreadNotifications = notifications.filter(n => !n.read);
    
    if (unreadNotifications.length > 0) {
        displayNotifications(unreadNotifications);
    }
}

function displayNotifications(notifications) {
    const banner = document.getElementById('notifications-banner');
    const list = document.getElementById('notifications-list');
    
    if (!banner || !list) return;
    
    banner.style.display = 'block';
    
    list.innerHTML = notifications.map(notification => {
        const statusIcons = {
            'confirmed': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>`,
            'in-progress': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>`,
            'resolved': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>`
        };
        
        const statusMessages = {
            'confirmed': 'Your report has been confirmed by police',
            'in-progress': 'Police are currently addressing your report',
            'resolved': 'Your report has been resolved'
        };
        
        const timeAgo = getTimeAgo(new Date(notification.timestamp));
        
        return `
            <div class="notification-item">
                <div class="notification-icon ${notification.status}">
                    ${statusIcons[notification.status] || ''}
                </div>
                <div class="notification-content">
                    <div class="notification-title">Case #${notification.reportId} Updated</div>
                    <div class="notification-message">${statusMessages[notification.status]}</div>
                    <div class="notification-time">${timeAgo}</div>
                </div>
            </div>
        `;
    }).join('');
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
}

// Close notifications
document.getElementById('close-notifications-btn')?.addEventListener('click', () => {
    // Mark all notifications as read
    let notifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");
    notifications = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem("userNotifications", JSON.stringify(notifications));
    
    // Hide banner
    document.getElementById('notifications-banner').style.display = 'none';
});

// Check for notifications on page load
checkForNotifications();

// Check for new notifications every 30 seconds
setInterval(checkForNotifications, 30000);



