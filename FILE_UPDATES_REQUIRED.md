# File-by-File Update Guide for GitHub Pages Structure

## Overview

This guide shows exactly what needs to change in each file for the new structure.

## Structure Change Summary

**OLD**:
```
pages/*.html → uses ../assets/css/styles.css
js/*.js
assets/css/styles.css
assets/icons/*.svg
```

**NEW**:
```
docs/index.html → uses assets/styles/styles.css
docs/pages/*.html → uses ../assets/styles/styles.css
docs/js/*.js
docs/assets/styles/styles.css
docs/assets/icons/*.svg
```

## Files That Need Updates

### 1. Root index.html ✅ (Already Updated)

**Current** (Correct):
```html
<meta http-equiv="refresh" content="0; url=docs/index.html">
<script>window.location.href = "docs/index.html";</script>
<a href="docs/index.html">click here</a>
```

### 2. docs/index.html (Main Landing Page)

**Find and Replace**:
```
OLD: href="../assets/icons/
NEW: href="assets/icons/

OLD: src="../assets/icons/
NEW: src="assets/icons/

OLD: href="../assets/css/styles.css"
NEW: href="assets/styles/styles.css"

OLD: src="../js/
NEW: src="js/

OLD: href="login.html"
NEW: href="pages/login.html"

OLD: href="signup.html"
NEW: href="pages/signup.html"

OLD: href="map.html"
NEW: href="pages/map.html"

OLD: href="dashboard.html"
NEW: href="pages/dashboard.html"
```

### 3. docs/pages/login.html

**Find and Replace**:
```
OLD: href="../assets/css/styles.css"
NEW: href="../assets/styles/styles.css"

OLD: href="index.html"
NEW: href="../index.html"

OLD: href="signup.html"
NEW: href="signup.html" (stays same - same folder)

OLD: href="dashboard.html"
NEW: href="dashboard.html" (stays same)
```

### 4. docs/pages/signup.html

**Find and Replace**:
```
OLD: href="../assets/css/styles.css"
NEW: href="../assets/styles/styles.css"

OLD: href="index.html"
NEW: href="../index.html"

OLD: href="login.html"
NEW: href="login.html" (stays same)

OLD: href="dashboard.html"
NEW: href="dashboard.html" (stays same)
```

### 5. docs/pages/dashboard.html

**Find and Replace**:
```
OLD: href="../assets/css/styles.css"
NEW: href="../assets/styles/styles.css"

OLD: href="index.html"
NEW: href="../index.html"

OLD: href="map.html"
NEW: href="map.html" (stays same)

OLD: href="report.html"
NEW: href="report.html" (stays same)

OLD: href="alerts.html"
NEW: href="alerts.html" (stays same)

OLD: href="trends.html"
NEW: href="trends.html" (stays same)
```

### 6. docs/pages/dashboardPolice.html

**Find and Replace**:
```
OLD: href="../assets/css/styles.css"
NEW: href="../assets/styles/styles.css"

OLD: href="dashboardPolice.html"
NEW: href="dashboardPolice.html" (stays same)

OLD: href="alertsPolice.html"
NEW: href="alertsPolice.html" (stays same)

OLD: href="trends.html"
NEW: href="trends.html" (stays same)

OLD: href="map.html"
NEW: href="map.html" (stays same)

OLD: href="report.html"
NEW: href="report.html" (stays same)
```

### 7. docs/pages/map.html

**Find and Replace**:
```
OLD: href="../assets/css/styles.css"
NEW: href="../assets/styles/styles.css"

OLD: href="index.html"
NEW: href="../index.html"

OLD: href="dashboard.html"
NEW: href="dashboard.html" (stays same)
```

### 8. docs/pages/report.html

**Find and Replace**:
```
OLD: href="../assets/css/styles.css"
NEW: href="../assets/styles/styles.css"

OLD: href="index.html"
NEW: href="../index.html"

OLD: href="map.html"
NEW: href="map.html" (stays same)

OLD: href="dashboard.html"
NEW: href="dashboard.html" (stays same)
```

### 9. docs/pages/alerts.html

**Find and Replace**:
```
OLD: href="../assets/css/styles.css"
NEW: href="../assets/styles/styles.css"

OLD: href="index.html"
NEW: href="../index.html"

OLD: href="dashboard.html"
NEW: href="dashboard.html" (stays same)

OLD: href="map.html"
NEW: href="map.html" (stays same)
```

### 10. docs/pages/alertsPolice.html

**Find and Replace**:
```
OLD: href="../assets/css/styles.css"
NEW: href="../assets/styles/styles.css"

OLD: href="dashboardPolice.html"
NEW: href="dashboardPolice.html" (stays same)

OLD: href="map.html"
NEW: href="map.html" (stays same)
```

### 11. docs/pages/safety.html

