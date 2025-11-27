import { auth, db, getUserRole, goToHomeDashboard } from './authUtils.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Protect page
onAuthStateChanged(auth, user => {
    if (!user) window.location.href = "login.html";
});

// Logout
document.getElementById("logout-btn").addEventListener("click", async e => {
    e.preventDefault();
    await auth.signOut();
    window.location.href = "../index.html";
});

// Home navigation
document.getElementById("home-btn").addEventListener("click", async e => {
    e.preventDefault();
    await goToHomeDashboard();
});

document.getElementById("home-link").addEventListener("click", async e => {
    e.preventDefault();
    await goToHomeDashboard();
});

// Fake crime data for different locations
const locationData = {
    "downtown": {
        name: "Downtown",
        safe: false,
        totalCrimes: 47,
        recentCrimes: 12,
        crimeTypes: {
            "Theft": 18,
            "Vandalism": 12,
            "Assault": 8,
            "Burglary": 6,
            "Robbery": 3
        }
    },
    "main street": {
        name: "Main Street",
        safe: true,
        totalCrimes: 8,
        recentCrimes: 2,
        crimeTypes: {
            "Theft": 4,
            "Vandalism": 3,
            "Suspicious Activity": 1
        }
    },
    "park avenue": {
        name: "Park Avenue",
        safe: true,
        totalCrimes: 5,
        recentCrimes: 1,
        crimeTypes: {
            "Theft": 3,
            "Vandalism": 2
        }
    },
    "university district": {
        name: "University District",
        safe: false,
        totalCrimes: 34,
        recentCrimes: 9,
        crimeTypes: {
            "Theft": 15,
            "Assault": 8,
            "Vandalism": 6,
            "Drug Activity": 5
        }
    },
    "shopping mall": {
        name: "Shopping Mall",
        safe: true,
        totalCrimes: 12,
        recentCrimes: 3,
        crimeTypes: {
            "Theft": 8,
            "Vandalism": 3,
            "Fraud": 1
        }
    },
    "industrial area": {
        name: "Industrial Area",
        safe: false,
        totalCrimes: 56,
        recentCrimes: 15,
        crimeTypes: {
            "Burglary": 20,
            "Theft": 15,
            "Vandalism": 12,
            "Assault": 6,
            "Arson": 3
        }
    }
};

// Elements
const safetySearchInput = document.getElementById('safety-search');
const checkSafetyBtn = document.getElementById('check-safety-btn');
const useCurrentLocationBtn = document.getElementById('use-current-location');
const safetyResult = document.getElementById('safety-result');
const currentLocationAlert = document.getElementById('current-location-alert');

// Check current location on page load
checkCurrentLocationSafety();

// Use current location button
useCurrentLocationBtn.addEventListener('click', () => {
    useCurrentLocationBtn.disabled = true;
    useCurrentLocationBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
    
    // Simulate getting current location
    setTimeout(() => {
        const randomLocations = Object.keys(locationData);
        const randomLocation = randomLocations[Math.floor(Math.random() * randomLocations.length)];
        const locationName = locationData[randomLocation].name;
        
        safetySearchInput.value = locationName;
        checkAreaSafety(locationName);
        
        useCurrentLocationBtn.disabled = false;
        useCurrentLocationBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
    }, 1000);
});

// Check safety button
checkSafetyBtn.addEventListener('click', () => {
    const location = safetySearchInput.value.trim();
    if (location) {
        checkAreaSafety(location);
    } else {
        alert('Please enter a location to check.');
    }
});

// Enter key to search
safetySearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkSafetyBtn.click();
    }
});

// Quick search buttons
document.querySelectorAll('.quick-search-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const location = btn.dataset.location;
        safetySearchInput.value = location;
        checkAreaSafety(location);
    });
});

