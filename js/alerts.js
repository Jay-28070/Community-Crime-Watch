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
});

// Logout
document.getElementById("logout-btn").addEventListener("click", async e => {
    e.preventDefault();
    await auth.signOut();
    window.location.href = "index.html";
});

// Get current location
document.getElementById("get-location-btn").addEventListener("click", () => {
    if (navigator.geolocation) {
        document.getElementById("get-location-btn").textContent = "📍 Getting location...";
        navigator.geolocation.getCurrentPosition(
            position => {
                document.getElementById("latitude").value = position.coords.latitude.toFixed(6);
                document.getElementById("longitude").value = position.coords.longitude.toFixed(6);
                document.getElementById("get-location-btn").textContent = "✓ Location Set";
                setTimeout(() => {
                    document.getElementById("get-location-btn").textContent = "📍 Use My Current Location";
                }, 2000);
            },
            error => {
                showError("Unable to get your location. Please enter manually.");
                document.getElementById("get-location-btn").textContent = "📍 Use My Current Location";
            }
        );
    } else {
        showError("Geolocation is not supported by your browser.");
    }
});

// Form submission
document.getElementById("crime-report-form").addEventListener("submit", e => {
    e.preventDefault();
    
    const formData = {
        id: Date.now(),
        type: document.getElementById("crime-type").value,
        description: document.getElementById("description").value,
        dateTime: document.getElementById("date-time").value,
        lat: parseFloat(document.getElementById("latitude").value),
        lng: parseFloat(document.getElementById("longitude").value),
        address: document.getElementById("address").value,
        witnesses: document.getElementById("witnesses").value,
        reporterName: document.getElementById("reporter-name").value || "Anonymous",
        contact: document.getElementById("contact").value,
        reportedAt: new Date().toISOString()
    };

    // Validate coordinates
    if (isNaN(formData.lat) || isNaN(formData.lng)) {
        showError("Please provide valid latitude and longitude.");
        return;
    }

    // Save to localStorage
    let reports = JSON.parse(localStorage.getItem("crimeReports") || "[]");
    reports.push(formData);
    localStorage.setItem("crimeReports", JSON.stringify(reports));

    // Show success message
    document.getElementById("success-message").style.display = "block";
    document.getElementById("submit-btn").disabled = true;

    // Redirect to map after 2 seconds
    setTimeout(() => {
        window.location.href = "map.html";
    }, 2000);
});

function showError(message) {
    const errorDiv = document.getElementById("error-message");
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    setTimeout(() => {
        errorDiv.style.display = "none";
    }, 5000);
}

// Set max date to now
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
document.getElementById("date-time").max = now.toISOString().slice(0, 16);


