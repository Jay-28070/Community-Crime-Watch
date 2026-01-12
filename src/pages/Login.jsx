import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import './Auth.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('user')
    const [badgeNumber, setBadgeNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showResetModal, setShowResetModal] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const [resetMessage, setResetMessage] = useState({ type: '', text: '' })

    const { login, loginWithGoogle, resetPassword } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { userData } = await login(email, password, role, badgeNumber)

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

    const handleGoogleLogin = async () => {
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

    const handleResetPassword = async (e) => {
        e.preventDefault()
        setResetMessage({ type: '', text: '' })

        try {
            await resetPassword(resetEmail)
            setResetMessage({ type: 'success', text: 'Password reset email sent! Check your inbox.' })
            setTimeout(() => setShowResetModal(false), 3000)
        } catch (err) {
            let errorMsg = 'Error sending reset email. Please try again.'
            if (err.code === 'auth/user-not-found') {
                errorMsg = 'No account found with this email address.'
            } else if (err.code === 'auth/invalid-email') {
                errorMsg = 'Please enter a valid email address.'
            }
            setResetMessage({ type: 'error', text: errorMsg })
        }
    }

    if (loading) {
        return <Loader message="Logging you in..." />
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
                    <Link className="auth-link" to="/signup">
                        Don't have an account? <span>Sign up</span>
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
                        <h2>Welcome Back!</h2>
                        <p>Log in to access your community safety dashboard and stay connected with your neighborhood.</p>
                        <div className="branding-features">
                            <div className="branding-feature">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Real-time crime alerts</span>
                            </div>
                            <div className="branding-feature">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>AI-powered reporting</span>
                            </div>
                            <div className="branding-feature">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Interactive crime maps</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="auth-form-wrapper">
                        <div className="auth-form-card">
                            <div className="form-header">
                                <h1>Log In</h1>
                                <p>Enter your credentials to continue</p>
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
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <div className="forgot-password-link">
                                        <button type="button" onClick={() => setShowResetModal(true)}>
                                            Forgot your password?
                                        </button>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button type="submit" className="btn-modern btn-primary">
                                    <span>Log In</span>
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
                                <button type="button" className="btn-modern btn-google" onClick={handleGoogleLogin}>
                                    <img src="/assets/icons/icons8-google.svg" alt="Google" />
                                    <span>Google</span>
                                </button>
                            </form>

                            {/* Footer Link */}
                            <div className="form-footer">
                                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Reset Modal */}
            {showResetModal && (
                <div className="auth-modal" onClick={() => setShowResetModal(false)}>
                    <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="auth-modal-header">
                            <h2>Reset Password</h2>
                            <button className="close-modal-btn" onClick={() => setShowResetModal(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <div className="auth-modal-body">
                            <p>Enter your email address and we'll send you a link to reset your password.</p>
                            <form onSubmit={handleResetPassword}>
                                <div className="form-group-modern">
                                    <label htmlFor="reset-email">Email Address</label>
                                    <input
                                        type="email"
                                        id="reset-email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                                {resetMessage.text && (
                                    <div className={`reset-message ${resetMessage.type}`}>
                                        {resetMessage.text}
                                    </div>
                                )}
                                <button type="submit" className="btn-modern btn-primary">
                                    <span>Send Reset Link</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login
