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
    else initializePage();
});

// Logout
document.getElementById("logout-btn").addEventListener("click", async e => {
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
        // Check if user is police or regular user
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

function initializePage() {
    loadOverallStats();
    loadCrimeTypesChart();
    loadTimeChart('day');
    loadSafetyTips();
}

// Area Risk Analysis
document.getElementById('analyze-area-btn').addEventListener('click', analyzeArea);
document.getElementById('area-search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') analyzeArea();
});

async function analyzeArea() {
    const searchInput = document.getElementById('area-search').value.trim();
    
    if (!searchInput) {
        return;
    }
    
    // Get all crime reports
    const reports = JSON.parse(localStorage.getItem("crimeReports") || "[]");
    
    // For demo purposes, calculate risk based on proximity to a searched location
    // In production, you'd use actual geocoding and radius search
    const areaReports = reports.filter(report => {
        // Simple filter - in production, use proper geospatial queries
        return report.address && report.address.toLowerCase().includes(searchInput.toLowerCase());
    });
    
    // Calculate risk metrics
    const totalIncidents = areaReports.length;
    const riskLevel = calculateRiskLevel(totalIncidents);
    const crimeBreakdown = getCrimeBreakdown(areaReports);
    const mostCommon = getMostCommonCrime(crimeBreakdown);
    
    // Display results
    document.getElementById('area-name').textContent = searchInput;
    document.getElementById('total-incidents').textContent = totalIncidents;
    document.getElementById('risk-percentage').textContent = riskLevel.percentage + '%';
    document.getElementById('common-crime').textContent = mostCommon || 'N/A';
    
    const riskBadge = document.getElementById('risk-badge');
    riskBadge.textContent = riskLevel.label;
    riskBadge.className = `risk-badge ${riskLevel.class}`;
    
    // Display crime breakdown chart
    displayCrimeBreakdown(crimeBreakdown);
    
    document.getElementById('risk-result').style.display = 'block';
}

function calculateRiskLevel(incidents) {
    let percentage, label, className;
    
    if (incidents === 0) {
        percentage = 0;
        label = 'Safe';
        className = 'safe';
    } else if (incidents <= 2) {
        percentage = 20;
        label = 'Low Risk';
        className = 'low';
    } else if (incidents <= 5) {
        percentage = 40;
        label = 'Moderate Risk';
        className = 'moderate';
    } else if (incidents <= 8) {
        percentage = 60;
        label = 'Elevated Risk';
        className = 'elevated';
    } else if (incidents <= 12) {
        percentage = 80;
        label = 'High Risk';
        className = 'high';
    } else {
        percentage = 95;
        label = 'Critical Risk';
        className = 'critical';
    }
    
    return { percentage, label, class: className };
}

function getCrimeBreakdown(reports) {
    const breakdown = {};
    reports.forEach(report => {
        breakdown[report.type] = (breakdown[report.type] || 0) + 1;
    });
    return breakdown;
}

function getMostCommonCrime(breakdown) {
    let maxCount = 0;
    let mostCommon = null;
    
    for (const [crime, count] of Object.entries(breakdown)) {
        if (count > maxCount) {
            maxCount = count;
            mostCommon = crime;
        }
    }
    
    return mostCommon;
}

