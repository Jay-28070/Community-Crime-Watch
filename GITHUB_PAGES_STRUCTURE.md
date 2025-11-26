# GitHub Pages Structure Guide

## Target Structure

```
project-root/
├── index.html (redirect to docs/)
├── docs/
│   ├── index.html (main landing page)
│   ├── pages/
│   │   ├── about.html
│   │   ├── alerts.html
│   │   ├── alertsPolice.html
│   │   ├── dashboard.html
│   │   ├── dashboardPolice.html
│   │   ├── login.html
│   │   ├── map.html
│   │   ├── report.html
│   │   ├── safety.html
│   │   ├── signup.html
│   │   └── trends.html
│   ├── js/
│   │   ├── ai-helper.js
│   │   ├── alerts.js
│   │   ├── alertsPolice.js
│   │   ├── authUtils.js
│   │   ├── loader.js
│   │   ├── map-script.js
│   │   ├── report.js
│   │   ├── safety.js
│   │   ├── script.js
│   │   ├── scriptPolice.js
│   │   └── trends.js
│   └── assets/
│       ├── styles/
│       │   └── styles.css
│       └── icons/
│           ├── bell-ringing.svg
│           ├── camera.svg
│           ├── favicon.svg
│           ├── icons8-google.svg
│           ├── logo.svg
│           ├── map-trifold.svg
│           ├── shield-check.svg
│           ├── trend-up.svg
│           └── warning.svg
```

## Step-by-Step Migration

### Step 1: Create New Folder Structure

```bash
# Create docs folder if it doesn't exist
mkdir -p docs

# Create subfolders inside docs
mkdir -p docs/pages
mkdir -p docs/js
mkdir -p docs/assets/styles
mkdir -p docs/assets/icons
```

### Step 2: Move Files

```bash
# Move HTML files (except index.html) to docs/pages/
mv pages/*.html docs/pages/
# But keep one index.html for docs root
mv docs/pages/index.html docs/

# Move JavaScript files to docs/js/
mv js/*.js docs/js/

# Move CSS files to docs/assets/styles/
mv assets/css/*.css docs/assets/styles/

# Move icons to docs/assets/icons/
mv assets/icons/*.svg docs/assets/icons/
```

### Step 3: Update Root index.html

**File**: `index.html` (project root)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=docs/index.html">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
    <script>
        window.location.href = "docs/index.html";
    </script>
</head>
<body>
    <p>Redirecting to Community Crime Watch...</p>
    <p>If you are not redirected, <a href="docs/index.html">click here</a>.</p>
</body>
</html>
```

### Step 4: Update docs/index.html (Main Landing Page)

**File**: `docs/index.html`

Change all paths from `../` to relative paths within docs:

```html
<!-- OLD (from pages folder) -->
<link rel="icon" type="image/svg+xml" href="../assets/icons/favicon.svg">
<script type="module" src="../js/script.js" defer></script>
<link rel="stylesheet" href="../assets/css/styles.css">
<img src="../assets/icons/logo.svg" alt="Logo">

