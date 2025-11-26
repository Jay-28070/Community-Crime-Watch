# Rename Pages to Docs - Complete Guide

## Overview
This guide provides step-by-step instructions to rename the `pages` folder to `docs` and update all necessary references.

## Why This Works Easily

✅ **Good News**: All HTML files in the `pages` folder use relative paths (`../`) to reference:
- CSS files (`../assets/css/styles.css`)
- JavaScript files (`../js/script.js`)
- Images (`../assets/icons/logo.svg`)

This means when you rename `pages` to `docs`, all these references will continue to work without any changes!

## Step-by-Step Instructions

### Step 1: Rename the Folder
```bash
# In your project root directory
mv pages docs
```

Or manually:
1. Right-click on `pages` folder
2. Select "Rename"
3. Change name to `docs`

### Step 2: Update Root index.html

**File**: `index.html` (in root directory)

**Current content**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=pages/index.html">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
    <script>
        window.location.href = "pages/index.html";
    </script>
</head>
<body>
    <p>Redirecting to Community Crime Watch...</p>
    <p>If you are not redirected, <a href="pages/index.html">click here</a>.</p>
</body>
</html>
```

**Change to**:
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

**Changes made**:
- Line 5: `pages/index.html` → `docs/index.html`
- Line 8: `pages/index.html` → `docs/index.html`
- Line 13: `pages/index.html` → `docs/index.html`

### Step 3: Verify File Structure

After renaming, your structure should look like:

```
project-root/
├── index.html (updated)
├── docs/ (renamed from pages)
│   ├── alerts.html
│   ├── alertsPolice.html
│   ├── dashboard.html
│   ├── dashboardPolice.html
│   ├── index.html
│   ├── login.html
│   ├── map.html
│   ├── report.html
│   ├── safety.html
│   ├── signup.html
│   └── trends.html
├── js/
│   ├── ai-helper.js
│   ├── alerts.js
│   ├── alertsPolice.js
│   ├── authUtils.js
│   ├── loader.js
│   ├── map-script.js
│   ├── report.js
│   ├── safety.js
│   ├── script.js
│   ├── scriptPolice.js
│   └── trends.js
└── assets/
    ├── css/
    │   └── styles.css
    └── icons/
        ├── bell-ringing.svg
        ├── camera.svg
        ├── favicon.svg
        ├── icons8-google.svg
        ├── logo.svg
        ├── map-trifold.svg
        ├── shield-check.svg
        ├── trend-up.svg
        └── warning.svg
```

## Files That Need NO Changes

✅ **All HTML files in docs/ folder** - They use relative paths (`../`) which still work
✅ **All JavaScript files** - They don't reference the pages folder
✅ **All CSS files** - They don't reference the pages folder
✅ **All asset files** - They don't reference the pages folder

## Files That Need Changes

❌ **Only 1 file needs updating**:
- `index.html` (root) - Change `pages/` to `docs/` (3 occurrences)

## Testing After Rename

### 1. Test Root Redirect
- Open `http://localhost/index.html` (or your domain)
- Should redirect to `docs/index.html`
- ✅ Success if you see the landing page

### 2. Test Navigation
From the landing page, test all links:
- ✅ Login button → `docs/login.html`
- ✅ Sign up button → `docs/signup.html`
- ✅ View Map → `docs/map.html`

### 3. Test Assets Loading
Check browser console (F12):
- ✅ No 404 errors for CSS files
- ✅ No 404 errors for JS files
- ✅ No 404 errors for images
- ✅ All icons display correctly

### 4. Test All Pages
Visit each page directly:
- ✅ `docs/index.html` - Landing page
- ✅ `docs/login.html` - Login page
- ✅ `docs/signup.html` - Signup page
- ✅ `docs/dashboard.html` - User dashboard
- ✅ `docs/dashboardPolice.html` - Police dashboard
- ✅ `docs/map.html` - Crime map
- ✅ `docs/report.html` - Report form
- ✅ `docs/alerts.html` - Alerts page
- ✅ `docs/alertsPolice.html` - Police alerts
- ✅ `docs/safety.html` - Safety checker
- ✅ `docs/trends.html` - Crime trends

### 5. Test Functionality
- ✅ Login works
- ✅ Signup works
- ✅ Map loads
- ✅ Report submission works
- ✅ AI analysis works
- ✅ Police dashboard works

## Why This Is Safe

### Relative Paths Work
All HTML files use `../` which means "go up one directory":
```html
<!-- These paths work from both pages/ and docs/ -->
<link rel="stylesheet" href="../assets/css/styles.css">
<script src="../js/script.js"></script>
<img src="../assets/icons/logo.svg">
```

### No Hardcoded Paths
- ✅ No JavaScript files reference "pages/"
- ✅ No CSS files reference "pages/"
- ✅ No HTML files reference "pages/" (except root index.html)

### GitHub Pages Compatible
If deploying to GitHub Pages:
- `docs/` is the standard folder name
- GitHub Pages automatically serves from `docs/`
- No additional configuration needed

## Rollback Plan

If something goes wrong:

### Quick Rollback
```bash
# Rename back to pages
mv docs pages

# Revert index.html changes
# Change all "docs/" back to "pages/"
```

### Or Use Git
```bash
# If using version control
git checkout index.html
mv docs pages
```

## Common Issues & Solutions

### Issue 1: 404 Errors for Assets
**Symptom**: CSS/JS/Images not loading
**Cause**: Folder not renamed correctly
**Solution**: Ensure folder is named exactly `docs` (lowercase)

### Issue 2: Redirect Not Working
**Symptom**: Root index.html doesn't redirect
**Cause**: index.html not updated
**Solution**: Update all 3 occurrences of `pages/` to `docs/`

### Issue 3: Some Pages Work, Others Don't
**Symptom**: Inconsistent behavior
**Cause**: Browser cache
**Solution**: Hard refresh (Ctrl+Shift+R) or clear cache

## Deployment Notes

### Local Development
- Works immediately after rename
- No server configuration needed

### GitHub Pages
- Perfect! `docs/` is the standard folder
- Set repository settings to serve from `docs/`
- Commit and push changes

### Other Hosting
- Upload `docs/` folder
- Update root `index.html`
- No server configuration needed (static site)

## Verification Checklist

After completing the rename:

- [ ] Folder renamed from `pages` to `docs`
- [ ] Root `index.html` updated (3 changes)
- [ ] Root redirect works
- [ ] Landing page loads
- [ ] All navigation links work
- [ ] CSS loads correctly
- [ ] JavaScript loads correctly
- [ ] Images display correctly
- [ ] Login/Signup works
- [ ] Map displays
- [ ] Report form works
- [ ] AI features work
- [ ] Police dashboard works
- [ ] No console errors

## Summary

**Total Changes Required**: 1 file (root index.html)
**Total Occurrences**: 3 (all in same file)
**Risk Level**: Very Low ✅
**Time Required**: < 2 minutes
**Rollback**: Easy (just rename back)

The rename is safe because:
1. All HTML files use relative paths (`../`)
2. No JavaScript references "pages/"
3. No CSS references "pages/"
4. Only root index.html needs updating
5. Easy to test and rollback

**You're ready to rename!** 🚀
