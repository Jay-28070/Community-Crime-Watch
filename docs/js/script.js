'use strict';

// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// -----------------------------
// LOADING ANIMATION HELPERS
// -----------------------------
function showLoader() {
    const loader = document.getElementById('auth-loader');
    if (loader) loader.classList.add('active');
}

function hideLoader() {
    const loader = document.getElementById('auth-loader');
    if (loader) loader.classList.remove('active');
}

// -----------------------------
// GOOGLE LOGIN BUTTON (works on signup & login pages)
// -----------------------------
const googleBtn = document.getElementById("google-login");
if (googleBtn) {
    googleBtn.addEventListener("click", async () => {
        showLoader();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (!userDoc.exists()) {
                // New Google user - default to regular user role
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    role: 'user',
                    badgeNumber: null,
                    createdAt: new Date().toISOString()
                });
                window.location.href = "dashboard.html";
            } else {
                // Existing user - redirect based on role
                const userData = userDoc.data();
                if (userData.role === 'police') {
                    window.location.href = "dashboardPolice.html";
                } else {
                    window.location.href = "dashboard.html";
                }
            }
        } catch (error) {
            hideLoader();
            alert(error.message);
        }
    });
}

// -----------------------------
// EMAIL/PASSWORD SIGNUP
// -----------------------------
const signupForm = document.getElementById("signup-form");
if (signupForm) {
    // Show/hide badge number field based on role
    const roleSelect = signupForm.querySelector('#role');
    const badgeGroup = document.getElementById('badge-group');
    const badgeInput = document.getElementById('badge-number');

    if (roleSelect && badgeGroup) {
        roleSelect.addEventListener('change', () => {
            if (roleSelect.value === 'police') {
                badgeGroup.style.display = 'block';
                badgeInput.required = true;
            } else {
                badgeGroup.style.display = 'none';
                badgeInput.required = false;
            }
        });
    }

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fullName = signupForm['full-name'].value;
        const email = signupForm.email.value;
        const password = signupForm.password.value;
        const confirmPassword = signupForm['confirm-password'].value;
        const role = signupForm.role.value;
        const badgeNumber = signupForm['badge-number']?.value || null;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        showLoader();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user data in Firestore
            await setDoc(doc(db, "users", user.uid), {
                fullName: fullName,
                email: email,
                role: role,
                badgeNumber: badgeNumber,
                createdAt: new Date().toISOString()
            });

            // Redirect based on role
            if (role === 'police') {
                window.location.href = "dashboardPolice.html";
            } else {
                window.location.href = "dashboard.html";
            }
        } catch (err) {
            hideLoader();
            alert(err.message);
        }
    });
}

// -----------------------------
// PASSWORD RESET
// -----------------------------
const forgotPasswordLink = document.getElementById("forgot-password-link");
const resetPasswordModal = document.getElementById("reset-password-modal");
const closeResetModal = document.getElementById("close-reset-modal");
const resetPasswordForm = document.getElementById("reset-password-form");
const resetMessage = document.getElementById("reset-message");

if (forgotPasswordLink) {
    // Open modal
    forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        resetPasswordModal.style.display = "flex";
        document.getElementById("reset-email").value = "";
        resetMessage.style.display = "none";
    });
}

if (closeResetModal) {
    // Close modal
    closeResetModal.addEventListener("click", () => {
        resetPasswordModal.style.display = "none";
    });
    
    // Close on outside click
    resetPasswordModal.addEventListener("click", (e) => {
        if (e.target === resetPasswordModal) {
            resetPasswordModal.style.display = "none";
        }
    });
}

if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("reset-email").value;
        
        showLoader();
        resetMessage.style.display = "none";
        
        try {
            const { sendPasswordResetEmail } = await import("https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js");
            await sendPasswordResetEmail(auth, email);
            hideLoader();
            
            // Show success message
            resetMessage.textContent = "Password reset email sent! Please check your inbox.";
            resetMessage.className = "reset-message success";
            resetMessage.style.display = "block";
            
            // Close modal after 3 seconds
            setTimeout(() => {
                resetPasswordModal.style.display = "none";
            }, 3000);
        } catch (error) {
            hideLoader();
            
            // Show error message
            let errorMsg = "Error sending reset email. Please try again.";
            if (error.code === 'auth/user-not-found') {
                errorMsg = "No account found with this email address.";
            } else if (error.code === 'auth/invalid-email') {
                errorMsg = "Please enter a valid email address.";
            }
            
            resetMessage.textContent = errorMsg;
            resetMessage.className = "reset-message error";
            resetMessage.style.display = "block";
        }
    });
}

