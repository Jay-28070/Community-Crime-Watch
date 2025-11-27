// map-script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { showPageLoader, hidePageLoader } from './loader.js';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyC6d_vHUz8lSZgrFi3mxEOSvfQqKrg8-aU",
    authDomain: "communitycrimewatch-5d7fc.firebaseapp.com",
    projectId: "communitycrimewatch-5d7fc",
    storageBucket: "communitycrimewatch-5d7fc.firebasestorage.app",
    messagingSenderId: "560136155706",
    appId: "1:560136155706:web:e70a90e6a227dc40d83b03",
    measurementId: "G-3TYQ09L8W4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Map is accessible to everyone (no login required)
onAuthStateChanged(auth, user => {
    // Map is public - no redirect needed
    // Just update logout button visibility
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        if (user) {
            logoutBtn.style.display = 'flex';
        } else {
            logoutBtn.style.display = 'none';
        }
    }
});

// LOGOUT button
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async e => {
        e.preventDefault();
        await auth.signOut();
        window.location.href = "../index.html";
    });
}

// Home navigation
const homeBtn = document.getElementById("home-btn");
const homeLink = document.getElementById("home-link");

if (homeBtn) {
    homeBtn.addEventListener("click", e => {
        e.preventDefault();
        onAuthStateChanged(auth, async user => {
            if (user) {
                const { getDoc, doc } = await import("https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js");
                const { getFirestore } = await import("https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js");
                const db = getFirestore();
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().role === 'police') {
                    window.location.href = "dashboardPolice.html";
                } else {
                    window.location.href = "dashboard.html";
                }
            } else {
                window.location.href = "../index.html";
            }
        });
    });
}

if (homeLink) {
    homeLink.addEventListener("click", e => {
        e.preventDefault();
        homeBtn?.click();
    });
}

// -----------------------------
// LEAFLET MAP
// -----------------------------

// Show loader while map initializes
showPageLoader('Loading Map...', 'Fetching crime data and initializing map');

const map = L.map('map').setView([0, 0], 2); // default world view

// Add OpenStreetMap tiles
const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Hide loader when tiles are loaded
let tilesLoaded = false;
tileLayer.on('load', () => {
    if (!tilesLoaded) {
        tilesLoaded = true;
        // Small delay to ensure everything is rendered
        setTimeout(() => {
            hidePageLoader();
        }, 500);
    }
});

// Fallback: hide loader after 3 seconds if tiles don't load
setTimeout(() => {
    if (!tilesLoaded) {
        hidePageLoader();
    }
}, 3000);

// Sample crime hotspots
const sampleCrimeData = [
    { lat: -33.8228, lng: 18.4894, type: "Theft", description: "Pickpocket incident", dateTime: "2025-11-20T14:30" },
    { lat: -33.87556, lng: 18.54083, type: "Vandalism", description: "Broken window", dateTime: "2025-11-21T09:15" },
    { lat: -33.9335, lng: 18.4604, type: "Assault", description: "Street fight", dateTime: "2025-11-22T18:45" }
];

/* OLD localStorage CODE (replaced with Firestore below):
// Get user-reported crimes from localStorage
let userReports = JSON.parse(localStorage.getItem("crimeReports") || "[]");

// Filter out resolved cases AND personal incidents (privacy protection)
userReports = userReports.filter(report =>
    report.status !== 'resolved' &&
    report.incidentType !== 'personal' && // Don't show personal incidents on public map
    report.lat && report.lng // Only show reports with valid coordinates
);

// Combine sample data with user reports (only general/community reports)
const allCrimes = [...sampleCrimeData, ...userReports];
*/

// Get user-reported crimes from Firestore
let userReports = [];

