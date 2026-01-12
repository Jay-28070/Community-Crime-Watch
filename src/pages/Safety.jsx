import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import './PageStyles.css'
import './Safety.css'

function Safety() {
    const { currentUser, loading } = useAuth()
    const navigate = useNavigate()

    const [searchQuery, setSearchQuery] = useState('')
    const [safetyResult, setSafetyResult] = useState(null)
    const [isChecking, setIsChecking] = useState(false)
    const [currentLocationAlert, setCurrentLocationAlert] = useState(null)

    useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/login')
        }
    }, [currentUser, loading, navigate])

    useEffect(() => {
        if (currentUser) {
            checkCurrentLocation()
        }
    }, [currentUser])

    const checkCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords
                    const result = await analyzeSafety(latitude, longitude, 'Your Current Location')
                    setCurrentLocationAlert(result)
                },
                () => console.log('Location access denied')
            )
        }
    }


    const analyzeSafety = async (lat, lng, locationName) => {
        try {
            const querySnapshot = await getDocs(collection(db, 'crimeReports'))
            let nearbyCount = 0
            const crimeBreakdown = {}

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                if (data.latitude && data.longitude) {
                    const distance = getDistance(lat, lng, data.latitude, data.longitude)
                    if (distance < 2) { // Within 2km
                        nearbyCount++
                        crimeBreakdown[data.crimeType] = (crimeBreakdown[data.crimeType] || 0) + 1
                    }
                }
            })

            let riskLevel, riskColor, message
            if (nearbyCount === 0) {
                riskLevel = 'Safe'
                riskColor = 'safe'
                message = 'No recent crime reports in this area'
            } else if (nearbyCount < 5) {
                riskLevel = 'Low Risk'
                riskColor = 'safe'
                message = `${nearbyCount} incident(s) reported nearby`
            } else if (nearbyCount < 15) {
                riskLevel = 'Moderate Risk'
                riskColor = 'moderate'
                message = `${nearbyCount} incidents reported - stay alert`
            } else {
                riskLevel = 'High Risk'
                riskColor = 'high'
                message = `${nearbyCount} incidents reported - exercise caution`
            }

            return {
                locationName,
                riskLevel,
                riskColor,
                message,
                incidentCount: nearbyCount,
                breakdown: crimeBreakdown
            }
        } catch (error) {
            console.error('Error analyzing safety:', error)
            return null
        }
    }

    const getDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371 // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180
        const dLon = (lon2 - lon1) * Math.PI / 180
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }

    const handleSearch = async () => {
        if (!searchQuery.trim()) return
        setIsChecking(true)

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
            )
            const data = await response.json()

            if (data.length > 0) {
                const { lat, lon, display_name } = data[0]
                const result = await analyzeSafety(parseFloat(lat), parseFloat(lon), display_name)
                setSafetyResult(result)
            } else {
                setSafetyResult({ error: 'Location not found' })
            }
        } catch (error) {
            console.error('Search error:', error)
            setSafetyResult({ error: 'Failed to search location' })
        } finally {
            setIsChecking(false)
        }
    }

    const handleQuickSearch = (location) => {
        setSearchQuery(location)
        setTimeout(() => handleSearch(), 100)
    }

    const useCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    setIsChecking(true)
                    const { latitude, longitude } = position.coords

                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        )
                        const data = await response.json()
                        const locationName = data.display_name || 'Your Location'

                        const result = await analyzeSafety(latitude, longitude, locationName)
                        setSafetyResult(result)
                    } catch (error) {
                        console.error('Geocoding error:', error)
                    } finally {
                        setIsChecking(false)
                    }
                },
                () => alert('Unable to get your location')
            )
        }
    }

    const quickSearchLocations = [
        'Downtown', 'Main Street', 'Park Avenue',
        'University District', 'Shopping Mall', 'Industrial Area'
    ]

    if (loading) {
        return <Loader message="Loading..." />
    }

    if (!currentUser) {
        return null
    }

    return (
        <div className="safety-page">
            <Navbar variant="dashboard" />

            {/* Hero Section */}
            <div className="page-hero-modern">
                <div className="hero-background">
                    <div className="hero-circle hero-circle-1"></div>
                    <div className="hero-circle hero-circle-2"></div>
                </div>
                <div className="page-hero-content">
                    <div className="page-badge">
                        <div className="feature-icon-wrapper green">
                            <img src="/assets/icons/shield-check.svg" alt="Safety" />
                        </div>
                    </div>
                    <h1 className="page-title">Area Safety Checker</h1>
                    <p className="page-subtitle">Check if you're in an unsafe area or search any location for crime statistics</p>
                </div>
            </div>

            <div className="safety-page-container">
                {/* Current Location Alert */}
                {currentLocationAlert && (
                    <div className={`current-location-alert ${currentLocationAlert.riskColor}`}>
                        <div className="alert-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </div>
                        <div className="alert-content">
                            <h3>{currentLocationAlert.riskLevel}</h3>
                            <p>{currentLocationAlert.message}</p>
                        </div>
                    </div>
                )}

                {/* Safety Checker Card */}
                <div className="safety-checker-card">
                    <h2>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        Search Location
                    </h2>
                    <p>Enter any location to check its safety level and view crime statistics</p>

                    <div className="safety-search-wrapper">
                        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            className="safety-search-input"
                            placeholder="Enter location (e.g., Downtown, Main Street)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button type="button" className="current-location-btn" onClick={useCurrentLocation} title="Use my current location">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </button>
                        <button type="button" className="check-safety-btn" onClick={handleSearch} disabled={isChecking}>
                            {isChecking ? 'Checking...' : 'Check Safety'}
                        </button>
                    </div>

                    {/* Safety Result */}
                    {safetyResult && !safetyResult.error && (
                        <div className={`safety-result ${safetyResult.riskColor}`}>
                            <div className="result-header">
                                <h3>{safetyResult.locationName}</h3>
                                <span className={`risk-badge ${safetyResult.riskColor}`}>{safetyResult.riskLevel}</span>
                            </div>
                            <p className="result-message">{safetyResult.message}</p>
                            {Object.keys(safetyResult.breakdown).length > 0 && (
                                <div className="crime-breakdown">
                                    <h4>Crime Breakdown</h4>
                                    <div className="breakdown-list">
                                        {Object.entries(safetyResult.breakdown).map(([type, count]) => (
                                            <div key={type} className="breakdown-item">
                                                <span>{type}</span>
                                                <span>{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {safetyResult?.error && (
                        <div className="safety-result error">
                            <p>{safetyResult.error}</p>
                        </div>
                    )}
                </div>

                {/* Quick Search */}
                <div className="quick-search-section">
                    <h3>Quick Search</h3>
                    <p>Click on a popular location to check its safety</p>
                    <div className="quick-search-buttons">
                        {quickSearchLocations.map(location => (
                            <button
                                key={location}
                                className="quick-search-btn"
                                onClick={() => handleQuickSearch(location)}
                            >
                                {location}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Safety
