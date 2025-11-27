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

const userNameSpan = document.getElementById("user-name");

function typeWriterEffect(element, text, speed = 80) {
    element.textContent = '';
    element.style.opacity = '1';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        // Check if user is police
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            if (userData.role !== 'police') {
                // Not a police officer, redirect to regular dashboard
                window.location.href = "dashboard.html";
                return;
            }
            
            // Show officer name
            if (userNameSpan) {
                let userName = user.displayName || user.email.split('@')[0];
                
                // Try to get full name from Firestore
                if (userData.fullName) {
                    userName = userData.fullName;
                }
                
                typeWriterEffect(userNameSpan, userName, 80);
            }
        } else {
            window.location.href = "login.html";
        }
    } else {
        window.location.href = "login.html";
    }
});

// Logout
document.getElementById("logout-btn").addEventListener("click", async (e) => {
    e.preventDefault();
    await auth.signOut();
    window.location.href = "../index.html";
});