async function loadReportsFromFirestore() {
    try {
        const reportsQuery = query(
            collection(db, "crimeReports"),
            where("status", "!=", "resolved") // Exclude resolved cases
        );
        const querySnapshot = await getDocs(reportsQuery);
        
        userReports = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Filter out personal incidents (privacy protection) and reports without coordinates
            if (data.incidentType !== 'personal' && data.lat && data.lng) {
                userReports.push({
                    id: doc.id,
                    ...data
                });
            }
        });
        
        // Combine sample data with user reports
        const allCrimes = [...sampleCrimeData, ...userReports];
        
        // Add markers to map
        addMarkersToMap(allCrimes);
        
    } catch (error) {
        console.error("Error loading reports from Firestore:", error);
        // Fallback to sample data only
        const allCrimes = [...sampleCrimeData];
        addMarkersToMap(allCrimes);
    }
}

// Function to add markers (will be called after data is loaded)
function addMarkersToMap(crimes) {
    crimes.forEach(crime => {
        const marker = L.marker([crime.lat, crime.lng], {
            icon: getMarkerIcon(crime.type)
        }).addTo(map);

        // Format date if available
        let dateStr = "";
        if (crime.dateTime) {
            const date = new Date(crime.dateTime);
            dateStr = `<br><small>📅 ${date.toLocaleString()}</small>`;
        }

        // Build popup content
        let popupContent = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 280px;">
                <h3 style="margin: 0 0 10px 0; color: rgb(57, 136, 255); font-size: 16px;">${crime.type}</h3>
                <p style="margin: 5px 0; font-size: 13px;"><strong>Description:</strong> ${crime.description}</p>
                ${dateStr}
                ${crime.address ? `<br><small style="font-size: 12px;">📍 ${crime.address}</small>` : ""}
                ${crime.reporterName ? `<br><small style="font-size: 12px;">👤 Reported by: ${crime.reporterName}</small>` : ""}
                ${crime.witnesses ? `<br><small style="font-size: 12px;">👥 Witnesses: ${crime.witnesses}</small>` : ""}
            </div>
        `;

        marker.bindPopup(popupContent, {
            maxWidth: 300,
            minWidth: 200
        });
        markers.push(marker);
    });
}

// Load reports when page loads
loadReportsFromFirestore();

// Placeholder for allCrimes (will be populated by loadReportsFromFirestore)
const allCrimes = [];

// Crime severity levels
const crimeSeverity = {
    // Critical - Red
    "Arson": "critical",
    "Robbery": "critical",
    "Assault": "critical",

    // High - Orange
    "Burglary": "high",
    "Vehicle Theft": "high",
    "Drug Activity": "high",

    // Medium - Yellow
    "Theft": "medium",
    "Harassment": "medium",
    "Fraud": "medium",

    // Low - Green
    "Vandalism": "low",
    "Trespassing": "low",
    "Suspicious Activity": "low",
    "Other": "low"
};

// Severity colors
const severityColors = {
    "critical": "red",
    "high": "orange",
    "medium": "yellow",
    "low": "green"
};

// Custom marker icons based on severity
function getMarkerIcon(crimeType) {
    const severity = crimeSeverity[crimeType] || "low";
    const color = severityColors[severity];

    return L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

// Markers array (will be populated by addMarkersToMap function)
const markers = [];

// Check if there's a selected report from alerts page
const selectedReport = sessionStorage.getItem('selectedReport');
if (selectedReport) {
    const report = JSON.parse(selectedReport);

    // Zoom to the selected report
    map.setView([report.lat, report.lng], 16);

    // Find and open the popup for this report
    markers.forEach(marker => {
        const markerLatLng = marker.getLatLng();
        if (Math.abs(markerLatLng.lat - report.lat) < 0.0001 &&
            Math.abs(markerLatLng.lng - report.lng) < 0.0001) {
            marker.openPopup();

            // Add a pulsing effect to highlight the marker
            const icon = marker.getElement();
            if (icon) {
                icon.style.animation = 'pulse 2s ease-in-out 3';
            }
        }
    });

    // Clear the session storage
    sessionStorage.removeItem('selectedReport');
} else if (markers.length > 0) {
    // Zoom map to fit all markers if any exist
    const group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
} else {
    // Default view if no crimes reported
    map.setView([-26.2041, 28.0473], 13);
}

// Add legend
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'legend');
    div.style.backgroundColor = 'white';
    div.style.padding = '15px';
    div.style.borderRadius = '12px';
    div.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    div.innerHTML = '<h4 style="margin: 0 0 10px 0; font-family: \'Segoe UI\', sans-serif; font-size: 15px;">Crime Severity</h4>';

    const severityLabels = {
        'critical': 'Critical',
        'high': 'High',
        'medium': 'Medium',
        'low': 'Low'
    };
    
    const severityDetails = {
        'critical': 'Arson, Robbery, Assault',
        'high': 'Burglary, Vehicle Theft',
        'medium': 'Theft, Harassment',
        'low': 'Vandalism, Other'
    };

    Object.entries(severityLabels).forEach(([severity, label]) => {
        const color = severityColors[severity];
        const details = severityDetails[severity];
        div.innerHTML += `
            <div style="margin: 8px 0; font-size: 13px; font-family: 'Segoe UI', sans-serif; line-height: 1.4;">
                <span style="display: inline-block; width: 14px; height: 14px; background-color: ${color}; border-radius: 50%; margin-right: 8px; border: 2px solid #333; vertical-align: middle;"></span>
                <strong style="vertical-align: middle;">${label}</strong>
                <div style="margin-left: 26px; font-size: 11px; color: #666; margin-top: 2px;">${details}</div>
            </div>
        `;
    });

    return div;
};
legend.addTo(map);


// ============================================
// MAP SEARCH FUNCTIONALITY
// ============================================

// Search button click
document.getElementById('search-btn').addEventListener('click', searchLocation);

// Enter key in search input
document.getElementById('map-search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchLocation();
    }
});

async function searchLocation() {
    const query = document.getElementById('map-search').value.trim();

    if (!query) {
        return;
    }

    try {
        // Using Nominatim (OpenStreetMap) geocoding service
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );

        if (!response.ok) {
            throw new Error('Search failed');
        }

        const results = await response.json();

        if (results.length === 0) {
            showSearchMessage('No results found. Try a different search term.');
            return;
        }

        if (results.length === 1) {
            // If only one result, go directly to it
            goToLocation(results[0]);
        } else {
            // Show multiple results
            displaySearchResults(results);
        }

    } catch (error) {
        console.error('Search error:', error);
        showSearchMessage('Search failed. Please try again.');
    }
}

function displaySearchResults(results) {
    const resultsDiv = document.getElementById('search-results');

    resultsDiv.innerHTML = results.map(result => `
        <div class="search-result-item" onclick="selectSearchResult(${result.lat}, ${result.lon}, '${result.display_name.replace(/'/g, "\\'")}')">
            <div style="font-weight: 600; margin-bottom: 3px;">${result.display_name.split(',')[0]}</div>
            <div style="font-size: 13px; color: #666;">${result.display_name}</div>
        </div>
    `).join('');

    resultsDiv.style.display = 'block';
}

function selectSearchResult(lat, lon, name) {
    goToLocation({ lat, lon, display_name: name });
    document.getElementById('search-results').style.display = 'none';
}

// Make selectSearchResult available globally
window.selectSearchResult = selectSearchResult;

function goToLocation(location) {
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);

    // Fly to location
    map.flyTo([lat, lon], 15, {
        duration: 1.5
    });

    // Add temporary marker
    const marker = L.marker([lat, lon], {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(map);

    marker.bindPopup(`<b style="font-size: 14px;">📍 ${location.display_name}</b>`, {
        maxWidth: 300,
        minWidth: 200
    }).openPopup();

    // Remove marker after 10 seconds
    setTimeout(() => {
        map.removeLayer(marker);
    }, 10000);

    // Clear search input
    document.getElementById('map-search').value = '';
    document.getElementById('search-results').style.display = 'none';
}

function showSearchMessage(message) {
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = `
        <div class="search-result-item" style="color: #666; text-align: center;">
            ${message}
        </div>
    `;
    resultsDiv.style.display = 'block';

    setTimeout(() => {
        resultsDiv.style.display = 'none';
    }, 3000);
}

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    const searchContainer = document.querySelector('.map-search-container');
    if (!searchContainer.contains(e.target)) {
        document.getElementById('search-results').style.display = 'none';
    }
});



