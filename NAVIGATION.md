# Navigation Reference Guide

## How Navigation Works

### File Structure
```
root/
├── index.html (redirects to pages/index.html)
├── pages/
│   └── *.html (all page files)
├── js/
│   └── *.js (all JavaScript files)
└── assets/
    ├── css/
    │   └── styles.css
    └── icons/
        └── *.svg
```

### Path Rules

#### 1. From Root (index.html)
- To pages: `pages/filename.html`
- Example: `pages/index.html`

#### 2. Within Pages Folder (pages/*.html)
- To other pages: `filename.html` (same folder)
- To assets: `../assets/path/file`
- To JS: `../js/filename.js`
- Examples:
  - `<a href="login.html">` ✅
  - `<img src="../assets/icons/logo.svg">` ✅
  - `<script src="../js/script.js">` ✅

#### 3. JavaScript Files (js/*.js)
- When redirecting from pages: `filename.html` (relative)
- Examples:
  - `window.location.href = "dashboard.html"` ✅
  - `window.location.href = "login.html"` ✅

### Common Navigation Patterns

#### User Flow
1. Root → `pages/index.html`
2. Index → `login.html` or `signup.html`
3. Login → `dashboard.html` (users) or `dashboardPolice.html` (police)
4. Dashboard → `report.html`, `map.html`, `alerts.html`, `safety.html`

#### Police Flow
1. Root → `pages/index.html`
2. Index → `login.html` (with police role)
3. Login → `dashboardPolice.html`
4. Police Dashboard → `alertsPolice.html`, `trends.html`, `map.html`, `report.html`

### Important Notes

✅ **DO:**
- Use relative paths within the same folder
- Use `../` to go up one level from pages to root
- Keep all HTML files in the `pages/` folder
- Use simple filenames in JavaScript redirects

❌ **DON'T:**
- Use absolute paths
- Mix `pages/` prefix in JavaScript when already in pages folder
- Reference files outside the project structure

### Testing Navigation

To test if navigation works:
1. Open `index.html` in browser (should redirect to pages/index.html)
2. Click "Sign up" (should go to signup.html)
3. Click "Log in" (should go to login.html)
4. After login, should redirect to appropriate dashboard
5. Dashboard buttons should navigate to feature pages

All navigation should work without any 404 errors.