**Find and Replace**:
```
OLD: href="../assets/css/styles.css"
NEW: href="../assets/styles/styles.css"

OLD: href="index.html"
NEW: href="../index.html"

OLD: href="dashboard.html"
NEW: href="dashboard.html" (stays same)
```

### 12. docs/pages/trends.html

**Find and Replace**:
```
OLD: href="../assets/css/styles.css"
NEW: href="../assets/styles/styles.css"

OLD: href="index.html"
NEW: href="../index.html"

OLD: href="dashboard.html"
NEW: href="dashboard.html" (stays same)
```

## JavaScript Files

**No changes needed!** JavaScript files use relative imports and don't reference folder structure.

## CSS Files

**No changes needed!** CSS doesn't reference the folder structure.

## Quick Find & Replace Commands

### For docs/index.html:
```bash
# Remove ../ from paths
sed -i 's|../assets/|assets/|g' docs/index.html
sed -i 's|../js/|js/|g' docs/index.html

# Add pages/ to page links
sed -i 's|href="login.html"|href="pages/login.html"|g' docs/index.html
sed -i 's|href="signup.html"|href="pages/signup.html"|g' docs/index.html
sed -i 's|href="map.html"|href="pages/map.html"|g' docs/index.html
sed -i 's|href="dashboard.html"|href="pages/dashboard.html"|g' docs/index.html

# Update CSS path
sed -i 's|assets/css/styles.css|assets/styles/styles.css|g' docs/index.html
```

### For all files in docs/pages/:
```bash
# Update CSS path only
for file in docs/pages/*.html; do
    sed -i 's|../assets/css/styles.css|../assets/styles/styles.css|g' "$file"
    
    # Update links to home
    sed -i 's|href="index.html"|href="../index.html"|g' "$file"
    
    echo "Updated: $file"
done
```

## Verification Script

```bash
#!/bin/bash
# verify-structure.sh

echo "Checking docs structure..."

# Check folders exist
[ -d "docs/pages" ] && echo "✓ docs/pages exists" || echo "✗ docs/pages missing"
[ -d "docs/js" ] && echo "✓ docs/js exists" || echo "✗ docs/js missing"
[ -d "docs/assets/styles" ] && echo "✓ docs/assets/styles exists" || echo "✗ docs/assets/styles missing"
[ -d "docs/assets/icons" ] && echo "✓ docs/assets/icons exists" || echo "✗ docs/assets/icons missing"

# Check key files
[ -f "docs/index.html" ] && echo "✓ docs/index.html exists" || echo "✗ docs/index.html missing"
[ -f "docs/assets/styles/styles.css" ] && echo "✓ CSS file exists" || echo "✗ CSS file missing"

# Count files
echo ""
echo "File counts:"
echo "HTML pages: $(ls docs/pages/*.html 2>/dev/null | wc -l)"
echo "JS files: $(ls docs/js/*.js 2>/dev/null | wc -l)"
echo "Icons: $(ls docs/assets/icons/*.svg 2>/dev/null | wc -l)"

# Check for old paths in docs/index.html
echo ""
echo "Checking docs/index.html for old paths..."
grep -q "../assets/" docs/index.html && echo "✗ Found ../assets/ (should be assets/)" || echo "✓ No ../assets/ found"
grep -q "../js/" docs/index.html && echo "✗ Found ../js/ (should be js/)" || echo "✓ No ../js/ found"

# Check for CSS path in pages
echo ""
echo "Checking docs/pages/*.html for CSS path..."
grep -q "../assets/css/styles.css" docs/pages/*.html && echo "✗ Found old CSS path" || echo "✓ CSS paths updated"
grep -q "../assets/styles/styles.css" docs/pages/*.html && echo "✓ Found new CSS path" || echo "✗ New CSS path not found"

echo ""
echo "Verification complete!"
```

## Testing Checklist

After making all changes:

### Local Testing:
- [ ] Open `docs/index.html` in browser
- [ ] Check browser console for errors
- [ ] Verify CSS loads (page is styled)
- [ ] Verify images load (icons visible)
- [ ] Click "Log in" → goes to `docs/pages/login.html`
- [ ] Click "Sign up" → goes to `docs/pages/signup.html`
- [ ] From login page, click logo → goes back to `docs/index.html`
- [ ] Test all navigation links
- [ ] Test all functionality (login, signup, map, etc.)

### Path Verification:
- [ ] `docs/index.html` uses `assets/styles/styles.css`
- [ ] `docs/pages/*.html` uses `../assets/styles/styles.css`
- [ ] All icons load from `assets/icons/` or `../assets/icons/`
- [ ] All JS loads from `js/` or `../js/`
- [ ] No 404 errors in console

## Summary

**Total files to update**: ~13 HTML files
**Main changes**:
1. CSS path: `css/` → `styles/`
2. docs/index.html: Remove `../` from paths
3. docs/pages/*.html: Update CSS path, fix home link

**Time estimate**: 15-20 minutes with find & replace
**Difficulty**: Medium (systematic changes)

**Ready to proceed!** 🚀
