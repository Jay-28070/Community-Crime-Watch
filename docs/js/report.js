import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { showPageLoader, hidePageLoader } from './loader.js';
import { analyzeWithHuggingFace } from './ai-helper.js';

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

// Global variables for AI
let currentPhotoData = null;
let recognition = null;
let isRecording = false;

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

// Get current location
document.getElementById("get-location-btn").addEventListener("click", () => {
    if (navigator.geolocation) {
        const btn = document.getElementById("get-location-btn");
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
            Getting location...
        `;
        btn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            async position => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                document.getElementById("latitude").value = lat;
                document.getElementById("longitude").value = lng;

                // Reverse geocode to get address
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                    );
                    const data = await response.json();

                    if (data.display_name) {
                        document.getElementById("address").value = data.display_name;
                    }
                } catch (error) {
                    console.error("Reverse geocoding failed:", error);
                }

                btn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Location Set
                `;

                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                }, 2000);
            },
            error => {
                showError("Unable to get your location. Please enter address manually.");
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }
        );
    } else {
        showError("Geolocation is not supported by your browser.");
    }
});

// Form submission
document.getElementById("crime-report-form").addEventListener("submit", async e => {
    e.preventDefault();

    showPageLoader('Submitting Report...', 'Processing your crime report');

    const incidentType = document.getElementById("incident-type").value;
    const crimeType = document.getElementById("crime-type").value;
    const contact = document.getElementById("contact").value.trim();

    // Validate contact for personal incidents
    if (incidentType === 'personal' && !contact) {
        hidePageLoader();
        showError("Contact information is required for personal incidents so police can follow up with you.");
        return;
    }

    const address = document.getElementById("address").value.trim();
    let lat = parseFloat(document.getElementById("latitude").value);
    let lng = parseFloat(document.getElementById("longitude").value);

    // If no coordinates, geocode the address
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
            );
            const data = await response.json();

            if (data.length > 0) {
                lat = parseFloat(data[0].lat);
                lng = parseFloat(data[0].lon);
            } else {
                hidePageLoader();
                showError("Could not find location. Please check the address.");
                return;
            }
        } catch (error) {
            hidePageLoader();
            showError("Error finding location. Please try again.");
            return;
        }
    }

    // Calculate urgency level
    const urgency = calculateUrgency(crimeType, incidentType);

    // For personal incidents, store location but mark it as private
    // For general incidents, location is public
    const formData = {
        id: Date.now(),
        type: crimeType,
        incidentType: incidentType,
        urgency: urgency,
        description: document.getElementById("description").value,
        dateTime: document.getElementById("date-time").value,
        lat: incidentType === 'personal' ? null : lat, // Hide exact location for personal incidents
        lng: incidentType === 'personal' ? null : lng,
        privateLat: incidentType === 'personal' ? lat : null, // Store privately for police only
        privateLng: incidentType === 'personal' ? lng : null,
        address: incidentType === 'personal' ? 'Location withheld for privacy' : address,
        privateAddress: incidentType === 'personal' ? address : null, // Store privately for police only
        witnesses: document.getElementById("witnesses").value,
        reporterName: document.getElementById("reporter-name").value || "Anonymous",
        contact: contact,
        reportedAt: new Date().toISOString(),
        status: 'pending'
    };

    // Save to localStorage
    let reports = JSON.parse(localStorage.getItem("crimeReports") || "[]");
    reports.push(formData);

    // Sort reports by urgency (critical > high > medium > low)
    const urgencyOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
    reports.sort((a, b) => {
        const urgencyA = urgencyOrder[a.urgency] || 999;
        const urgencyB = urgencyOrder[b.urgency] || 999;
        return urgencyA - urgencyB;
    });

    localStorage.setItem("crimeReports", JSON.stringify(reports));

    hidePageLoader();

    // Show success message with urgency info
    const urgencyText = urgency === 'critical' ? 'CRITICAL - Police will be notified immediately' :
        urgency === 'high' ? 'HIGH PRIORITY - Police will review soon' :
            urgency === 'medium' ? 'MEDIUM PRIORITY' : 'Logged for review';

    const privacyNote = incidentType === 'personal' ?
        '<br><small><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 3px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Your exact location is private and only visible to police</small>' : '';

    document.getElementById("success-message").innerHTML = `
        Crime report submitted successfully!<br>
        <strong>Priority Level: ${urgency.toUpperCase()}</strong><br>
        <small>${urgencyText}</small>${privacyNote}<br>
        ${incidentType === 'personal' ? 'Redirecting to dashboard...' : 'Redirecting to map...'}
    `;
    document.getElementById("success-message").style.display = "block";
    document.getElementById("submit-btn").disabled = true;

    // Redirect based on incident type
    setTimeout(() => {
        if (incidentType === 'personal') {
            window.location.href = "dashboard.html"; // Don't show personal incidents on public map
        } else {
            window.location.href = "map.html";
        }
    }, 3000);
});