<!-- NEW (from docs root) -->
<link rel="icon" type="image/svg+xml" href="assets/icons/favicon.svg">
<script type="module" src="js/script.js" defer></script>
<link rel="stylesheet" href="assets/styles/styles.css">
<img src="assets/icons/logo.svg" alt="Logo">
```

**Full updated docs/index.html**:
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="assets/icons/favicon.svg">
    <script type="module" src="js/script.js" defer></script>
    <link rel="stylesheet" href="assets/styles/styles.css">
    <title>Community Crime Watch</title>
</head>

<body>
    <!-- Navbar -->
    <nav>
        <div class="main-logo">
            <img src="assets/icons/logo.svg" alt="Logo">
            Community Crime Watch
        </div>
        <div class="links">
            <a class="login-btn" href="pages/login.html">Log in</a>
            <a class="signup-button" href="pages/signup.html">Sign up</a>
        </div>
    </nav>

    <!-- Hero section -->
    <div class="logo-card">
        <div class="logo-content">
            <h1>Community Crime Watch</h1>
            <p>Report, track, and stay informed about crime in your neighborhood</p>
            <div class="hero-buttons">
                <button class="get-started-btn" onclick="window.location.href='pages/signup.html'">Get Started</button>
                <button class="crime-map-btn" onclick="window.location.href='pages/map.html'">View Crime Map</button>
            </div>
        </div>
    </div>

    <!-- Info section -->
    <div class="info-content">
        <div class="info-card">
            <h1>How It Works</h1>
            <p>Our platform makes it easy to report crimes, view crime maps, and stay updated on safety alerts in your area.</p>
        </div>

        <div class="box-card">
            <div class="box-card-content">
                <img src="assets/icons/camera.svg" alt="Icon of camera" class="card-icon">
                <h2>Easy crime reporting</h2>
                <p>Report incidents quickly with our AI-powered form that auto-fills details</p>
            </div>

            <div class="box-card-content">
                <img src="assets/icons/map-trifold.svg" alt="Icon of map" class="card-icon">
                <h2>Interactive crime map</h2>
                <p>View real-time crime data on an interactive map of your community</p>
            </div>

            <div class="box-card-content">
                <img src="assets/icons/trend-up.svg" alt="Icon of trend analysis" class="card-icon">
                <h2>Crime trend analysis</h2>
                <p>Understand crime patterns and trends in your neighborhood</p>
            </div>

            <div class="box-card-content">
                <img src="assets/icons/bell-ringing.svg" alt="Icon of bell" class="card-icon">
                <h2>Safety alert</h2>
                <p>Receive notifications about crimes and safety concerns near you</p>
            </div>
        </div>
    </div>

    <!-- Call to action -->
    <div class="ad-card">
        <div class="ad-card-content">
            <img src="assets/icons/warning.svg" alt="Warning icon" class="ad-icon">
            <h2>Make your community <b>Safer</b> Today</h2>
            <p>Join thousands of community members working together to reduce crime</p>
            <button class="btn-ad" onclick="window.location.href='pages/signup.html'">Join Now</button>
        </div>
    </div>
</body>

</html>
```

### Step 5: Update All HTML Files in docs/pages/

For each HTML file in `docs/pages/`, update paths:

**Pattern to follow**:
```html
<!-- OLD (when in pages/ at root level) -->
<link rel="icon" type="image/svg+xml" href="../assets/icons/favicon.svg">
<script type="module" src="../js/script.js" defer></script>
<link rel="stylesheet" href="../assets/css/styles.css">
<img src="../assets/icons/logo.svg" alt="Logo">

<!-- NEW (when in docs/pages/) -->
<link rel="icon" type="image/svg+xml" href="../assets/icons/favicon.svg">
<script type="module" src="../js/script.js" defer></script>
<link rel="stylesheet" href="../assets/styles/styles.css">
<img src="../assets/icons/logo.svg" alt="Logo">
```

**Key changes**:
- `../assets/css/styles.css` → `../assets/styles/styles.css`
- All other `../` paths stay the same (they go up to docs/)

### Step 6: Update Internal Links

In all HTML files, update links to other pages:

**In docs/index.html**:
```html
<!-- Links to pages -->
<a href="pages/login.html">Log in</a>
<a href="pages/signup.html">Sign up</a>
<a href="pages/map.html">View Map</a>
```