// Check current location safety automatically
function checkCurrentLocationSafety() {
    // Simulate checking current location
    setTimeout(() => {
        const randomLocations = Object.keys(locationData);
        const randomLocation = randomLocations[Math.floor(Math.random() * randomLocations.length)];
        const data = locationData[randomLocation];
        
        if (!data.safe) {
            // Unsafe area
            currentLocationAlert.className = 'current-location-alert unsafe';
            currentLocationAlert.innerHTML = `
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <div class="current-location-alert-content">
                    <h3>⚠️ Warning: You're in an Unsafe Area</h3>
                    <p>${data.recentCrimes} crimes reported in ${data.name} in the last 30 days. Stay alert and avoid isolated areas.</p>
                </div>
            `;
            currentLocationAlert.style.display = 'flex';
        } else if (data.recentCrimes > 0) {
            // Moderately safe
            currentLocationAlert.className = 'current-location-alert safe';
            currentLocationAlert.innerHTML = `
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                </svg>
                <div class="current-location-alert-content">
                    <h3>✓ Your Area is Relatively Safe</h3>
                    <p>${data.recentCrimes} minor incident(s) reported in ${data.name} in the last 30 days. Stay aware of your surroundings.</p>
                </div>
            `;
            currentLocationAlert.style.display = 'flex';
        }
    }, 500);
}

// Check area safety
function checkAreaSafety(location) {
    checkSafetyBtn.disabled = true;
    checkSafetyBtn.textContent = 'Checking...';
    
    // Simulate API call delay
    setTimeout(() => {
        const locationKey = location.toLowerCase();
        let data = locationData[locationKey];
        
        // If location not found, generate random data
        if (!data) {
            const isSafe = Math.random() > 0.5;
            const totalCrimes = isSafe ? Math.floor(Math.random() * 15) + 1 : Math.floor(Math.random() * 40) + 20;
            const recentCrimes = isSafe ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 12) + 5;
            
            data = {
                name: location,
                safe: isSafe,
                totalCrimes: totalCrimes,
                recentCrimes: recentCrimes,
                crimeTypes: isSafe ? {
                    "Theft": Math.floor(totalCrimes * 0.5),
                    "Vandalism": Math.floor(totalCrimes * 0.3),
                    "Suspicious Activity": Math.floor(totalCrimes * 0.2)
                } : {
                    "Theft": Math.floor(totalCrimes * 0.35),
                    "Assault": Math.floor(totalCrimes * 0.25),
                    "Burglary": Math.floor(totalCrimes * 0.2),
                    "Vandalism": Math.floor(totalCrimes * 0.15),
                    "Robbery": Math.floor(totalCrimes * 0.05)
                }
            };
        }
        
        // Determine safety level
        let safetyLevel, safetyClass, safetyIcon;
        if (data.safe) {
            safetyLevel = 'Safe';
            safetyClass = 'safe';
            safetyIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>';
        } else {
            safetyLevel = 'Not Safe';
            safetyClass = 'unsafe';
            safetyIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
        }
        
        // Sort crime types by count
        const sortedCrimes = Object.entries(data.crimeTypes)
            .sort((a, b) => b[1] - a[1]);
        
        // Display results
        safetyResult.innerHTML = `
            <div class="safety-result-header">
                <h3>${data.name}</h3>
                <div class="safety-badge ${safetyClass}">
                    ${safetyIcon}
                    ${safetyLevel}
                </div>
            </div>
            
            <div class="safety-stats">
                <div class="safety-stat">
                    <div class="safety-stat-label">Total Crimes</div>
                    <div class="safety-stat-value">${data.totalCrimes}</div>
                </div>
                <div class="safety-stat">
                    <div class="safety-stat-label">Last 30 Days</div>
                    <div class="safety-stat-value">${data.recentCrimes}</div>
                </div>
                <div class="safety-stat">
                    <div class="safety-stat-label">Crime Types</div>
                    <div class="safety-stat-value">${Object.keys(data.crimeTypes).length}</div>
                </div>
            </div>
            
            <div class="common-crimes">
                <h4>Common Crimes in This Area</h4>
                <div class="crime-list">
                    ${sortedCrimes.map(([type, count]) => `
                        <div class="crime-item">
                            <span class="crime-item-name">${type}</span>
                            <span class="crime-item-count">${count} ${count === 1 ? 'incident' : 'incidents'}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        safetyResult.style.display = 'block';
        
        // Scroll to results
        safetyResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        checkSafetyBtn.disabled = false;
        checkSafetyBtn.textContent = 'Check Safety';
    }, 800);
}



