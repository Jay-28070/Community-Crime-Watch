import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import './Map.css'

function Map() {
    const { currentUser, loading } = useAuth()
    const navigate = useNavigate()
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)

    const [searchQuery, setSearchQuery] = useState('')
    const [crimes, setCrimes] = useState([])
    const [isMapLoading, setIsMapLoading] = useState(true)

    useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/login')
        }
    }, [currentUser, loading, navigate])

    // Load Leaflet and initialize map
    useEffect(() => {
        if (!currentUser || mapInstanceRef.current) return

        const loadLeaflet = async () => {
            // Load Leaflet CSS
            if (!document.querySelector('link[href*="leaflet"]')) {
                const link = document.createElement('link')
                link.rel = 'stylesheet'
                link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
                document.head.appendChild(link)
            }

            // Load Leaflet JS
            if (!window.L) {
                const script = document.createElement('script')
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
                script.onload = () => initMap()
                document.head.appendChild(script)
            } else {
                initMap()
            }
        }

        const initMap = () => {
            if (!mapRef.current || mapInstanceRef.current) return

            const L = window.L
            const map = L.map(mapRef.current).setView([-26.2041, 28.0473], 12)

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map)

            mapInstanceRef.current = map
            setIsMapLoading(false)
            loadCrimes(map)
        }

        loadLeaflet()

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [currentUser])


    const loadCrimes = async (map) => {
        try {
            const querySnapshot = await getDocs(collection(db, 'crimeReports'))
            const crimeData = []
            const L = window.L

            const crimeColors = {
                'Theft': '#e74c3c',
                'Burglary': '#9b59b6',
                'Robbery': '#c0392b',
                'Assault': '#e67e22',
                'Vandalism': '#f39c12',
                'Vehicle Theft': '#d35400',
                'Drug Activity': '#8e44ad',
                'Fraud': '#2980b9',
                'Harassment': '#16a085',
                'Trespassing': '#27ae60',
                'Arson': '#c0392b',
                'Suspicious Activity': '#3498db',
                'Other': '#95a5a6'
            }

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                if (data.latitude && data.longitude) {
                    crimeData.push({ id: doc.id, ...data })

                    const color = crimeColors[data.crimeType] || '#95a5a6'
                    const marker = L.circleMarker([data.latitude, data.longitude], {
                        radius: 10,
                        fillColor: color,
                        color: '#fff',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(map)

                    marker.bindPopup(`
                        <div style="min-width: 200px;">
                            <h3 style="margin: 0 0 8px; color: ${color};">${data.crimeType}</h3>
                            <p style="margin: 0 0 8px; color: #666;">${data.description?.slice(0, 100)}...</p>
                            <p style="margin: 0; font-size: 12px; color: #999;">
                                ${data.address || 'Unknown location'}
                            </p>
                        </div>
                    `)
                }
            })

            setCrimes(crimeData)
        } catch (error) {
            console.error('Error loading crimes:', error)
        }
    }

    const handleSearch = async () => {
        if (!searchQuery.trim() || !mapInstanceRef.current) return

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`
            )
            const data = await response.json()

            if (data.length > 0) {
                const { lat, lon } = data[0]
                mapInstanceRef.current.setView([parseFloat(lat), parseFloat(lon)], 14)
            }
        } catch (error) {
            console.error('Search error:', error)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    if (loading) {
        return <Loader message="Loading..." />
    }

    if (!currentUser) {
        return null
    }

    return (
        <div className="map-page">
            <Navbar variant="dashboard" />

            {/* Search Bar */}
            <div className="map-search-container">
                <div className="map-search-wrapper">
                    <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        className="map-search-input"
                        placeholder="Search location (e.g., Johannesburg, Main Street)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button type="button" className="map-search-btn" onClick={handleSearch}>
                        Search
                    </button>
                </div>
            </div>

            {/* Map Container */}
            <div id="map" ref={mapRef} className="map-container">
                {isMapLoading && (
                    <div className="map-loading">
                        <Loader message="Loading map..." />
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="map-legend">
                <h4>Crime Types</h4>
                <div className="legend-items">
                    <div className="legend-item"><span style={{ background: '#e74c3c' }}></span> Theft</div>
                    <div className="legend-item"><span style={{ background: '#9b59b6' }}></span> Burglary</div>
                    <div className="legend-item"><span style={{ background: '#e67e22' }}></span> Assault</div>
                    <div className="legend-item"><span style={{ background: '#f39c12' }}></span> Vandalism</div>
                    <div className="legend-item"><span style={{ background: '#3498db' }}></span> Suspicious</div>
                </div>
            </div>
        </div>
    )
}

export default Map
