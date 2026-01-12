import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import FeatureCard from '../components/FeatureCard'
import Loader from '../components/Loader'
import './Dashboard.css'

function Dashboard() {
    const { currentUser, userData, loading } = useAuth()
    const [displayName, setDisplayName] = useState('')
    const [showEmergencyModal, setShowEmergencyModal] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState('US')

    useEffect(() => {
        if (userData?.fullName) {
            setDisplayName(userData.fullName)
        } else if (currentUser?.displayName) {
            setDisplayName(currentUser.displayName)
        } else if (currentUser?.email) {
            setDisplayName(currentUser.email.split('@')[0])
        }
    }, [userData, currentUser])

    if (loading) {
        return <Loader message="Loading dashboard..." />
    }

    const emergencyContacts = {
        US: [
            { name: 'Emergency Services', number: '911', description: 'Police, Fire, Medical' },
            { name: 'Non-Emergency Police', number: '311', description: 'Non-urgent police matters' },
            { name: 'Poison Control', number: '1-800-222-1222', description: '24/7 poison help' },
        ],
        UK: [
            { name: 'Emergency Services', number: '999', description: 'Police, Fire, Ambulance' },
            { name: 'Non-Emergency Police', number: '101', description: 'Non-urgent police matters' },
            { name: 'NHS Direct', number: '111', description: 'Health advice' },
        ],
        CA: [
            { name: 'Emergency Services', number: '911', description: 'Police, Fire, Medical' },
            { name: 'Poison Control', number: '1-800-268-9017', description: 'Ontario Poison Centre' },
        ],
        AU: [
            { name: 'Emergency Services', number: '000', description: 'Police, Fire, Ambulance' },
            { name: 'Police Assistance', number: '131 444', description: 'Non-urgent police' },
        ],
        ZA: [
            { name: 'Emergency Services', number: '10111', description: 'Police Emergency' },
            { name: 'Ambulance', number: '10177', description: 'Medical Emergency' },
            { name: 'Fire', number: '10177', description: 'Fire Emergency' },
        ],
    }

    return (
        <div className="dashboard-page">
            <Navbar variant="dashboard" />

            {/* Hero Section */}
            <div className="dashboard-hero-modern">
                <div className="hero-background">
                    <div className="hero-circle hero-circle-1"></div>
                    <div className="hero-circle hero-circle-2"></div>
                </div>
                <div className="dashboard-hero-content">
                    <div className="welcome-badge">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>Welcome back</span>
                    </div>
                    <h1 className="dashboard-title">
                        Hello, <span className="gradient-text">{displayName}</span>
                    </h1>
                    <p className="dashboard-subtitle">Your community safety dashboard is ready. Choose an action below to get started.</p>
                </div>
            </div>

            {/* Divider */}
            <div className="dashboard-divider">
                <div className="divider-line"></div>
                <div className="divider-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>
                <div className="divider-line"></div>
            </div>

            {/* Features Section */}
            <div className="dashboard-features-modern">
                <div className="section-header-dashboard">
                    <h2>Quick Actions</h2>
                    <p>Access all features to report and track crimes in your community</p>
                </div>

                <div className="features-grid-dashboard">
                    <FeatureCard
                        icon="/assets/icons/camera.svg"
                        iconColor="blue"
                        title="Report Crime"
                        description="Submit reports via text, photo, or voice. AI categorizes incidents automatically."
                        linkText="Start Report"
                        to="/report"
                    />
                    <FeatureCard
                        icon="/assets/icons/map-trifold.svg"
                        iconColor="purple"
                        title="Interactive Map"
                        description="View reported crimes and hotspots with color-coded risk levels in your area."
                        linkText="View Map"
                        to="/map"
                    />
                    <FeatureCard
                        icon="/assets/icons/bell-ringing.svg"
                        iconColor="red"
                        title="Safety Alerts"
                        description="Receive notifications when incidents occur nearby and get preventive advice."
                        linkText="View Alerts"
                        to="/alerts"
                    />
                    <FeatureCard
                        icon="/assets/icons/shield-check.svg"
                        iconColor="green"
                        title="Area Safety Checker"
                        description="Check if you're in an unsafe area or search any location for crime statistics."
                        linkText="Check Safety"
                        to="/safety"
                    />
                    <FeatureCard
                        icon="/assets/icons/trend-up.svg"
                        iconColor="orange"
                        title="Crime Trends"
                        description="Analyze patterns, identify hotspots, and track crime statistics over time."
                        linkText="View Trends"
                        to="/trends"
                    />
                    <FeatureCard
                        icon={
                            <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        }
                        iconColor="emergency"
                        title="Emergency Contacts"
                        description="Quick access to emergency services and important contact numbers in your area."
                        linkText="View Contacts"
                        onClick={() => setShowEmergencyModal(true)}
                    />
                </div>
            </div>

            {/* Tips Section */}
            <div className="dashboard-tips">
                <div className="tips-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <h3>Safety Tips</h3>
                </div>
                <div className="tips-grid">
                    <div className="tip-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Always report suspicious activity immediately</span>
                    </div>
                    <div className="tip-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Check the crime map before visiting new areas</span>
                    </div>
                    <div className="tip-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Enable notifications to stay informed</span>
                    </div>
                </div>
            </div>

            {/* Emergency Contacts Modal */}
            {showEmergencyModal && (
                <div className="emergency-modal" onClick={() => setShowEmergencyModal(false)}>
                    <div className="emergency-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="emergency-modal-header">
                            <h2>Emergency Contacts</h2>
                            <button className="close-emergency-btn" onClick={() => setShowEmergencyModal(false)}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="country-selector">
                            <label htmlFor="country-select">Select Country:</label>
                            <select
                                id="country-select"
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                            >
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="CA">Canada</option>
                                <option value="AU">Australia</option>
                                <option value="ZA">South Africa</option>
                            </select>
                        </div>

                        <div className="emergency-contacts-list">
                            {emergencyContacts[selectedCountry]?.map((contact, index) => (
                                <div key={index} className="emergency-contact-item">
                                    <div className="contact-info">
                                        <h4>{contact.name}</h4>
                                        <p>{contact.description}</p>
                                    </div>
                                    <a href={`tel:${contact.number}`} className="contact-number">
                                        {contact.number}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard
