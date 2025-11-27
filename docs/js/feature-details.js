// Feature Details Data
const featureDetails = {
    reporting: {
        icon: 'camera.svg',
        color: 'blue',
        title: 'Smart Crime Reporting',
        description: 'Our AI-powered reporting system makes it easy to report crimes and suspicious activities in your community.',
        features: [
            {
                title: 'Multiple Input Methods',
                description: 'Report crimes via text, photo, or voice recording. Choose the method that works best for you.'
            },
            {
                title: 'AI Categorization',
                description: 'Our advanced AI automatically categorizes incidents, identifies crime types, and prioritizes based on severity.'
            },
            {
                title: 'Real-Time Processing',
                description: 'Reports are processed instantly and made available to law enforcement and community members immediately.'
            },
            {
                title: 'Anonymous Reporting',
                description: 'Report crimes anonymously if you prefer. Your safety and privacy are our top priorities.'
            }
        ]
    },
    map: {
        icon: 'map-trifold.svg',
        color: 'purple',
        title: 'Interactive Crime Map',
        description: 'Visualize crime data on an interactive map with real-time updates and detailed information about incidents in your area.',
        features: [
            {
                title: 'Color-Coded Risk Levels',
                description: 'Areas are color-coded based on crime severity - from green (safe) to red (high risk).'
            },
            {
                title: 'Real-Time Updates',
                description: 'See new incidents as they are reported. The map updates automatically to show the latest information.'
            },
            {
                title: 'Detailed Incident Info',
                description: 'Click on any marker to see detailed information about the incident, including type, time, and description.'
            },
            {
                title: 'Search & Filter',
                description: 'Search for specific locations and filter by crime type, date range, and severity level.'
            }
        ]
    },
    trends: {
        icon: 'trend-up.svg',
        color: 'orange',
        title: 'Crime Trend Analysis',
        description: 'Analyze crime patterns and trends to make informed decisions about your safety and community security.',
        features: [
            {
                title: 'Pattern Recognition',
                description: 'Identify crime patterns by time of day, day of week, and seasonal trends in your area.'
            },
            {
                title: 'Hotspot Identification',
                description: 'Discover high-risk areas and times to avoid. Plan your routes and activities accordingly.'
            },
            {
                title: 'Statistical Analysis',
                description: 'View detailed statistics and charts showing crime trends over time in your community.'
            },
            {
                title: 'Predictive Insights',
                description: 'Get insights into potential future crime patterns based on historical data and trends.'
            }
        ]
    },
    alerts: {
        icon: 'bell-ringing.svg',
        color: 'red',
        title: 'Real-Time Safety Alerts',
        description: 'Stay informed with instant notifications about crimes and safety concerns in your neighborhood.',
        features: [
            {
                title: 'Instant Notifications',
                description: 'Receive push notifications immediately when crimes are reported near your location.'
            },
            {
                title: 'Customizable Alerts',
                description: 'Choose which types of crimes you want to be notified about and set your notification radius.'
            },
            {
                title: 'Safety Recommendations',
                description: 'Get preventive advice and safety tips based on recent incidents in your area.'
            },
            {
                title: 'Status Updates',
                description: 'Track the status of reported incidents and receive updates when cases are resolved.'
            }
        ]
    },
    safety: {
        icon: 'shield-check.svg',
        color: 'green',
        title: 'Area Safety Checker',
        description: 'Check the safety level of any location before you visit. Get detailed crime statistics and safety ratings.',
        features: [
            {
                title: 'Location Search',
                description: 'Search any address or location to see its safety rating and recent crime activity.'
            },
            {
                title: 'Safety Ratings',
                description: 'Get clear safety ratings (Safe/Not Safe) based on recent crime data and incident frequency.'
            },
            {
                title: 'Crime Statistics',
                description: 'View detailed statistics including total crimes, recent incidents, and common crime types.'
            },
            {
                title: 'Current Location Alert',
                description: 'Automatically check if your current location is in an unsafe area and receive warnings.'
            }
        ]
    },
    emergency: {
        icon: 'phone',
        color: 'emergency',
        title: 'Emergency Contacts',
        description: 'Quick access to emergency services and important contact numbers for your country and location.',
        features: [
            {
                title: 'Auto-Detection',
                description: 'Automatically detects your country based on your location and displays relevant emergency numbers.'
            },
            {
                title: 'Multiple Countries',
                description: 'Access emergency contacts for 10+ countries including US, UK, Canada, Australia, and more.'
            },
            {
                title: 'Click-to-Call',
                description: 'Tap any number to call immediately. Every second counts in an emergency.'
            },
            {
                title: 'Specialized Services',
                description: 'Find contacts for police, fire, medical, crisis hotlines, and specialized support services.'
            }
        ]
    }
};

// Show feature details modal
function showFeatureDetails(featureKey) {
    const modal = document.getElementById('feature-modal');
    const modalBody = document.getElementById('feature-modal-body');
    const feature = featureDetails[featureKey];
    
    if (!feature) return;
    
    // Build modal content
    const iconHtml = feature.icon === 'phone' 
        ? `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
           </svg>`
        : `<img src="assets/icons/${feature.icon}" alt="${feature.title}">`;
    
    modalBody.innerHTML = `
        <div class="feature-modal-header">
            <div class="feature-modal-icon ${feature.color}">
                ${iconHtml}
            </div>
            <h2>${feature.title}</h2>
            <p>${feature.description}</p>
        </div>
        
        <div class="feature-modal-features">
            ${feature.features.map(f => `
                <div class="feature-detail-card">
                    <div class="feature-detail-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </div>
                    <div class="feature-detail-content">
                        <h4>${f.title}</h4>
                        <p>${f.description}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="feature-modal-cta">
            <button class="cta-btn-primary" onclick="window.location.href='pages/signup.html'">
                <span>Get Started Free</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                </svg>
            </button>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close feature details modal
function closeFeatureDetails() {
    const modal = document.getElementById('feature-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('feature-modal');
    if (e.target === modal) {
        closeFeatureDetails();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeFeatureDetails();
    }
});

// Make functions globally available
window.showFeatureDetails = showFeatureDetails;
window.closeFeatureDetails = closeFeatureDetails;
