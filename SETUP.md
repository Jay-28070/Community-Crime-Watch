# Setup & Quick Start Guide

## 🚀 Quick Start

1. **Open the application**
   - Simply open `index.html` in your web browser
   - It will automatically redirect to `pages/index.html`

2. **Create an account**
   - Click "Sign up" 
   - Choose your role: Community Member or Police Officer
   - Police officers need to enter their badge number

3. **Start using the app**
   - Community Members: Report crimes, view maps, check area safety
   - Police Officers: Manage alerts, analyze trends, resolve cases

## 📁 Project Structure

```
communityCrimeWatch/
├── index.html              # Entry point (redirects to pages/)
├── pages/                  # All HTML pages
├── js/                     # JavaScript modules
├── assets/
│   ├── css/               # Stylesheets
│   └── icons/             # SVG icons
├── README.md              # Project documentation
├── NAVIGATION.md          # Navigation reference
└── SETUP.md              # This file
```

## 🔧 Configuration

### Firebase Setup
The app is already configured with Firebase. If you need to change the configuration:

1. Open `js/script.js` and `js/authUtils.js`
2. Update the `firebaseConfig` object with your credentials:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};
```

### Google Gemini API (for AI features)
The AI crime categorization uses Google Gemini API. To configure:

1. Open `js/report.js`
2. Update the API key:
```javascript
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
```

## 🌐 Deployment

### Local Testing
- Simply open `index.html` in any modern web browser
- No server required for basic functionality
- Firebase handles backend operations

### Web Hosting
You can deploy to any static hosting service:

1. **GitHub Pages**
   - Push to GitHub repository
   - Enable GitHub Pages in settings
   - Set source to root directory

2. **Netlify**
   - Drag and drop the entire folder
   - Or connect to GitHub repository

3. **Firebase Hosting**
   ```bash
   firebase init hosting
   firebase deploy
   ```

4. **Vercel**
   - Import GitHub repository
   - Deploy automatically

## 🔐 User Roles

### Community Member
- Report crimes (text, photo, voice)
- View interactive crime map
- Receive safety alerts
- Check area safety
- View crime trends

### Police Officer
- All community member features
- Manage and resolve crime reports
- Access cases library
- Update case statuses
- Notify users of case updates

## 📱 Browser Compatibility

Tested and working on:
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Pages not loading?
- Make sure you're opening `index.html` from the root directory
- Check browser console for errors (F12)
- Ensure all files are in correct folders

### Login not working?
- Check Firebase configuration
- Verify internet connection
- Check browser console for Firebase errors

### Map not displaying?
- Ensure internet connection (Leaflet.js loads from CDN)
- Check browser console for errors

### AI features not working?
- Verify Gemini API key is configured
- Check API quota limits
- Ensure internet connection

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Review NAVIGATION.md for path issues
3. Verify Firebase and API configurations

## 🎯 Next Steps

After setup:
1. Test user registration and login
2. Try reporting a crime
3. View the interactive map
4. Check area safety feature
5. Test police dashboard (if applicable)

---

Happy coding! 🚀