function displayCrimeBreakdown(breakdown) {
    const chartDiv = document.getElementById('crime-chart');
    const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
    
    if (total === 0) {
        chartDiv.innerHTML = '<p style="text-align: center; color: #999;">No crime data available for this area</p>';
        return;
    }
    
    const colors = {
        'Theft': '#e74c3c',
        'Burglary': '#c0392b',
        'Robbery': '#c0392b',
        'Assault': '#e67e22',
        'Vandalism': '#f39c12',
        'Vehicle Theft': '#e74c3c',
        'Drug Activity': '#e67e22',
        'Fraud': '#f39c12',
        'Harassment': '#e67e22',
        'Trespassing': '#f39c12',
        'Arson': '#c0392b',
        'Suspicious Activity': '#3498db',
        'Other': '#95a5a6'
    };
    
    chartDiv.innerHTML = Object.entries(breakdown)
        .sort((a, b) => b[1] - a[1])
        .map(([crime, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            return `
                <div class="crime-bar">
                    <div class="crime-bar-label">${crime}</div>
                    <div class="crime-bar-track">
                        <div class="crime-bar-fill" style="width: ${percentage}%; background-color: ${colors[crime] || '#95a5a6'};">
                            ${count} (${percentage}%)
                        </div>
                    </div>
                </div>
            `;
        }).join('');
}

// Overall Statistics
function loadOverallStats() {
    const reports = JSON.parse(localStorage.getItem("crimeReports") || "[]");
    
    // Total reports
    document.getElementById('total-reports').textContent = reports.length;
    
    // High risk areas (areas with more than 5 incidents)
    const areaCount = {};
    reports.forEach(report => {
        const area = report.address || 'Unknown';
        areaCount[area] = (areaCount[area] || 0) + 1;
    });
    const highRiskAreas = Object.values(areaCount).filter(count => count > 5).length;
    document.getElementById('high-risk-count').textContent = highRiskAreas;
    
    // Safe areas (areas with 2 or fewer incidents)
    const safeAreas = Object.values(areaCount).filter(count => count <= 2).length;
    document.getElementById('safe-count').textContent = safeAreas;
    
    // Peak time
    const hourCounts = {};
    reports.forEach(report => {
        const hour = new Date(report.dateTime).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    
    let peakHour = 0;
    let maxCount = 0;
    for (const [hour, count] of Object.entries(hourCounts)) {
        if (count > maxCount) {
            maxCount = count;
            peakHour = parseInt(hour);
        }
    }
    
    const peakTime = peakHour === 0 ? '12 AM' : peakHour < 12 ? `${peakHour} AM` : peakHour === 12 ? '12 PM' : `${peakHour - 12} PM`;
    document.getElementById('peak-time').textContent = reports.length > 0 ? peakTime : 'N/A';
}

// Crime Types Chart
function loadCrimeTypesChart() {
    const reports = JSON.parse(localStorage.getItem("crimeReports") || "[]");
    const breakdown = getCrimeBreakdown(reports);
    
    const chartDiv = document.getElementById('crime-types-chart');
    
    if (reports.length === 0) {
        chartDiv.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No crime data available yet</p>';
        return;
    }
    
    displayCrimeBreakdown(breakdown);
    chartDiv.innerHTML = document.getElementById('crime-chart').innerHTML;
}

// Time Chart
function loadTimeChart(period) {
    const reports = JSON.parse(localStorage.getItem("crimeReports") || "[]");
    const chartDiv = document.getElementById('time-chart');
    
    if (reports.length === 0) {
        chartDiv.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No crime data available yet</p>';
        return;
    }
    
    let data = {};
    let labels = [];
    
    if (period === 'day') {
        // By hour
        for (let i = 0; i < 24; i++) {
            data[i] = 0;
            labels[i] = i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`;
        }
        reports.forEach(report => {
            const hour = new Date(report.dateTime).getHours();
            data[hour]++;
        });
    } else if (period === 'week') {
        // By day of week
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        days.forEach((day, i) => {
            data[i] = 0;
            labels[i] = day;
        });
        reports.forEach(report => {
            const day = new Date(report.dateTime).getDay();
            data[day]++;
        });
    } else {
        // By month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        months.forEach((month, i) => {
            data[i] = 0;
            labels[i] = month;
        });
        reports.forEach(report => {
            const month = new Date(report.dateTime).getMonth();
            data[month]++;
        });
    }
    
    const maxValue = Math.max(...Object.values(data));
    
    chartDiv.innerHTML = Object.entries(data).map(([key, count]) => {
        const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
        return `
            <div class="crime-bar">
                <div class="crime-bar-label">${labels[key]}</div>
                <div class="crime-bar-track">
                    <div class="crime-bar-fill" style="width: ${percentage}%; background-color: rgb(57, 136, 255);">
                        ${count}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Time period selection
document.querySelectorAll('.time-period').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.time-period').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadTimeChart(btn.dataset.period);
    });
});

// Safety Tips
function loadSafetyTips() {
    const reports = JSON.parse(localStorage.getItem("crimeReports") || "[]");
    const breakdown = getCrimeBreakdown(reports);
    const mostCommon = getMostCommonCrime(breakdown);
    
    const tips = [
        {
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(57, 136, 255)" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>`,
            title: 'Stay Alert',
            text: 'Be aware of your surroundings, especially in high-risk areas. Avoid distractions like phones when walking.'
        },
        {
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(57, 136, 255)" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>`,
            title: 'Peak Hours',
            text: 'Most incidents occur during evening hours. Plan your activities accordingly and travel in groups when possible.'
        },
        {
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(57, 136, 255)" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>`,
            title: 'Know Your Area',
            text: 'Familiarize yourself with safe routes and emergency services locations in your neighborhood.'
        },
        {
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(57, 136, 255)" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>`,
            title: 'Emergency Contacts',
            text: 'Keep emergency numbers saved and easily accessible. Report suspicious activities immediately.'
        }
    ];
    
    if (mostCommon) {
        tips.unshift({
            icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(57, 136, 255)" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>`,
            title: `${mostCommon} Alert`,
            text: `${mostCommon} is the most common crime in your area. Take extra precautions to secure your belongings and property.`
        });
    }
    
    const tipsDiv = document.getElementById('safety-tips');
    tipsDiv.innerHTML = tips.map(tip => `
        <div class="tip-card">
            <div class="tip-card-icon">${tip.icon}</div>
            <h3>${tip.title}</h3>
            <p>${tip.text}</p>
        </div>
    `).join('');
}

