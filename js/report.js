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

// Gemini API configuration
const GEMINI_API_KEY = "AIzaSyC6d_vHUz8lSZgrFi3mxEOSvfQqKrg8-aU"; // Using Firebase API key
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

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
    window.location.href = "index.html";
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
                showError("Could not find location. Please check the address.");
                return;
            }
        } catch (error) {
            showError("Error finding location. Please try again.");
            return;
        }
    }
    
    const formData = {
        id: Date.now(),
        type: document.getElementById("crime-type").value,
        description: document.getElementById("description").value,
        dateTime: document.getElementById("date-time").value,
        lat: lat,
        lng: lng,
        address: address,
        witnesses: document.getElementById("witnesses").value,
        reporterName: document.getElementById("reporter-name").value || "Anonymous",
        contact: document.getElementById("contact").value,
        reportedAt: new Date().toISOString(),
        status: 'pending'
    };

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
// AI ANALYSIS FUNCTION
// ============================================
async function analyzeWithAI(input, type) {
    const analyzeBtn = document.getElementById(`analyze-${type}-btn`);
    const btnText = analyzeBtn.querySelector('.btn-text');
    const btnLoading = analyzeBtn.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    analyzeBtn.disabled = true;
    
    try {
        let prompt = "";
        let requestBody = {};
        
        if (type === 'photo') {
            // Extract base64 data
            const base64Data = input.split(',')[1];
            const mimeType = input.split(';')[0].split(':')[1];
            
            prompt = `Analyze this image and determine if it shows evidence of a crime or suspicious activity. 
            Categorize it into one of these types: Theft, Burglary, Robbery, Assault, Vandalism, Vehicle Theft, Drug Activity, Fraud, Harassment, Trespassing, Arson, Suspicious Activity, or Other.
            Provide a brief description of what you see.
            
            Respond in this exact JSON format:
            {
                "crimeType": "detected crime type",
                "description": "brief description of what is shown in the image"
            }`;
            
            requestBody = {
                contents: [{
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: mimeType,
                                data: base64Data
                            }
                        }
                    ]
                }]
            };
        } else {
            // Text or voice input
            prompt = `Analyze this crime report and categorize it into one of these types: Theft, Burglary, Robbery, Assault, Vandalism, Vehicle Theft, Drug Activity, Fraud, Harassment, Trespassing, Arson, Suspicious Activity, or Other.
            Also provide a clear, concise summary of the incident.
            
            Report: "${input}"
            
            Respond in this exact JSON format:
            {
                "crimeType": "detected crime type",
                "description": "clear summary of the incident"
            }`;
            
            requestBody = {
                contents: [{
                    parts: [{ text: prompt }]
                }]
            };
        }
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error('AI analysis failed');
        }
        
        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        // Parse JSON response
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Invalid AI response format');
        }
        
        const result = JSON.parse(jsonMatch[0]);
        
        // Display results
        displayAIResults(result.crimeType, result.description);
        
    } catch (error) {
        console.error('AI Analysis Error:', error);
        showError('AI analysis failed. Please try again or fill the form manually.');
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        analyzeBtn.disabled = false;
    }
}

function displayAIResults(crimeType, description) {
    document.getElementById('ai-crime-type').textContent = crimeType;
    document.getElementById('ai-summary').textContent = description;
    document.getElementById('ai-results').style.display = 'block';
    
    // Store results for use
    document.getElementById('use-ai-results-btn').dataset.crimeType = crimeType;
    document.getElementById('use-ai-results-btn').dataset.description = description;
}

// Use AI results button
document.getElementById('use-ai-results-btn').addEventListener('click', () => {
    const crimeType = document.getElementById('use-ai-results-btn').dataset.crimeType;
    const description = document.getElementById('use-ai-results-btn').dataset.description;
    
    // Fill form fields
    document.getElementById('crime-type').value = crimeType;
    document.getElementById('description').value = description;
    
    // Scroll to form
    document.getElementById('crime-type').scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Show success feedback
    showError('AI results applied! Please complete the remaining fields.', 'success');
});


