// map-script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

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

// Protect map page (redirect if not logged in)
onAuthStateChanged(auth, user => {
    if (!user) window.location.href = "login.html";
});

// LOGOUT button
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", async e => {
        e.preventDefault();
        await auth.signOut();
        window.location.href = "index.html";
    });
}

// -----------------------------
// LEAFLET MAP
// -----------------------------
const map = L.map('map').setView([0, 0], 2); // default world view

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Sample crime hotspots
const crimeData = [
    { lat: -26.2041, lng: 28.0473, type: "Theft", description: "Pickpocket incident" },
    { lat: -26.2050, lng: 28.0490, type: "Vandalism", description: "Broken window" },
    { lat: -26.2065, lng: 28.0465, type: "Assault", description: "Street fight" }
];

// Add markers for each crime
crimeData.forEach(crime => {
    L.marker([crime.lat, crime.lng])
        .addTo(map)
        .bindPopup(`<b>${crime.type}</b><br>${crime.description}`);
});

// Zoom map to fit all markers
const group = new L.featureGroup(crimeData.map(c => L.marker([c.lat, c.lng])));
map.fitBounds(group.getBounds());
    