function showError(message, type = 'error') {
    if (type === 'success') {
        const successDiv = document.getElementById("success-message");
        successDiv.textContent = message;
        successDiv.style.display = "block";
        setTimeout(() => {
            successDiv.style.display = "none";
        }, 5000);
    } else {
        const errorDiv = document.getElementById("error-message");
        errorDiv.textContent = message;
        errorDiv.style.display = "block";
        setTimeout(() => {
            errorDiv.style.display = "none";
        }, 5000);
    }
}

// Set max date to now
const now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
document.getElementById("date-time").max = now.toISOString().slice(0, 16);

// ============================================
// INCIDENT TYPE HANDLING
// ============================================
document.getElementById('incident-type').addEventListener('change', (e) => {
    const incidentType = e.target.value;
    const contactInput = document.getElementById('contact');
    const contactRequired = document.getElementById('contact-required');
    const contactOptional = document.getElementById('contact-optional');
    const contactHelp = document.getElementById('contact-help');

    if (incidentType === 'personal') {
        // Make contact required for personal incidents
        contactInput.required = true;
        contactRequired.style.display = 'inline';
        contactOptional.style.display = 'none';
        contactHelp.style.display = 'block';
        contactInput.placeholder = 'Phone or email (required for follow-up)';
    } else {
        // Make contact optional for other incidents
        contactInput.required = false;
        contactRequired.style.display = 'none';
        contactOptional.style.display = 'inline';
        contactHelp.style.display = 'none';
        contactInput.placeholder = 'Phone or email for police follow-up';
    }
});

// ============================================
// URGENCY CALCULATION
// ============================================
function calculateUrgency(crimeType, incidentType) {
    // High urgency crimes (critical incidents)
    const highUrgencyCrimes = ['Assault', 'Robbery', 'Arson', 'Drug Activity'];

    // Medium urgency crimes
    const mediumUrgencyCrimes = ['Burglary', 'Vehicle Theft', 'Harassment'];

    // Personal incidents get higher priority
    if (incidentType === 'personal') {
        if (highUrgencyCrimes.includes(crimeType)) {
            return 'critical'; // Highest priority
        } else if (mediumUrgencyCrimes.includes(crimeType)) {
            return 'high';
        } else {
            return 'medium';
        }
    } else {
        // Community reports
        if (highUrgencyCrimes.includes(crimeType)) {
            return 'high';
        } else if (mediumUrgencyCrimes.includes(crimeType)) {
            return 'medium';
        } else {
            return 'low';
        }
    }
}

// ============================================
// AI INPUT METHODS
// ============================================

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;

        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`${tab}-tab`).classList.add('active');
    });
});

// ============================================
// TEXT INPUT AI ANALYSIS
// ============================================
document.getElementById('analyze-text-btn').addEventListener('click', async () => {
    const description = document.getElementById('ai-description').value.trim();

    if (!description) {
        showError("Please enter a description first.");
        return;
    }

    await analyzeWithAI(description, 'text');
});

// ============================================
// VOICE INPUT
// ============================================
document.getElementById('voice-record-btn').addEventListener('click', () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showError("Speech recognition is not supported in your browser.");
        return;
    }

    if (!isRecording) {
        startRecording();
    } else {
        stopRecording();
    }
});

