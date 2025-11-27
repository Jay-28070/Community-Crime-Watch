# GitHub Pages 404 Error - Troubleshooting Guide

## Current Structure
```
root/
├── index.html (redirects to docs/index.html)
└── docs/
    ├── index.html (main landing page)
    ├── pages/
    │   ├── index.html (redirects to ../index.html)
    │   ├── login.html
    │   ├── signup.html
    │   ├── dashboard.html
    │   └── ... (other pages)
    ├── js/
    │   └── *.js files
    └── assets/
        ├── css/
        └── icons/
```

## GitHub Pages Configuration

### Step 1: Check GitHub Pages Settings
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or `master`)
   - **Folder**: `/docs`
4. Click **Save**

### Step 2: Verify Your Repository URL
Your site should be accessible at:
- `https://[username].github.io/[repository-name]/`

For example:
- `https://jasonwilliams.github.io/communityCrimeWatch/`

### Step 3: Common 404 Errors and Fixes

#### Error 1: "File not found" on root URL
**Problem**: Accessing `https://[username].github.io/[repository-name]/`
**Solution**: Make sure `docs/index.html` exists (✅ Already exists)

#### Error 2: "File not found" on specific pages
**Problem**: Accessing `https://[username].github.io/[repository-name]/pages/login.html`
**Solution**: Use correct path: `https://[username].github.io/[repository-name]/pages/login.html`

#### Error 3: Assets not loading (CSS, JS, images)
**Problem**: 404 errors for CSS, JS, or images
**Solution**: All asset paths in HTML files should be relative:
- ✅ `href="../assets/css/styles.css"` (from pages/)
- ✅ `src="../js/script.js"` (from pages/)
- ✅ `href="assets/css/styles.css"` (from docs/)

### Step 4: Test Your Site Locally

Before pushing to GitHub, test locally:

1. **Using Python**:
   ```bash
   cd docs
   python -m http.server 8000
   ```
   Then visit: `http://localhost:8000`

2. **Using Node.js (http-server)**:
   ```bash
   npm install -g http-server
   cd docs
   http-server
   ```
   Then visit: `http://localhost:8080`

3. **Using VS Code Live Server**:
   - Right-click on `docs/index.html`
   - Select "Open with Live Server"

### Step 5: Clear GitHub Pages Cache

If you've made changes but still see 404:
1. Wait 1-2 minutes for GitHub Pages to rebuild
2. Clear your browser cache (Ctrl+Shift+Delete)
3. Try accessing in incognito/private mode
4. Force refresh (Ctrl+F5 or Cmd+Shift+R)

### Step 6: Check Build Status

1. Go to your repository
2. Click the **Actions** tab
3. Look for "pages build and deployment"
4. If it shows ❌, click on it to see the error
5. If it shows ✅, your site should be live

### Step 7: Verify File Names

GitHub Pages is **case-sensitive**:
- ❌ `Login.html` vs `login.html`
- ❌ `Dashboard.html` vs `dashboard.html`
- ✅ All files should be lowercase

Check your files:
```bash
# All pages should be lowercase
docs/pages/login.html ✅
docs/pages/signup.html ✅
docs/pages/dashboard.html ✅
```

## Common Issues and Solutions

### Issue: "The site configured at this address does not contain the requested file"

**Possible Causes:**
1. GitHub Pages is not configured to use `/docs` folder
2. The file path is incorrect
3. File name case mismatch
4. GitHub Pages hasn't finished building

**Solutions:**
1. Check Settings → Pages → Folder is set to `/docs`
2. Verify all links use correct relative paths
3. Ensure all filenames are lowercase
4. Wait 1-2 minutes and refresh

### Issue: CSS/JS not loading

**Check these paths in your HTML files:**

From `docs/index.html`:
```html
<link rel="stylesheet" href="assets/css/styles.css"> ✅
<script src="js/script.js"></script> ✅
```

From `docs/pages/*.html`:
```html
<link rel="stylesheet" href="../assets/css/styles.css"> ✅
<script src="../js/script.js"></script> ✅
```

### Issue: Navigation not working

**Check JavaScript redirects:**

All JS files should use relative paths:
```javascript
// From pages/ folder
window.location.href = "dashboard.html"; ✅
window.location.href = "../index.html"; ✅

// NOT
window.location.href = "/dashboard.html"; ❌
window.location.href = "pages/dashboard.html"; ❌
```

## Testing Checklist

Before deploying to GitHub Pages:

- [ ] `docs/index.html` exists and loads
- [ ] All pages in `docs/pages/` load correctly
- [ ] CSS loads on all pages
- [ ] JavaScript loads on all pages
- [ ] Images/icons load correctly
- [ ] Navigation between pages works
- [ ] Login/signup functionality works
- [ ] Logout redirects to index.html
- [ ] All links use relative paths
- [ ] No hardcoded localhost URLs

## Quick Fix Commands

If you need to verify all paths are correct:

```bash
# Check for absolute paths (should return nothing)
grep -r "href=\"/[^/]" docs/
grep -r "src=\"/[^/]" docs/

# Check for localhost references (should return nothing)
grep -r "localhost" docs/

# Check for incorrect index.html references
grep -r "index.html" docs/js/
```

## Still Having Issues?

1. **Check the browser console** (F12) for specific error messages
2. **Check the Network tab** to see which files are failing to load
3. **Verify the exact URL** you're trying to access
4. **Check GitHub Actions** for build errors
5. **Try accessing the raw file** directly to confirm it exists

## Your Site URLs

Once deployed, your site will be accessible at:
- **Landing Page**: `https://[username].github.io/[repository-name]/`
- **Login**: `https://[username].github.io/[repository-name]/pages/login.html`
- **Signup**: `https://[username].github.io/[repository-name]/pages/signup.html`
- **Dashboard**: `https://[username].github.io/[repository-name]/pages/dashboard.html`

Replace `[username]` and `[repository-name]` with your actual GitHub username and repository name.

---

**Note**: GitHub Pages can take 1-2 minutes to update after pushing changes. Always wait a bit and clear your cache before assuming something is broken!