// -----------------------------
// EMAIL/PASSWORD LOGIN
// -----------------------------
const loginForm = document.getElementById("login-form");
if (loginForm) {
    // Show/hide badge number field based on role
    const loginRoleSelect = loginForm.querySelector('#role');
    const loginBadgeGroup = document.getElementById('login-badge-group');
    const loginBadgeInput = document.getElementById('login-badge-number');

    if (loginRoleSelect && loginBadgeGroup) {
        loginRoleSelect.addEventListener('change', () => {
            if (loginRoleSelect.value === 'police') {
                loginBadgeGroup.style.display = 'block';
                loginBadgeInput.required = true;
            } else {
                loginBadgeGroup.style.display = 'none';
                loginBadgeInput.required = false;
                loginBadgeInput.value = ''; // Clear value when hidden
            }
        });
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        const selectedRole = loginForm.role.value;
        const enteredBadgeNumber = loginForm.badgeNumber ? loginForm.badgeNumber.value.trim() : '';

        showLoader();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Get user role from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();

                // Verify role matches
                if (userData.role !== selectedRole) {
                    hideLoader();
                    alert(`This account is registered as a ${userData.role}. Please select the correct role.`);
                    await auth.signOut();
                    return;
                }

                // For police, verify badge number
                if (selectedRole === 'police') {
                    // Check if badge number was entered
                    if (!enteredBadgeNumber) {
                        hideLoader();
                        alert('Please enter your badge number.');
                        await auth.signOut();
                        return;
                    }

                    // Check if badge number exists in Firestore
                    if (!userData.badgeNumber) {
                        hideLoader();
                        alert('No badge number found for this account. Please contact support.');
                        await auth.signOut();
                        return;
                    }

                    // Verify badge number matches (convert both to strings and trim)
                    if (userData.badgeNumber.toString().trim() !== enteredBadgeNumber) {
                        hideLoader();
                        alert('Invalid badge number. Please check and try again.');
                        await auth.signOut();
                        return;
                    }
                }

                // Redirect based on role
                if (userData.role === 'police') {
                    window.location.href = "dashboardPolice.html";
                } else {
                    window.location.href = "dashboard.html";
                }
            } else {
                hideLoader();
                alert("User data not found. Please contact support.");
                await auth.signOut();
            }
        } catch (err) {
            hideLoader();
            alert(err.message);
        }
    });
}

//------------------------------
//LOG OUT FUNCTIONALITY
//------------------------------
const logoutBtn = document.getElementById("logout-btn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
        e.preventDefault();

        try {
            await auth.signOut()

            window.location.href = "../index.html";
        } catch (err) {
            alert("Error logging out: " + err.message);
        }
    })
}

// -----------------------------
// DASHBOARD PROTECTION & SHOW USER NAME
// -----------------------------
const userNameSpan = document.getElementById("user-name"); // in dashboard.html

// Typing animation function
function typeWriterEffect(element, text, speed = 100) {
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
        // If on dashboard page, show their name with typing effect
        if (userNameSpan) {
            // Try to get full name from Firestore first
            const userDoc = await getDoc(doc(db, "users", user.uid));
            let userName = user.displayName || user.email.split('@')[0];
            
            if (userDoc.exists() && userDoc.data().fullName) {
                userName = userDoc.data().fullName;
            }
            
            typeWriterEffect(userNameSpan, userName, 80);
        }
    } else {
        // If on dashboard page and not logged in, redirect to login
        if (window.location.pathname.includes("dashboard.html")) {
            window.location.href = "login.html";
        }
    }
});

// -----------------------------
// LINK DASHBOARD BUTTONS
// -----------------------------
document.querySelectorAll(".feature-card").forEach(card => {
    const title = card.querySelector("h2").textContent;
    const btn = card.querySelector("button");

    if (title === "Interactive Map") {
        btn.addEventListener("click", () => {
            window.location.href = "map.html"; // redirects to map page
        });
    }

    if (title === "Report Crime") {
        btn.addEventListener("click", () => {
            window.location.href = "report.html"; // placeholder for crime report page
        });
    }

    if (title === "Crime Trends") {
        btn.addEventListener("click", () => {
            window.location.href = "trends.html"; // placeholder for trends page
        });
    }

    if (title === "Safety Alerts") {
        btn.addEventListener("click", () => {
            window.location.href = "alerts.html"; // placeholder for alerts page
        });
    }
});