function startRecording() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';

    recognition.onstart = () => {
        isRecording = true;
        const btn = document.getElementById('voice-record-btn');
        btn.classList.add('recording');
        btn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 5px;">
                <rect x="6" y="6" width="12" height="12"/>
            </svg>
            Stop Recording
        `;

        document.getElementById('voice-status').innerHTML = `
            <svg class="status-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
            <span class="status-text">Recording... Speak now</span>
        `;
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        const transcriptDiv = document.getElementById('voice-transcript');
        transcriptDiv.style.display = 'block';
        transcriptDiv.innerHTML = `<strong>Transcript:</strong><br>${finalTranscript}${interimTranscript}`;
    };

    recognition.onerror = (event) => {
        showError(`Speech recognition error: ${event.error}`);
        stopRecording();
    };

    recognition.onend = () => {
        if (finalTranscript.trim()) {
            document.getElementById('analyze-voice-btn').style.display = 'block';
            document.getElementById('analyze-voice-btn').dataset.transcript = finalTranscript.trim();
        }
    };

    recognition.start();
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
        isRecording = false;

        const btn = document.getElementById('voice-record-btn');
        btn.classList.remove('recording');
        btn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 5px;">
                <circle cx="12" cy="12" r="10"/>
            </svg>
            Start Recording
        `;

        document.getElementById('voice-status').innerHTML = `
            <svg class="status-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span class="status-text">Recording complete</span>
        `;
    }
}

document.getElementById('analyze-voice-btn').addEventListener('click', async () => {
    const transcript = document.getElementById('analyze-voice-btn').dataset.transcript;
    if (transcript) {
        await analyzeWithAI(transcript, 'voice');
    }
});

