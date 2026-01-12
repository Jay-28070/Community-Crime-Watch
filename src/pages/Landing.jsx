import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import './Landing.css'

function Landing() {
    const navigate = useNavigate()
    const { currentUser, userData, loading } = useAuth()

    // Redirect logged-in users to their dashboard
    useEffect(() => {
        if (!loading && currentUser) {
            const dashboardPath = userData?.role === 'police' ? '/dashboard-police' : '/dashboard'
            navigate(dashboardPath, { replace: true })
        }
    }, [currentUser, loading])

    if (loading) {
        return <Loader message="Loading..." />
    }

    if (currentUser) {
        return <Loader message="Redirecting to dashboard..." />
    }

    return (
        <div className="landing-page">
            <Navbar variant="landing" />

            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-background">
                    <div className="hero-circle hero-circle-1"></div>
                    <div className="hero-circle hero-circle-2"></div>
                    <div className="hero-circle hero-circle-3"></div>
                </div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span>AI-Powered Safety Platform</span>
                    </div>
                    <h1 className="hero-title">
                        Keep Your Community
                        <span className="gradient-text">Safe & Connected</span>
                    </h1>
                    <p className="hero-description">
                        Join thousands of community members using AI-powered crime tracking,
                        real-time alerts, and interactive maps to create safer neighborhoods.
                    </p>
                    <div className="hero-buttons">
                        <button className="cta-primary" onClick={() => navigate('/signup')}>
                            <span>Get Started Free</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                        <button className="cta-secondary" onClick={() => navigate('/map')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="3 11 22 2 13 21 11 13 3 11" />
                            </svg>
                            <span>Explore Crime Map</span>
                        </button>
                    </div>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-number">10K+</div>
                            <div className="stat-label">Active Users</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number">50K+</div>
                            <div className="stat-label">Reports Filed</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number">98%</div>
                            <div className="stat-label">Response Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="features-section">
                <div className="section-header">
                    <span className="section-badge">Features</span>
                    <h2 className="section-title">Everything You Need to Stay Safe</h2>
                    <p className="section-description">Powerful tools designed to protect and inform your community</p>
                </div>

                <div className="features-grid">
                    <FeatureCardLanding
                        iconColor="blue"
                        icon="/assets/icons/camera.svg"
                        title="Smart Crime Reporting"
                        description="Submit reports via text, photo, or voice. Our AI automatically categorizes and prioritizes incidents in real-time."
                    />
                    <FeatureCardLanding
                        iconColor="purple"
                        icon="/assets/icons/map-trifold.svg"
                        title="Interactive Crime Map"
                        description="Visualize crime hotspots with color-coded risk levels. Track incidents in real-time and identify dangerous areas."
                    />
                    <FeatureCardLanding
                        iconColor="orange"
                        icon="/assets/icons/trend-up.svg"
                        title="Crime Trend Analysis"
                        description="Discover patterns and predict high-risk times. Make data-driven decisions to enhance community safety."
                    />
                    <FeatureCardLanding
                        iconColor="red"
                        icon="/assets/icons/bell-ringing.svg"
                        title="Real-Time Safety Alerts"
                        description="Get instant notifications when incidents occur nearby. Receive preventive advice and safety recommendations."
                    />
                    <FeatureCardLanding
                        iconColor="green"
                        icon="/assets/icons/shield-check.svg"
                        title="Area Safety Checker"
                        description="Check if you're in an unsafe area or search any location for detailed crime statistics and safety ratings."
                    />
                    <FeatureCardLanding
                        iconColor="emergency"
                        icon={
                            <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        }
                        title="Emergency Contacts"
                        description="Quick access to emergency services and important contact numbers based on your location and country."
                    />
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <div className="cta-background">
                    <div className="cta-circle cta-circle-1"></div>
                    <div className="cta-circle cta-circle-2"></div>
                </div>
                <div className="cta-content">
                    <h2>Make Your Community Safer Today</h2>
                    <p>Join thousands of community members working together to prevent crime and keep neighborhoods safe. It's completely free.</p>
                    <div className="cta-buttons">
                        <button className="cta-btn-primary" onClick={() => navigate('/signup')}>
                            <span>Get Started Free</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                        <button className="cta-btn-secondary" onClick={() => navigate('/login')}>
                            Already have an account? Log in
                        </button>
                    </div>
                    <div className="cta-features">
                        <div className="cta-feature">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>No credit card required</span>
                        </div>
                        <div className="cta-feature">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Free forever</span>
                        </div>
                        <div className="cta-feature">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>Setup in 2 minutes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <img src="/assets/icons/logo.svg" alt="Logo" />
                        <span>Community Crime Watch</span>
                    </div>
                    <p className="footer-tagline">Building safer communities through technology and collaboration.</p>
                    <div className="footer-links">
                        <a href="/login">Login</a>
                        <span>•</span>
                        <a href="/signup">Sign Up</a>
                        <span>•</span>
                        <a href="/map">Crime Map</a>
                    </div>
                    <p className="footer-copyright">© 2025 Community Crime Watch. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

// Simple feature card for landing page
function FeatureCardLanding({ icon, iconColor, title, description }) {
    return (
        <div className="feature-card-modern">
            <div className={`feature-icon-wrapper ${iconColor}`}>
                {typeof icon === 'string' ? (
                    <img src={icon} alt={title} className="feature-icon" />
                ) : (
                    icon
                )}
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="feature-link">
                <span>Learn more</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                </svg>
            </div>
        </div>
    )
}

export default Landing
