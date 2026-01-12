import { createContext, useContext, useState, useEffect } from 'react'
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, googleProvider, db } from '../config/firebase'

const AuthContext = createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    // Sign up with email/password
    async function signup(email, password, fullName, role, badgeNumber = null) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Store user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            fullName,
            email,
            role,
            badgeNumber,
            createdAt: new Date().toISOString()
        })

        return user
    }

    // Login with email/password
    async function login(email, password, selectedRole, badgeNumber = '') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))

        if (userDoc.exists()) {
            const data = userDoc.data()

            // Verify role matches
            if (data.role !== selectedRole) {
                await signOut(auth)
                throw new Error(`This account is registered as a ${data.role}. Please select the correct role.`)
            }

            // For police, verify badge number
            if (selectedRole === 'police') {
                if (!badgeNumber) {
                    await signOut(auth)
                    throw new Error('Please enter your badge number.')
                }
                if (!data.badgeNumber || data.badgeNumber.toString().trim() !== badgeNumber.trim()) {
                    await signOut(auth)
                    throw new Error('Invalid badge number. Please check and try again.')
                }
            }

            setUserData(data)
            return { user, userData: data }
        } else {
            await signOut(auth)
            throw new Error('User data not found. Please contact support.')
        }
    }

    // Google sign in
    async function loginWithGoogle() {
        const result = await signInWithPopup(auth, googleProvider)
        const user = result.user

        // Check if user exists in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))

        if (!userDoc.exists()) {
            // New Google user - default to regular user role
            await setDoc(doc(db, 'users', user.uid), {
                email: user.email,
                fullName: user.displayName || user.email.split('@')[0],
                role: 'user',
                badgeNumber: null,
                createdAt: new Date().toISOString()
            })
            setUserData({ role: 'user' })
            return { user, userData: { role: 'user' }, isNew: true }
        } else {
            const data = userDoc.data()
            setUserData(data)
            return { user, userData: data, isNew: false }
        }
    }

    // Logout
    function logout() {
        setUserData(null)
        return signOut(auth)
    }

    // Reset password
    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email)
    }

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user)

            if (user) {
                // Fetch user data from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid))
                if (userDoc.exists()) {
                    setUserData(userDoc.data())
                }
            } else {
                setUserData(null)
            }

            setLoading(false)
        })

        return unsubscribe
    }, [])

    const value = {
        currentUser,
        userData,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        resetPassword
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
