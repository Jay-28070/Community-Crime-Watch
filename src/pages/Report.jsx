import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import Navbar from '../components/Navbar'
import Loader from '../components/Loader'
import './PageStyles.css'
import './Report.css'

function Report() {
    const { currentUser, loading } = useAuth()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState('text')
    const [aiDescription, setAiDescription] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [aiResults, setAiResults] = useState(null)
    const [isRecording, setIsRecording] = useState(false)
    const [voiceTranscript, setVoiceTranscript] = useState('')

    // Form fields
    const [incidentType, setIncidentType] = useState('')
    const [crimeType, setCrimeType] = useState('')
    const [description, setDescription] = useState('')
    const [dateTime, setDateTime] = useState('')
    const [address, setAddress] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [witnesses, setWitnesses] = useState('')
    const [reporterName, setReporterName] = useState('')
    const [contact, setContact] = useState('')

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/login')
        }
    }, [currentUser, loading, navigate])

    if (loading) {
        return <Loader message="Loading..." />
    }

    if (!currentUser) {
        return null
    }

    const crimeTypes = [
        'Theft', 'Burglary', 'Robbery', 'Assault', 'Vandalism',
        'Vehicle Theft', 'Drug Activity', 'Fraud', 'Harassment',
        'Trespassing', 'Arson', 'Suspicious Activity', 'Other'
    ]

    const analyzeWithAI = async (text) => {
        setIsAnalyzing(true)
        // Simulate AI analysis (in production, this would call an AI API)
        await new Promise(resolve => setTimeout(resolve, 1500))

        const keywords = {
            'theft': 'Theft',
            'stole': 'Theft',
            'stolen': 'Theft',
            'burglary': 'Burglary',
            'break-in': 'Burglary',
            'broke in': 'Burglary',
            'robbery': 'Robbery',
            'robbed': 'Robbery',
            'assault': 'Assault',
            'attacked': 'Assault',
            'hit': 'Assault',
            'vandalism': 'Vandalism',
            'graffiti': 'Vandalism',
            'damaged': 'Vandalism',
            'car': 'Vehicle Theft',
            'vehicle': 'Vehicle Theft',
            'drugs': 'Drug Activity',
            'suspicious': 'Suspicious Activity'
        }

        const lowerText = text.toLowerCase()
        let detectedType = 'Other'

        for (const [keyword, type] of Object.entries(keywords)) {
            if (lowerText.includes(keyword)) {
                detectedType = type
                break
            }
        }

        setAiResults({
            crimeType: detectedType,
            summary: text.slice(0, 200) + (text.length > 200 ? '...' : '')
        })
        setIsAnalyzing(false)
    }

    const handleAnalyzeText = () => {
        if (aiDescription.trim()) {
            analyzeWithAI(aiDescription)
        }
    }

    const handleAnalyzeVoice = () => {
        if (voiceTranscript.trim()) {
            analyzeWithAI(voiceTranscript)
        }
    }

    const useAIResults = () => {
        if (aiResults) {
            setCrimeType(aiResults.crimeType)
            setDescription(aiResults.summary)
            setAiResults(null)
        }
    }

    const toggleRecording = () => {
        if (!isRecording) {
            // Start recording
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
                const recognition = new SpeechRecognition()
                recognition.continuous = true
                recognition.interimResults = true

                recognition.onresult = (event) => {
                    let transcript = ''
                    for (let i = 0; i < event.results.length; i++) {
                        transcript += event.results[i][0].transcript
                    }
                    setVoiceTranscript(transcript)
                }

                recognition.start()
                setIsRecording(true)
                window.currentRecognition = recognition
            } else {
                setErrorMessage('Speech recognition not supported in this browser')
            }
        } else {
            // Stop recording
            if (window.currentRecognition) {
                window.currentRecognition.stop()
            }
            setIsRecording(false)
        }
    }

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    setLatitude(position.coords.latitude.toString())
                    setLongitude(position.coords.longitude.toString())

                    // Reverse geocode
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
                        )
                        const data = await response.json()
                        if (data.display_name) {
                            setAddress(data.display_name)
                        }
                    } catch (error) {
                        console.error('Geocoding error:', error)
                    }
                },
                (error) => {
                    setErrorMessage('Unable to get your location')
                }
            )
        } else {
            setErrorMessage('Geolocation not supported')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrorMessage('')
        setSuccessMessage('')

        try {
            const reportData = {
                incidentType,
                crimeType,
                description,
                dateTime: new Date(dateTime),
                address,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
                witnesses,
                reporterName: reporterName || 'Anonymous',
                contact,
                reportedBy: currentUser.uid,
                reportedAt: serverTimestamp(),
                status: 'pending'
            }

            await addDoc(collection(db, 'crimeReports'), reportData)

            setSuccessMessage('Crime report submitted successfully! Redirecting to map...')
            setTimeout(() => navigate('/map'), 2000)
        } catch (error) {
            setErrorMessage('Failed to submit report: ' + error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="report-page">
            <Navbar variant="dashboard" />

            {/* Hero Section */}
            <div className="page-hero-modern">
                <div className="hero-background">
                    <div className="hero-circle hero-circle-1"></div>
                    <div className="hero-circle hero-circle-2"></div>
                </div>
                <div className="page-hero-content">
                    <div className="page-badge">
                        <div className="feature-icon-wrapper blue">
                            <img src="/assets/icons/camera.svg" alt="Report" />
                        </div>
                    </div>
                    <h1 className="page-title">Report a Crime</h1>
                    <p className="page-subtitle">Help keep your community safe by reporting incidents. Your report will be processed immediately.</p>
                </div>
            </div>

            <div className="report-form-wrapper">
                {successMessage && <div className="success-message">{successMessage}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <form onSubmit={handleSubmit} className="report-form">
                    {/* AI Input Section */}
                    <div className="ai-input-section">
                        <h3>Report Incident Using AI</h3>
                        <p className="ai-subtitle">Choose how you'd like to report - our AI will automatically categorize it</p>

                        <div className="input-method-tabs">
                            <button
                                type="button"
                                className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
                                onClick={() => setActiveTab('text')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                </svg>
                                Text
                            </button>
                            <button
                                type="button"
                                className={`tab-btn ${activeTab === 'voice' ? 'active' : ''}`}
                                onClick={() => setActiveTab('voice')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                    <line x1="12" y1="19" x2="12" y2="23" />
                                    <line x1="8" y1="23" x2="16" y2="23" />
                                </svg>
                                Voice
                            </button>
                        </div>

                        {/* Text Tab */}
                        {activeTab === 'text' && (
                            <div className="tab-content">
                                <div className="form-group">
                                    <label htmlFor="ai-description">Describe what happened</label>
                                    <textarea
                                        id="ai-description"
                                        value={aiDescription}
                                        onChange={(e) => setAiDescription(e.target.value)}
                                        placeholder="E.g., 'I saw someone breaking into a car on Main Street...'"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="ai-analyze-btn"
                                    onClick={handleAnalyzeText}
                                    disabled={isAnalyzing || !aiDescription.trim()}
                                >
                                    {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                                </button>
                            </div>
                        )}

                        {/* Voice Tab */}
                        {activeTab === 'voice' && (
                            <div className="tab-content">
                                <div className="voice-recorder">
                                    <div className={`voice-status ${isRecording ? 'recording' : ''}`}>
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                                            <line x1="12" y1="19" x2="12" y2="23" />
                                            <line x1="8" y1="23" x2="16" y2="23" />
                                        </svg>
                                        <span>{isRecording ? 'Recording...' : 'Click to start recording'}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={`voice-btn ${isRecording ? 'recording' : ''}`}
                                        onClick={toggleRecording}
                                    >
                                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                                    </button>
                                    {voiceTranscript && (
                                        <div className="voice-transcript">{voiceTranscript}</div>
                                    )}
                                </div>
                                {voiceTranscript && (
                                    <button
                                        type="button"
                                        className="ai-analyze-btn"
                                        onClick={handleAnalyzeVoice}
                                        disabled={isAnalyzing}
                                    >
                                        {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* AI Results */}
                        {aiResults && (
                            <div className="ai-results">
                                <div className="ai-results-header">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                    <h4>AI Analysis Complete</h4>
                                </div>
                                <div className="ai-results-content">
                                    <div className="result-item">
                                        <strong>Detected Crime Type:</strong>
                                        <span className="crime-badge">{aiResults.crimeType}</span>
                                    </div>
                                    <div className="result-item">
                                        <strong>Summary:</strong>
                                        <p>{aiResults.summary}</p>
                                    </div>
                                    <button type="button" className="use-ai-btn" onClick={useAIResults}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Use These Results
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="divider-line"></div>

                    {/* Manual Form Fields */}
                    <div className="form-group">
                        <label htmlFor="incident-type">Who was affected? <span className="required">*</span></label>
                        <select
                            id="incident-type"
                            value={incidentType}
                            onChange={(e) => setIncidentType(e.target.value)}
                            required
                        >
                            <option value="">Select who was affected</option>
                            <option value="personal">This happened to me personally</option>
                            <option value="other">Someone else / General community report</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="crime-type">Crime Type <span className="required">*</span></label>
                        <select
                            id="crime-type"
                            value={crimeType}
                            onChange={(e) => setCrimeType(e.target.value)}
                            required
                        >
                            <option value="">Select a crime type</option>
                            {crimeTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description <span className="required">*</span></label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide details about the incident..."
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date-time">Date & Time <span className="required">*</span></label>
                        <input
                            type="datetime-local"
                            id="date-time"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Location <span className="required">*</span></label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter street address or landmark"
                            required
                        />
                        <button type="button" className="location-btn" onClick={getCurrentLocation}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                            Use My Current Location
                        </button>
                    </div>

                    <div className="form-group">
                        <label htmlFor="witnesses">Witnesses (Optional)</label>
                        <input
                            type="text"
                            id="witnesses"
                            value={witnesses}
                            onChange={(e) => setWitnesses(e.target.value)}
                            placeholder="Number of witnesses or names"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reporter-name">Your Name (Optional)</label>
                        <input
                            type="text"
                            id="reporter-name"
                            value={reporterName}
                            onChange={(e) => setReporterName(e.target.value)}
                            placeholder="Anonymous if left blank"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contact">
                            Contact Information
                            {incidentType === 'personal' && <span className="required">*</span>}
                            {incidentType !== 'personal' && <span> (Optional)</span>}
                        </label>
                        <input
                            type="text"
                            id="contact"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            placeholder="Phone or email for police follow-up"
                            required={incidentType === 'personal'}
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Report
