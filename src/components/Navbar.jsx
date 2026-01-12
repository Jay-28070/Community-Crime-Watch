import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar({ variant = 'landing' }) {
    const { currentUser, userData, logout } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    // Get the home link based on auth state
    const getHomeLink = () => {
        if (currentUser) {
            return userData?.role === 'police' ? '/dashboard-police' : '/dashboard'
        }
        return '/'
    }

    // Landing page navbar (not logged in)
    if (variant === 'landing') {
        return (
            <nav className="landing-nav">
                <div className="main-logo">
                    <img src="/assets/icons/logo.svg" alt="Logo" className="logo-pulse" />
                    <Link to="/" className="logo-text">Community Crime Watch</Link>
                </div>
                <div className="links">
                    <Link className="login-btn" to="/login">Log in</Link>
                    <Link className="signup-button" to="/signup">Sign up</Link>
                </div>
            </nav>
        )
    }

    // Auth page navbar (login/signup pages)
    if (variant === 'auth') {
        return (
            <nav className="auth-nav">
                <div className="main-logo">
                    <img src="/assets/icons/logo.svg" alt="Logo" className="logo-pulse" />
                    <Link to="/" className="logo-text">Community Crime Watch</Link>
                </div>
            </nav>
        )
    }

    // Dashboard navbar (logged in)
    return (
        <nav className="dashboard-nav">
            <div className="main-logo">
                <img src="/assets/icons/logo.svg" alt="Logo" className="logo-pulse" />
                <Link to={getHomeLink()} className="logo-text">Community Crime Watch</Link>
            </div>
            <div className="links">
                <button className="logout-btn-modern" onClick={handleLogout}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Log out</span>
                </button>
            </div>
        </nav>
    )
}

export default Navbar