**In docs/pages/*.html**:
```html
<!-- Links to other pages (same folder) -->
<a href="login.html">Log in</a>
<a href="signup.html">Sign up</a>
<a href="map.html">View Map</a>
<a href="dashboard.html">Dashboard</a>

<!-- Link back to home -->
<a href="../index.html">Home</a>
```

## Automated Update Script

Create a script to help with updates:

```bash
#!/bin/bash
# update-paths.sh

# Update all HTML files in docs/pages/
for file in docs/pages/*.html; do
    # Update CSS path
    sed -i 's|../assets/css/styles.css|../assets/styles/styles.css|g' "$file"
    
    # Update internal page links (if they reference pages/)
    sed -i 's|href="pages/|href="|g' "$file"
    sed -i 's|href="../pages/|href="|g' "$file"
    
    echo "Updated: $file"
done

# Update docs/index.html
sed -i 's|../assets/icons/|assets/icons/|g' docs/index.html
sed -i 's|../assets/css/styles.css|assets/styles/styles.css|g' docs/index.html
sed -i 's|../js/|js/|g' docs/index.html

echo "All files updated!"
```

## Manual Update Checklist

### For docs/index.html:
- [ ] `../assets/icons/` → `assets/icons/`
- [ ] `../assets/css/styles.css` → `assets/styles/styles.css`
- [ ] `../js/` → `js/`
- [ ] Links to pages: `href="pages/login.html"`

### For docs/pages/*.html:
- [ ] `../assets/css/styles.css` → `../assets/styles/styles.css`
- [ ] `../assets/icons/` stays as `../assets/icons/`
- [ ] `../js/` stays as `../js/`
- [ ] Links to other pages: `href="login.html"` (no pages/ prefix)
- [ ] Link to home: `href="../index.html"`

## Testing Checklist

### Local Testing:
- [ ] Open `docs/index.html` directly
- [ ] All CSS loads
- [ ] All images display
- [ ] All JavaScript works
- [ ] Navigation to pages works
- [ ] Navigation back to home works

### GitHub Pages Testing:
- [ ] Set repository to serve from `docs/` folder
- [ ] Visit `https://username.github.io/repo-name/`
- [ ] Should redirect to `docs/index.html`
- [ ] All pages accessible
- [ ] All assets load
- [ ] All functionality works

## GitHub Pages Configuration

### Repository Settings:
1. Go to repository Settings
2. Navigate to Pages section
3. Source: Deploy from a branch
4. Branch: main (or master)
5. Folder: `/docs`
6. Save

### Custom Domain (Optional):
1. Add CNAME file in docs/ folder
2. Content: `yourdomain.com`
3. Configure DNS settings

## Path Reference Guide

### From docs/index.html:
```
assets/icons/logo.svg          ✓
assets/styles/styles.css       ✓
js/script.js                   ✓
pages/login.html               ✓
```

### From docs/pages/*.html:
```
../assets/icons/logo.svg       ✓
../assets/styles/styles.css    ✓
../js/script.js                ✓
login.html                     ✓ (same folder)
../index.html                  ✓ (back to home)
```

### From root index.html:
```
docs/index.html                ✓
```

## Common Issues & Solutions

### Issue: CSS not loading
**Solution**: Check path is `assets/styles/styles.css` (not `assets/css/`)

### Issue: Images not showing
**Solution**: Verify icons are in `docs/assets/icons/`

### Issue: JavaScript errors
**Solution**: Check JS files are in `docs/js/`

### Issue: 404 on page navigation
**Solution**: Verify links don't include `pages/` prefix when linking between pages

## Final Structure Verification

```bash
# Check structure
tree docs/

# Should show:
docs/
├── index.html
├── pages/
│   ├── alerts.html
│   ├── alertsPolice.html
│   ├── dashboard.html
│   ├── dashboardPolice.html
│   ├── login.html
│   ├── map.html
│   ├── report.html
│   ├── safety.html
│   ├── signup.html
│   └── trends.html
├── js/
│   └── [all .js files]
└── assets/
    ├── styles/
    │   └── styles.css
    └── icons/
        └── [all .svg files]
```

## Summary

**Key Changes**:
1. Everything moves inside `docs/`
2. HTML pages (except index) go in `docs/pages/`
3. CSS moves to `docs/assets/styles/`
4. Icons stay in `docs/assets/icons/`
5. JS stays in `docs/js/`
6. Update all paths accordingly

**Benefits**:
- ✅ GitHub Pages compatible
- ✅ Clean structure
- ✅ Easy to maintain
- ✅ Professional organization

**Ready for GitHub Pages deployment!** 🚀
