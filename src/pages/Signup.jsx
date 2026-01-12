import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import './Auth.css'

function Signup() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('user')
    const [badgeNumber, setBadgeNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { signup, loginWithGoogle } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            await signup(email, password, fullName, role, badgeNumber || null)

            if (role === 'police') {
                navigate('/dashboard-police')
            } else {
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignup = async () => {
        setError('')
        setLoading(true)

        try {
            const { userData } = await loginWithGoogle()

            if (userData.role === 'police') {
                navigate('/dashboard-police')
            } else {
                navigate('/dashboard')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <Loader message="Creating your account..." />
    }

    return (
        <div className="auth-page">
            {/* Navigation */}
            <nav className="auth-nav">
                <div className="main-logo">
                    <img src="/assets/icons/logo.svg" alt="Logo" className="logo-pulse" />
                    <Link to="/" className="logo-text">Community Crime Watch</Link>
                </div>
                <div className="links">
                    <Link className="auth-link" to="/login">
                        Already have an account? <span>Log in</span>
                    </Link>
                </div>
            </nav>

            {/* Auth Container */}
            <div className="auth-container">
                <div className="auth-background">
                    <div className="auth-circle auth-circle-1"></div>
                    <div className="auth-circle auth-circle-2"></div>
                </div>

                <div className="auth-content">
                    {/* Left Side - Branding */}
                    <div className="auth-branding">
                        <div className="branding-icon">
                            <img src="/assets/icons/logo.svg" alt="Logo" />
                        </div>
                        <h2>Join Our Community</h2>
                        <p>Create your account and start making your neighborhood safer. It's free and takes less than a minute.</p>
                        <div className="branding-features">
                            <div className="branding-feature">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Free forever</span>
                            </div>
                            <div className="branding-feature">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>No credit card required</span>
                            </div>
                            <div className="branding-feature">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Setup in 2 minutes</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="auth-form-wrapper">
                        <div className="auth-form-card">
                            <div className="form-header">
                                <h1>Create Account</h1>
                                <p>Get started with your free account</p>
                            </div>

                            {error && <div className="auth-error">{error}</div>}

                            <form onSubmit={handleSubmit} className="auth-form">
                                {/* Role Selection */}
                                <div className="form-group-modern">
                                    <label htmlFor="role">I am a</label>
                                    <select
                                        id="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                    >
                                        <option value="user">Community Member</option>
                                        <option value="police">Police Officer</option>
                                    </select>
                                </div>

                                {/* Badge Number (Police only) */}
                                {role === 'police' && (
                                    <div className="form-group-modern">
                                        <label htmlFor="badge-number">Badge Number</label>
                                        <input
                                            type="text"
                                            id="badge-number"
                                            value={badgeNumber}
                                            onChange={(e) => setBadgeNumber(e.target.value)}
                                            placeholder="Enter your badge number"
                                            required
                                        />
                                    </div>
                                )}

                                {/* Full Name */}
                                <div className="form-group-modern">
                                    <label htmlFor="full-name">Full Name</label>
                                    <input
                                        type="text"
                                        id="full-name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="form-group-modern">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="form-group-modern">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a password"
                                        required
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="form-group-modern">
                                    <label htmlFor="confirm-password">Confirm Password</label>
                                    <input
                                        type="password"
                                        id="confirm-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button type="submit" className="btn-modern btn-primary">
                                    <span>Create Account</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </button>

                                {/* Divider */}
                                <div className="auth-divider">
                                    <span>or continue with</span>
                                </div>

                                {/* Google Button */}
                                <button type="button" className="btn-modern btn-google" onClick={handleGoogleSignup}>
                                    <img src="/assets/icons/icons8-google.svg" alt="Google" />
                                    <span>Google</span>
                                </button>
                            </form>

                            {/* Footer Link */}
                            <div className="form-footer">
                                <p>Already have an account? <Link to="/login">Log in</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
