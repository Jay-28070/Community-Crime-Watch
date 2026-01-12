import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import './PageStyles.css'
import './Alerts.css'

function Alerts() {
    const { currentUser, loading } = useAuth()
    const navigate = useNavigate()

    const [alerts, setAlerts] = useState([])
    const [filteredAlerts, setFilteredAlerts] = useState([])
    const [filterType, setFilterType] = useState('all')
    const [filterTime, setFilterTime] = useState('all')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/login')
        }
    }, [currentUser, loading, navigate])

    useEffect(() => {
        if (currentUser) {
            loadAlerts()
        }
    }, [currentUser])

    useEffect(() => {
        filterAlerts()
    }, [alerts, filterType, filterTime])

    const loadAlerts = async () => {
        try {
            const q = query(collection(db, 'crimeReports'), orderBy('reportedAt', 'desc'))
            const querySnapshot = await getDocs(q)
            const alertsData = []

            querySnapshot.forEach((doc) => {
                alertsData.push({ id: doc.id, ...doc.data() })
            })

            setAlerts(alertsData)
        } catch (error) {
            console.error('Error loading alerts:', error)
        } finally {
            setIsLoading(false)
        }
    }


    const filterAlerts = () => {
        let filtered = [...alerts]

        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter(alert => alert.crimeType === filterType)
        }

        // Filter by time
        if (filterTime !== 'all') {
            const now = new Date()
            filtered = filtered.filter(alert => {
                const alertDate = alert.reportedAt?.toDate?.() || new Date(alert.reportedAt)
                const diffTime = now - alertDate
                const diffDays = diffTime / (1000 * 60 * 60 * 24)

                switch (filterTime) {
                    case 'today': return diffDays < 1
                    case 'week': return diffDays < 7
                    case 'month': return diffDays < 30
                    default: return true
                }
            })
        }

        setFilteredAlerts(filtered)
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return 'Unknown'
        const date = timestamp.toDate?.() || new Date(timestamp)
        const now = new Date()
        const diff = now - date
        const hours = Math.floor(diff / (1000 * 60 * 60))

        if (hours < 1) return 'Just now'
        if (hours < 24) return `${hours}h ago`
        if (hours < 48) return 'Yesterday'
        return date.toLocaleDateString()
    }

    const crimeTypes = [
        'Theft', 'Burglary', 'Robbery', 'Assault', 'Vandalism',
        'Vehicle Theft', 'Drug Activity', 'Fraud', 'Harassment',
        'Trespassing', 'Arson', 'Suspicious Activity', 'Other'
    ]

    if (loading || isLoading) {
        return <Loader message="Loading alerts..." />
    }

    if (!currentUser) {
        return null
    }

    return (
        <div className="alerts-page">
            <Navbar variant="dashboard" />

            {/* Hero Section */}
            <div className="page-hero-modern">
                <div className="hero-background">
                    <div className="hero-circle hero-circle-1"></div>
                    <div className="hero-circle hero-circle-2"></div>
                </div>
                <div className="page-hero-content">
                    <div className="page-badge">
                        <div className="feature-icon-wrapper red">
                            <img src="/assets/icons/bell-ringing.svg" alt="Alerts" />
                        </div>
                    </div>
                    <h1 className="page-title">Crime Alerts</h1>
                    <p className="page-subtitle">Stay informed about recent incidents in your area</p>
                </div>
            </div>

            <div className="alerts-container">
                {/* Filters */}
                <div className="alerts-filters">
                    <select
                        className="filter-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Crime Types</option>
                        {crimeTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    <select
                        className="filter-select"
                        value={filterTime}
                        onChange={(e) => setFilterTime(e.target.value)}
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>

                {/* Alerts List */}
                <div className="alerts-list">
                    {filteredAlerts.length > 0 ? (
                        filteredAlerts.map(alert => (
                            <div key={alert.id} className="alert-card">
                                <div className="alert-header">
                                    <span className={`alert-type ${alert.crimeType?.toLowerCase().replace(' ', '-')}`}>
                                        {alert.crimeType}
                                    </span>
                                    <span className="alert-time">{formatTime(alert.reportedAt)}</span>
                                </div>
                                <div className="alert-body">
                                    <h3>{alert.crimeType} Reported</h3>
                                    <p className="alert-description">
                                        {alert.description?.slice(0, 200)}
                                        {alert.description?.length > 200 ? '...' : ''}
                                    </p>
                                    <div className="alert-location">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        <span>{alert.address || 'Location not specified'}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            <h3>No alerts found</h3>
                            <p>There are no crime reports matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Alerts
