import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import './PageStyles.css'
import './Trends.css'

function Trends() {
    const { currentUser, loading } = useAuth()
    const navigate = useNavigate()

    const [crimes, setCrimes] = useState([])
    const [stats, setStats] = useState({
        totalReports: 0,
        highRiskAreas: 0,
        safeAreas: 0,
        peakTime: 'N/A'
    })
    const [crimeTypes, setCrimeTypes] = useState({})
    const [timePeriod, setTimePeriod] = useState('week')
    const [areaSearch, setAreaSearch] = useState('')
    const [areaResult, setAreaResult] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/login')
        }
    }, [currentUser, loading, navigate])

    useEffect(() => {
        if (currentUser) {
            loadCrimeData()
        }
    }, [currentUser])

    const loadCrimeData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'crimeReports'))
            const crimeData = []
            const typeCount = {}
            const hourCount = {}

            querySnapshot.forEach((doc) => {
                const data = { id: doc.id, ...doc.data() }
                crimeData.push(data)

                // Count crime types
                typeCount[data.crimeType] = (typeCount[data.crimeType] || 0) + 1

                // Count by hour
                if (data.dateTime) {
                    const date = data.dateTime.toDate?.() || new Date(data.dateTime)
                    const hour = date.getHours()
                    hourCount[hour] = (hourCount[hour] || 0) + 1
                }
            })

            setCrimes(crimeData)
            setCrimeTypes(typeCount)

            // Find peak hour
            let peakHour = 0
            let maxCount = 0
            Object.entries(hourCount).forEach(([hour, count]) => {
                if (count > maxCount) {
                    maxCount = count
                    peakHour = parseInt(hour)
                }
            })

            const formatHour = (h) => {
                if (h === 0) return '12 AM'
                if (h < 12) return `${h} AM`
                if (h === 12) return '12 PM'
                return `${h - 12} PM`
            }

            // Calculate area risk levels
            const areaRisks = calculateAreaRisks(crimeData)

            setStats({
                totalReports: crimeData.length,
                highRiskAreas: areaRisks.high,
                safeAreas: areaRisks.safe,
                peakTime: maxCount > 0 ? formatHour(peakHour) : 'N/A'
            })
        } catch (error) {
            console.error('Error loading crime data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const calculateAreaRisks = (crimeData) => {
        // Simple area risk calculation based on crime density
        const areas = {}
        crimeData.forEach(crime => {
            if (crime.latitude && crime.longitude) {
                // Round to create area buckets
                const areaKey = `${Math.round(crime.latitude * 10) / 10},${Math.round(crime.longitude * 10) / 10}`
                areas[areaKey] = (areas[areaKey] || 0) + 1
            }
        })

        let high = 0, safe = 0
        Object.values(areas).forEach(count => {
            if (count >= 5) high++
            else if (count <= 2) safe++
        })

        return { high, safe }
    }

    const analyzeArea = async () => {
        if (!areaSearch.trim()) return
        setIsAnalyzing(true)

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(areaSearch)}&format=json&limit=1`
            )
            const data = await response.json()

            if (data.length > 0) {
                const { lat, lon, display_name } = data[0]
                const targetLat = parseFloat(lat)
                const targetLon = parseFloat(lon)

                // Count crimes within 2km radius
                let nearbyCount = 0
                const breakdown = {}

                crimes.forEach(crime => {
                    if (crime.latitude && crime.longitude) {
                        const distance = getDistance(targetLat, targetLon, crime.latitude, crime.longitude)
                        if (distance < 2) {
                            nearbyCount++
                            breakdown[crime.crimeType] = (breakdown[crime.crimeType] || 0) + 1
                        }
                    }
                })

                let riskLevel, riskClass
                if (nearbyCount === 0) {
                    riskLevel = 'Low Risk'
                    riskClass = 'low'
                } else if (nearbyCount < 5) {
                    riskLevel = 'Low Risk'
                    riskClass = 'low'
                } else if (nearbyCount < 15) {
                    riskLevel = 'Moderate Risk'
                    riskClass = 'moderate'
                } else {
                    riskLevel = 'High Risk'
                    riskClass = 'high'
                }

                setAreaResult({
                    name: display_name,
                    riskLevel,
                    riskClass,
                    incidentCount: nearbyCount,
                    breakdown
                })
            } else {
                setAreaResult({ error: 'Location not found' })
            }
        } catch (error) {
            console.error('Area analysis error:', error)
            setAreaResult({ error: 'Failed to analyze area' })
        } finally {
            setIsAnalyzing(false)
        }
    }

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }

    const getFilteredCrimes = () => {
        const now = new Date()
        return crimes.filter(crime => {
            const crimeDate = crime.reportedAt?.toDate?.() || new Date(crime.reportedAt)
            const diffDays = (now - crimeDate) / (1000 * 60 * 60 * 24)

            switch (timePeriod) {
                case 'day': return diffDays < 1
                case 'week': return diffDays < 7
                case 'month': return diffDays < 30
                default: return true
            }
        })
    }

    const getMaxTypeCount = () => {
        return Math.max(...Object.values(crimeTypes), 1)
    }


    if (loading || isLoading) {
        return <Loader message="Loading trends..." />
    }

    if (!currentUser) {
        return null
    }

    const filteredCrimes = getFilteredCrimes()
    const maxCount = getMaxTypeCount()

    return (
        <div className="trends-page">
            <Navbar variant="dashboard" />

            {/* Hero Section */}
            <div className="page-hero-modern">
                <div className="hero-background">
                    <div className="hero-circle hero-circle-1"></div>
                    <div className="hero-circle hero-circle-2"></div>
                </div>
                <div className="page-hero-content">
                    <div className="page-badge">
                        <div className="feature-icon-wrapper purple">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <line x1="18" y1="20" x2="18" y2="10" />
                                <line x1="12" y1="20" x2="12" y2="4" />
                                <line x1="6" y1="20" x2="6" y2="14" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="page-title">Crime Trends</h1>
                    <p className="page-subtitle">Analyze crime patterns and statistics in your area</p>
                </div>
            </div>

            <div className="trends-container">
                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-card-icon" style={{ background: 'rgba(57, 136, 255, 0.1)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgb(57, 136, 255)" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                        </div>
                        <div className="stat-card-content">
                            <div className="stat-card-label">Total Reports</div>
                            <div className="stat-card-value">{stats.totalReports}</div>
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
                            <div className="stat-card-label">High Risk Areas</div>
                            <div className="stat-card-value">{stats.highRiskAreas}</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-card-icon" style={{ background: 'rgba(40, 167, 69, 0.1)' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <div className="stat-card-content">
                            <div className="stat-card-label">Safe Areas</div>
                            <div className="stat-card-value">{stats.safeAreas}</div>
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
                            <div className="stat-card-label">Peak Crime Time</div>
                            <div className="stat-card-value">{stats.peakTime}</div>
                        </div>
                    </div>
                </div>

                {/* Area Risk Search */}
                <div className="risk-search-section">
                    <h2>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        Analyze Area Risk
                    </h2>
                    <div className="area-search-wrapper">
                        <input
                            type="text"
                            className="area-search-input"
                            placeholder="Enter area name (e.g., Downtown, Main Street)"
                            value={areaSearch}
                            onChange={(e) => setAreaSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && analyzeArea()}
                        />
                        <button
                            className="analyze-area-btn"
                            onClick={analyzeArea}
                            disabled={isAnalyzing || !areaSearch.trim()}
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                        </button>
                    </div>

                    {areaResult && !areaResult.error && (
                        <div className="risk-result">
                            <div className="risk-header">
                                <h3>{areaResult.name}</h3>
                                <span className={`risk-badge ${areaResult.riskClass}`}>{areaResult.riskLevel}</span>
                            </div>
                            <div className="risk-details">
                                <div className="risk-stat">
                                    <div className="stat-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                    </div>
                                    <div className="stat-content">
                                        <div className="stat-label">Incidents Nearby</div>
                                        <div className="stat-value">{areaResult.incidentCount}</div>
                                    </div>
                                </div>
                            </div>
                            {Object.keys(areaResult.breakdown).length > 0 && (
                                <div className="crime-breakdown-section">
                                    <h4>Crime Breakdown</h4>
                                    <div className="breakdown-grid">
                                        {Object.entries(areaResult.breakdown).map(([type, count]) => (
                                            <div key={type} className="breakdown-item">
                                                <span className="breakdown-type">{type}</span>
                                                <span className="breakdown-count">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {areaResult?.error && (
                        <div className="risk-result error">
                            <p>{areaResult.error}</p>
                        </div>
                    )}
                </div>

                {/* Crime Type Distribution */}
                <div className="trends-section">
                    <div className="section-header">
                        <h2>Crime Type Distribution</h2>
                        <select
                            className="filter-select"
                            value={timePeriod}
                            onChange={(e) => setTimePeriod(e.target.value)}
                        >
                            <option value="day">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>

                    <div className="crime-type-chart">
                        {Object.entries(crimeTypes).length > 0 ? (
                            Object.entries(crimeTypes)
                                .sort((a, b) => b[1] - a[1])
                                .map(([type, count]) => (
                                    <div key={type} className="chart-bar-row">
                                        <div className="chart-label">{type}</div>
                                        <div className="chart-bar-container">
                                            <div
                                                className="chart-bar"
                                                style={{ width: `${(count / maxCount) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="chart-value">{count}</div>
                                    </div>
                                ))
                        ) : (
                            <div className="empty-state">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="20" x2="18" y2="10" />
                                    <line x1="12" y1="20" x2="12" y2="4" />
                                    <line x1="6" y1="20" x2="6" y2="14" />
                                </svg>
                                <h3>No data available</h3>
                                <p>Crime reports will appear here once submitted</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Trends