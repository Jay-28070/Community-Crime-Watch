import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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
const db = getFirestore(app);

// Protect page - police only
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists() || userDoc.data().role !== 'police') {
        window.location.href = "dashboard.html";
        return;
    }

    loadAlerts();
});

// Logout
document.getElementById("logout-btn").addEventListener("click", async (e) => {
    e.preventDefault();
    await auth.signOut();
    window.location.href = "index.html";
});

// Home navigation
const homeBtn = document.getElementById("home-btn");
const homeLink = document.getElementById("home-link");

if (homeBtn) {
    homeBtn.addEventListener("click", e => {
        e.preventDefault();
        window.location.href = "dashboardPolice.html";
    });
}

if (homeLink) {
    homeLink.addEventListener("click", e => {
        e.preventDefault();
        window.location.href = "dashboardPolice.html";
    });
}

const priorityColors = {
    "critical": "#c0392b",
    "high": "#e74c3c",
    "medium": "#e67e22",
    "low": "#f39c12"
};

// Track current incident type filter
let currentIncidentType = 'personal'; // Default to personal incidents

function loadAlerts() {
    let reports = JSON.parse(localStorage.getItem("crimeReports") || "[]");

    // Add status if not present, use urgency field for priority
    reports = reports.map(report => ({
        ...report,
        status: report.status || 'pending',
        priority: report.urgency || report.priority || 'low',
        incidentType: report.incidentType || 'other' // Default to 'other' for old reports
    }));

    // Save updated reports
    localStorage.setItem("crimeReports", JSON.stringify(reports));

    // Update counts
    const personalCount = reports.filter(r => r.incidentType === 'personal').length;
    const generalCount = reports.filter(r => r.incidentType === 'other').length;
    document.getElementById('personal-count').textContent = personalCount;
    document.getElementById('general-count').textContent = generalCount;

    // Filter by current incident type
    reports = reports.filter(r => r.incidentType === currentIncidentType);

    // Sort by priority and date (critical first)
    reports.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b.reportedAt) - new Date(a.reportedAt);
    });

    displayAlerts(reports);
}

// Incident type tab switching
document.querySelectorAll('.incident-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        document.querySelectorAll('.incident-tab').forEach(t => {
            t.classList.remove('active');
            t.style.borderBottomColor = 'transparent';
            t.style.color = '#666';
        });
        tab.classList.add('active');
        tab.style.borderBottomColor = tab.dataset.incidentType === 'personal' ? 'rgb(231, 76, 60)' : 'rgb(52, 152, 219)';
        tab.style.color = tab.dataset.incidentType === 'personal' ? 'rgb(231, 76, 60)' : 'rgb(52, 152, 219)';

        // Update current filter
        currentIncidentType = tab.dataset.incidentType;

        // Reload alerts
        loadAlerts();
    });
});

function displayAlerts(reports) {
    const alertsList = document.getElementById("alerts-list");
    const noAlerts = document.getElementById("no-alerts");

    if (reports.length === 0) {
        alertsList.innerHTML = "";
        noAlerts.style.display = "flex";
        return;
    }

    noAlerts.style.display = "none";
    alertsList.innerHTML = reports.map(report => createPoliceAlertCard(report)).join("");
}

function createPoliceAlertCard(report) {
    const date = new Date(report.dateTime);
    const reportedDate = new Date(report.reportedAt);
    const priorityColor = priorityColors[report.priority];

    const statusBadges = {
        'pending': '<span class="status-badge status-pending">Pending Review</span>',
        'confirmed': '<span class="status-badge status-confirmed">Confirmed</span>',
        'in-progress': '<span class="status-badge status-in-progress">In Progress</span>',
        'resolved': '<span class="status-badge status-resolved">Resolved</span>'
    };

    const incidentTypeText = report.incidentType === 'personal' ?
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> PERSONAL INCIDENT - Victim requires follow-up' :
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Community Report';

    // For personal incidents, use private location data (only visible to police)
    const displayLat = report.incidentType === 'personal' ? (report.privateLat || report.lat) : report.lat;
    const displayLng = report.incidentType === 'personal' ? (report.privateLng || report.lng) : report.lng;
    const displayAddress = report.incidentType === 'personal' ? (report.privateAddress || report.address) : report.address;

    const locationDisplay = displayAddress || (displayLat && displayLng ? `${displayLat.toFixed(4)}, ${displayLng.toFixed(4)}` : 'Not provided');
    const privacyNote = report.incidentType === 'personal' ? '<br><small style="color: #856404;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 3px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Private - Only visible to police</small>' : '';

    return `
        <div class="police-alert-card" data-id="${report.id}" data-status="${report.status}" data-priority="${report.priority}" data-type="${report.type}">
            <div class="police-alert-header">
                <div class="alert-header-left">
                    <div class="priority-indicator" style="background-color: ${priorityColor};">
                        ${report.priority.toUpperCase()}
                    </div>
                    <div class="alert-type" style="background-color: ${priorityColor};">
                        ${report.type}
                    </div>
                    ${statusBadges[report.status]}
                </div>
                <div class="alert-time">
                    Reported: ${reportedDate.toLocaleString()}
                </div>
            </div>
            <div class="police-alert-body">
                <h3>Incident Report #${report.id}</h3>
                ${report.incidentType ? `
                <div class="incident-type-badge" style="background-color: ${report.incidentType === 'personal' ? '#e74c3c' : '#3498db'}; color: white; padding: 8px 12px; border-radius: 6px; margin-bottom: 15px; font-size: 14px; font-weight: 600;">
                    ${incidentTypeText}
                </div>
                ` : ''}
                <div class="alert-details-grid">
                    <div class="detail-item">
                        <strong>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                <line x1="16" y1="2" x2="16" y2="6"/>
                                <line x1="8" y1="2" x2="8" y2="6"/>
                                <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            Occurred:
                        </strong> ${date.toLocaleString()}
                    </div>
                    <div class="detail-item" style="${report.incidentType === 'personal' ? 'background-color: #fff3cd; padding: 8px; border-radius: 4px;' : ''}">
                        <strong>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            Location:
                        </strong> ${locationDisplay}${privacyNote}
                    </div>
                    <div class="detail-item">
                        <strong>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                            Reported by:
                        </strong> ${report.reporterName}
                    </div>
                    ${report.contact ? `
                    <div class="detail-item" style="${report.incidentType === 'personal' ? 'background-color: #fff3cd; padding: 8px; border-radius: 4px;' : ''}">
                        <strong>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            Contact:
                        </strong> <a href="tel:${report.contact}" style="color: #2980b9; text-decoration: none;">${report.contact}</a>
                        ${report.incidentType === 'personal' ? '<br><small style="color: #856404;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 3px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Required for victim follow-up</small>' : ''}
                    </div>
                    ` : ''}
                    ${report.witnesses ? `
                    <div class="detail-item">
                        <strong>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            Witnesses:
                        </strong> ${report.witnesses}
                    </div>
                    ` : ''}
                </div>
                <div class="alert-description">
                    <strong>Description:</strong>
                    <p>${report.description}</p>
                </div>
                <div class="police-actions">
                    ${report.status === 'pending' ? `
                        <button class="action-btn confirm-btn" onclick="updateStatus(${report.id}, 'confirmed')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Confirm
                        </button>
                    ` : ''}
                    ${report.status === 'confirmed' || report.status === 'pending' ? `
                        <button class="action-btn progress-btn" onclick="updateStatus(${report.id}, 'in-progress')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            In Progress
                        </button>
                    ` : ''}
                    ${report.status !== 'resolved' ? `
                        <button class="action-btn resolve-btn" onclick="updateStatus(${report.id}, 'resolved')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            Resolve
                        </button>
                    ` : ''}
                    ${displayLat && displayLng ? `
                    <button class="action-btn map-btn" onclick="viewOnMap(${report.id}, ${displayLat}, ${displayLng})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        View on Map
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// Update status function
window.updateStatus = function (reportId, newStatus) {
    let reports = JSON.parse(localStorage.getItem("crimeReports") || "[]");
    const reportIndex = reports.findIndex(r => r.id === reportId);

    if (reportIndex !== -1) {
        const oldStatus = reports[reportIndex].status;
        reports[reportIndex].status = newStatus;
        reports[reportIndex].lastUpdated = new Date().toISOString();
        localStorage.setItem("crimeReports", JSON.stringify(reports));

        // Create notification for user if status changed to confirmed, in-progress, or resolved
        if (newStatus !== 'pending' && newStatus !== oldStatus) {
            createUserNotification(reportId, newStatus);
        }

        loadAlerts();
    }
};

// Create notification for user
function createUserNotification(reportId, status) {
    let notifications = JSON.parse(localStorage.getItem("userNotifications") || "[]");

    // Check if notification already exists for this status change
    const existingNotification = notifications.find(
        n => n.reportId === reportId && n.status === status
    );

    if (!existingNotification) {
        notifications.push({
            id: Date.now(),
            reportId: reportId,
            status: status,
            timestamp: new Date().toISOString(),
            read: false
        });

        localStorage.setItem("userNotifications", JSON.stringify(notifications));
    }
}

// View on map function
window.viewOnMap = function (reportId, lat, lng) {
    sessionStorage.setItem('selectedReport', JSON.stringify({
        id: reportId,
        lat: lat,
        lng: lng
    }));
    window.location.href = 'map.html';
};

// Filter functionality
document.getElementById("filter-status").addEventListener("change", applyFilters);
document.getElementById("filter-priority").addEventListener("change", applyFilters);
document.getElementById("filter-type").addEventListener("change", applyFilters);

function applyFilters() {
    const statusFilter = document.getElementById("filter-status").value;
    const priorityFilter = document.getElementById("filter-priority").value;
    const typeFilter = document.getElementById("filter-type").value;

    let reports = JSON.parse(localStorage.getItem("crimeReports") || "[]");

    // Add status, priority, and incident type if not present
    reports = reports.map(report => ({
        ...report,
        status: report.status || 'pending',
        priority: report.urgency || report.priority || 'low',
        incidentType: report.incidentType || 'other'
    }));

    // Filter by current incident type tab
    reports = reports.filter(r => r.incidentType === currentIncidentType);

    // Apply other filters
    if (statusFilter !== "all") {
        reports = reports.filter(r => r.status === statusFilter);
    }

    if (priorityFilter !== "all") {
        reports = reports.filter(r => r.priority === priorityFilter);
    }

    if (typeFilter !== "all") {
        reports = reports.filter(r => r.type === typeFilter);
    }

    // Sort by priority and date
    reports.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(b.reportedAt) - new Date(a.reportedAt);
    });

    displayAlerts(reports);
}


// Cases Library for Police
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
    const priorityColor = priorityColors[report.priority] || '#95a5a6';

    return `
        <div class="case-item">
            <div class="case-item-header">
                <span class="case-id">#${report.id}</span>
                <div style="display: flex; gap: 8px; align-items: center;">
                    <span class="priority-indicator" style="background-color: ${priorityColor}; padding: 4px 10px; border-radius: 12px; font-size: 11px; color: white; font-weight: 700;">
                        ${(report.priority || 'low').toUpperCase()}
                    </span>
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
window.deleteCase = function (reportId) {
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

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending Review',
        'confirmed': 'Confirmed',
        'in-progress': 'Being Addressed',
        'resolved': 'Resolved'
    };
    return statusMap[status] || 'Pending Review';
}


