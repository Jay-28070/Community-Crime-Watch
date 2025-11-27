// Shared authentication utilities
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
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

// Get user role from Firestore
export async function getUserRole(user) {
    if (!user) return null;
    
    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            return userDoc.data().role;
        }
    } catch (error) {
        console.error("Error getting user role:", error);
    }
    
    return null;
}

// Navigate to correct dashboard based on role
export async function goToHomeDashboard() {
    const user = auth.currentUser;
    
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    
    const role = await getUserRole(user);
    
    if (role === 'police') {
        window.location.href = "dashboardPolice.html";
    } else {
        window.location.href = "dashboard.html";
    }
}

export { auth, db };



