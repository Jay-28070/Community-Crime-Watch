# Community Crime Watch

An AI-powered crime tracking and prevention platform that empowers communities to stay safe.

## 📁 Project Structure

```
communityCrimeWatch/
├── index.html              # Root redirect to pages/index.html
├── pages/                  # All HTML pages
│   ├── index.html         # Landing page
│   ├── login.html         # User login
│   ├── signup.html        # User registration
│   ├── dashboard.html     # User dashboard
│   ├── dashboardPolice.html # Police dashboard
│   ├── report.html        # Crime reporting
│   ├── map.html           # Interactive crime map
│   ├── alerts.html        # User alerts
│   ├── alertsPolice.html  # Police alerts management
│   ├── safety.html        # Area safety checker
│   └── trends.html        # Crime trends analysis
├── js/                     # JavaScript modules
│   ├── script.js          # Main authentication & user logic
│   ├── scriptPolice.js    # Police authentication
│   ├── authUtils.js       # Shared auth utilities
│   ├── report.js          # Crime reporting logic
│   ├── map-script.js      # Map functionality
│   ├── alerts-view.js     # User alerts logic
│   ├── alertsPolice.js    # Police alerts logic
│   ├── safety.js          # Area safety checker logic
│   └── trends.js          # Trends analysis logic
├── assets/
│   ├── css/
│   │   └── styles.css     # Main stylesheet
│   └── icons/             # SVG icons
│       ├── logo.svg
│       ├── favicon.svg
│       ├── camera.svg
│       ├── map-trifold.svg
│       ├── bell-ringing.svg
│       ├── shield-check.svg
│       ├── trend-up.svg
│       └── warning.svg
└── README.md              # This file
```

## 🚀 Features

### For Community Members
- **Crime Reporting**: Submit reports via text, photo, or voice with AI-powered categorization
- **Interactive Map**: View reported crimes with color-coded severity levels
- **Safety Alerts**: Receive notifications about nearby incidents
- **Area Safety Checker**: Check if locations are safe with crime statistics
- **Trends Analysis**: View crime patterns and high-risk areas

### For Police Officers
- **Alert Management**: Review, confirm, and resolve crime reports
- **Cases Library**: Track all cases with status filtering
- **Crime Analytics**: Analyze patterns and identify hotspots
- **Real-time Updates**: Notify users about case status changes

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore)
- **AI**: Google Gemini API for crime categorization
- **Maps**: Leaflet.js for interactive mapping
- **Icons**: Custom SVG icons

## 📝 Getting Started

1. Open `index.html` in your browser (it will redirect to `pages/index.html`)
2. Sign up as a Community Member or Police Officer
3. Start reporting crimes or managing alerts

## 🎨 Design Features

- Modern, responsive design
- Smooth animations and transitions
- Role-based theming (Blue for users, Red for police)
- Mobile-friendly interface
- Accessibility compliant

## 🔐 Security

- Firebase Authentication with email/password and Google Sign-In
- Role-based access control (User vs Police)
- Badge number verification for police officers
- Secure data storage with Firestore

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

---