// ============================================
// PHOTO INPUT
// ============================================
document.getElementById('photo-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentPhotoData = event.target.result;

            // Show preview
            document.getElementById('preview-image').src = currentPhotoData;
            document.getElementById('photo-preview').style.display = 'block';
            document.querySelector('.photo-upload-label').style.display = 'none';
            document.getElementById('analyze-photo-btn').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('remove-photo-btn').addEventListener('click', () => {
    currentPhotoData = null;
    document.getElementById('photo-input').value = '';
    document.getElementById('photo-preview').style.display = 'none';
    document.querySelector('.photo-upload-label').style.display = 'block';
    document.getElementById('analyze-photo-btn').style.display = 'none';
});

document.getElementById('analyze-photo-btn').addEventListener('click', async () => {
    if (currentPhotoData) {
        await analyzeWithAI(currentPhotoData, 'photo');
    }
});

// ============================================
// AI ANALYSIS FUNCTION (Using Free Open-Source AI)
// ============================================
async function analyzeWithAI(input, type) {
    const analyzeBtn = document.getElementById(`analyze-${type}-btn`);
    const btnText = analyzeBtn.querySelector('.btn-text');
    const btnLoading = analyzeBtn.querySelector('.btn-loading');

    // Show loading state
    if (btnText) btnText.style.display = 'none';
    if (btnLoading) btnLoading.style.display = 'inline';
    analyzeBtn.disabled = true;

    showPageLoader('Analyzing with AI...', 'Using free open-source AI model');

    try {
        console.log('Starting AI analysis...', { type });

        // Use the free open-source AI helper
        const result = await analyzeWithHuggingFace(input, type);

        console.log('AI Analysis result:', result);

        // Automatically fill the form with AI results
        autoFillFormWithAI(result);

        // Also display results for user review
        displayAIResults(result);

    } catch (error) {
        console.error('AI Analysis Error:', error);

        // Provide helpful error message
        if (error.message.includes('warming up')) {
            showError('AI model is warming up. Please wait 20 seconds and try again.');
        } else {
            showError('AI analysis completed using keyword detection. Please review and adjust if needed.');
        }
    } finally {
        hidePageLoader();
        // Reset button state
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
        analyzeBtn.disabled = false;
    }
}

// Auto-fill form immediately with AI results
function autoFillFormWithAI(result) {
    console.log('Auto-filling form with:', result);

    // Fill incident type if detected
    if (result.incidentType) {
        const incidentTypeSelect = document.getElementById('incident-type');
        if (incidentTypeSelect) {
            incidentTypeSelect.value = result.incidentType;
            // Trigger change event to update contact field requirement
            incidentTypeSelect.dispatchEvent(new Event('change'));
        }
    }

    // Fill crime type
    if (result.crimeType) {
        document.getElementById('crime-type').value = result.crimeType;
    }

    // Fill description
    if (result.description) {
        document.getElementById('description').value = result.description;
    }

    // Fill location if detected
    if (result.location) {
        document.getElementById('address').value = result.location;
    }

    // Fill date/time if detected
    if (result.dateTime) {
        const dateTimeInput = document.getElementById('date-time');
        // If it's just a date, add current time
        if (result.dateTime.length === 10) {
            const now = new Date();
            const timeStr = now.toTimeString().slice(0, 5);
            dateTimeInput.value = `${result.dateTime}T${timeStr}`;
        } else {
            dateTimeInput.value = result.dateTime;
        }
    }

    // Fill witnesses if detected
    if (result.witnesses) {
        document.getElementById('witnesses').value = result.witnesses;
    }

    // Scroll to the form so user can see it's filled
    setTimeout(() => {
        document.getElementById('incident-type').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);

    // Show success message
    showError('<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;"><polyline points="20 6 9 17 4 12"/></svg> Form automatically filled! Please review and complete any remaining fields.', 'success');
}

function displayAIResults(result) {
    // Display in AI results section for user review
    document.getElementById('ai-crime-type').textContent = result.crimeType;

    // Build detailed summary showing what was filled
    let summaryHTML = `<p style="color: #27ae60; font-weight: 600;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
        Form has been automatically filled below!
    </p>`;
    summaryHTML += `<p><strong>Crime Type:</strong> ${result.crimeType}</p>`;
    summaryHTML += `<p><strong>Description:</strong> ${result.description}</p>`;
    if (result.incidentType) {
        const incidentIcon = result.incidentType === 'personal' ?
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' :
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
        const incidentText = result.incidentType === 'personal' ?
            'Personal incident (happened to you)' :
            'General community report';
        summaryHTML += `<p><strong>Type:</strong> ${incidentIcon}${incidentText}</p>`;
    }
    if (result.location) {
        summaryHTML += `<p><strong>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>
            Location:</strong> ${result.location}
        </p>`;
    }
    if (result.dateTime) {
        summaryHTML += `<p><strong>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Time:</strong> ${result.dateTime}
        </p>`;
    }
    if (result.witnesses) {
        summaryHTML += `<p><strong>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Witnesses:</strong> ${result.witnesses}
        </p>`;
    }
    summaryHTML += `<p style="color: #666; font-size: 14px; margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 5px;">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
        </svg>
        Please scroll down to review the filled form and add any missing details (like contact information if this is a personal incident).
    </p>`;

    document.getElementById('ai-summary').innerHTML = summaryHTML;
    document.getElementById('ai-results').style.display = 'block';

    // Store results (keep button functional as backup)
    document.getElementById('use-ai-results-btn').dataset.aiResults = JSON.stringify(result);
    // Hide the button since form is already filled
    document.getElementById('use-ai-results-btn').style.display = 'none';
}

// Use AI results button - Now fills ALL form fields
document.getElementById('use-ai-results-btn').addEventListener('click', () => {
    const result = JSON.parse(document.getElementById('use-ai-results-btn').dataset.aiResults);

    // Fill crime type and description
    document.getElementById('crime-type').value = result.crimeType;
    document.getElementById('description').value = result.description;

    // Fill incident type if detected
    if (result.incidentType) {
        const incidentTypeSelect = document.getElementById('incident-type');
        if (incidentTypeSelect) {
            incidentTypeSelect.value = result.incidentType;
            // Trigger change event to update contact field requirement
            incidentTypeSelect.dispatchEvent(new Event('change'));
        }
    }

    // Fill location if detected
    if (result.location) {
        document.getElementById('address').value = result.location;
    }

    // Fill date/time if detected
    if (result.dateTime) {
        const dateTimeInput = document.getElementById('date-time');
        // If it's just a date, add current time
        if (result.dateTime.length === 10) {
            const now = new Date();
            const timeStr = now.toTimeString().slice(0, 5);
            dateTimeInput.value = `${result.dateTime}T${timeStr}`;
        } else {
            dateTimeInput.value = result.dateTime;
        }
    }

    // Fill witnesses if detected
    if (result.witnesses) {
        document.getElementById('witnesses').value = result.witnesses;
    }

    // Scroll to form
    document.getElementById('incident-type').scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Show success feedback
    showError('AI results applied! Please complete the remaining fields.', 'success');
});



