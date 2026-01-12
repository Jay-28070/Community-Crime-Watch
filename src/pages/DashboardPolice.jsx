import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { collection, getDocs, query, orderBy, limit, updateDoc, doc } from 'firebase/firestore'
import { db } from '../config/firebase'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import './Dashboard.css'
import './DashboardPolice.css'

function DashboardPolice() {
    const { currentUser, userData, loading } = useAuth()
    const navigate = useNavigate()

    const [stats, setStats] = useState({
        totalReports: 0,
        pendingReports: 0,
        resolvedReports: 0,
        highPriority: 0
    })
    const [recentReports, setRecentReports] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/login')
        }
    }, [currentUser, loading, navigate])

    useEffect(() => {
        if (currentUser && userData?.role === 'police') {
            loadDashboardData()
        }
    }, [currentUser, userData])

    const loadDashboardData = async () => {
        try {
            const q = query(collection(db, 'crimeReports'), orderBy('reportedAt', 'desc'))
            const querySnapshot = await getDocs(q)

            let total = 0, pending = 0, resolved = 0, highPriority = 0
            const reports = []

            querySnapshot.forEach((doc) => {
                const data = { id: doc.id, ...doc.data() }
                total++

                if (data.status === 'pending') pending++
                else if (data.status === 'resolved') resolved++

                // High priority crimes
                const highPriorityTypes = ['Robbery', 'Assault', 'Arson', 'Burglary']
                if (highPriorityTypes.includes(data.crimeType)) highPriority++

                if (reports.length < 5) {
                    reports.push(data)
                }
            })

            setStats({ totalReports: total, pendingReports: pending, resolvedReports: resolved, highPriority })
            setRecentReports(reports)
        } catch (error) {
            console.error('Error loading dashboard data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const updateReportStatus = async (reportId, newStatus) => {
        try {
            await updateDoc(doc(db, 'crimeReports', reportId), { status: newStatus })
            loadDashboardData() // Refresh data
        } catch (error) {
            console.error('Error updating report:', error)
        }
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

    if (loading || isLoading) {
        return <Loader message="Loading police dashboard..." />
    }

    if (!currentUser) {
        return null
    }

    return (
        <div className="dashboard-page police-dashboard">
            <Navbar variant="dashboard" />

            {/* Hero Section */}
            <div className="dashboard-hero">
                <div className="hero-background">
                    <div className="hero-circle hero-circle-1"></div>
                    <div className="hero-circle hero-circle-2"></div>
                </div>
                <div className="dashboard-hero-content">
                    <div className="welcome-badge police-badge">
                        <img src="/assets/icons/logo-police.svg" alt="Police" />
                    </div>
                    <h1>Police Dashboard</h1>
                    <p>Welcome, Officer {userData?.fullName || 'Officer'}</p>
                    <p className="badge-info">Badge #{userData?.badgeNumber || 'N/A'}</p>
                </div>
            </div>

            <div className="dashboard-container">
                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-icon" style={{ background: 'rgba(57, 136, 255, 0.1)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(57, 136, 255)" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                        </div>
                        <div className="stat-card-content">
                            <div className="stat-card-label">Total Reports</div>
                            <div className="stat-card-value">{stats.totalReports}</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-icon" style={{ background: 'rgba(255, 193, 7, 0.1)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffc107" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div className="stat-card-content">
                            <div className="stat-card-label">Pending</div>
                            <div className="stat-card-value">{stats.pendingReports}</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-icon" style={{ background: 'rgba(40, 167, 69, 0.1)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <div className="stat-card-content">
                            <div className="stat-card-label">Resolved</div>
                            <div className="stat-card-value">{stats.resolvedReports}</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-icon" style={{ background: 'rgba(220, 53, 69, 0.1)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <div className="stat-card-content">
                            <div className="stat-card-label">High Priority</div>
                            <div className="stat-card-value">{stats.highPriority}</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions-section">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions-grid">
                        <Link to="/map" className="quick-action-card">
                            <div className="action-icon blue">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                                    <line x1="8" y1="2" x2="8" y2="18" />
                                    <line x1="16" y1="6" x2="16" y2="22" />
                                </svg>
                            </div>
                            <span>View Crime Map</span>
                        </Link>
                        <Link to="/alerts" className="quick-action-card">
                            <div className="action-icon red">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                            </div>
                            <span>All Alerts</span>
                        </Link>
                        <Link to="/trends" className="quick-action-card">
                            <div className="action-icon purple">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                    <line x1="18" y1="20" x2="18" y2="10" />
                                    <line x1="12" y1="20" x2="12" y2="4" />
                                    <line x1="6" y1="20" x2="6" y2="14" />
                                </svg>
                            </div>
                            <span>Crime Trends</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="recent-reports-section">
                    <div className="section-header">
                        <h2>Recent Reports</h2>
                        <Link to="/alerts" className="view-all-link">View All →</Link>
                    </div>

                    <div className="reports-table">
                        {recentReports.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Location</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentReports.map(report => (
                                        <tr key={report.id}>
                                            <td>
                                                <span className={`crime-type-badge ${report.crimeType?.toLowerCase().replace(' ', '-')}`}>
                                                    {report.crimeType}
                                                </span>
                                            </td>
                                            <td className="location-cell">
                                                {report.address?.slice(0, 30) || 'Unknown'}
                                                {report.address?.length > 30 ? '...' : ''}
                                            </td>
                                            <td>{formatTime(report.reportedAt)}</td>
                                            <td>
                                                <span className={`status-badge ${report.status || 'pending'}`}>
                                                    {report.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="actions-cell">
                                                {report.status !== 'resolved' && (
                                                    <button
                                                        className="action-btn resolve"
                                                        onClick={() => updateReportStatus(report.id, 'resolved')}
                                                        title="Mark as Resolved"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                                {report.status !== 'investigating' && report.status !== 'resolved' && (
                                                    <button
                                                        className="action-btn investigate"
                                                        onClick={() => updateReportStatus(report.id, 'investigating')}
                                                        title="Mark as Investigating"
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="11" cy="11" r="8" />
                                                            <path d="m21 21-4.35-4.35" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-state">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                                <h3>No reports yet</h3>
                                <p>Crime reports will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPolice
