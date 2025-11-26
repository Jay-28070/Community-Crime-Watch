# Complete Migration Steps for GitHub Pages

## Prerequisites

- [ ] Backup your project (git commit or copy folder)
- [ ] Have terminal/command prompt open in project root
- [ ] Text editor ready for find & replace

## Phase 1: Create New Structure (5 minutes)

### Step 1.1: Create Folders
```bash
# Create docs folder structure
mkdir -p docs/pages
mkdir -p docs/js
mkdir -p docs/assets/styles
mkdir -p docs/assets/icons
```

### Step 1.2: Move Files
```bash
# Move HTML files
# First, move all HTML files to docs/pages/
cp pages/*.html docs/pages/

# Then move index.html to docs root
mv docs/pages/index.html docs/

# Move JavaScript files
cp js/*.js docs/js/

# Move CSS files
cp assets/css/styles.css docs/assets/styles/

# Move icons
cp assets/icons/*.svg docs/assets/icons/
```

## Phase 2: Update docs/index.html (3 minutes)

Open `docs/index.html` in your editor and make these changes:

### Change 1: Update CSS Path
```html
<!-- Find -->
<link rel="stylesheet" href="../assets/css/styles.css">

<!-- Replace with -->
<link rel="stylesheet" href="assets/styles/styles.css">
```

### Change 2: Update Icon Paths
```html
<!-- Find all instances of -->
href="../assets/icons/
src="../assets/icons/

<!-- Replace with -->
href="assets/icons/
src="assets/icons/
```

### Change 3: Update JavaScript Paths
```html
<!-- Find -->
<script type="module" src="../js/script.js" defer></script>

<!-- Replace with -->
<script type="module" src="js/script.js" defer></script>
```

### Change 4: Update Page Links
```html
<!-- Find -->
<a class="login-btn" href="login.html">Log in</a>
<a class="signup-button" href="signup.html">Sign up</a>
<button onclick="window.location.href='signup.html'">
<button onclick="window.location.href='map.html'">

<!-- Replace with -->
<a class="login-btn" href="pages/login.html">Log in</a>
<a class="signup-button" href="pages/signup.html">Sign up</a>
<button onclick="window.location.href='pages/signup.html'">
<button onclick="window.location.href='pages/map.html'">
```

## Phase 3: Update All Files in docs/pages/ (10 minutes)

For EACH HTML file in `docs/pages/`, make these changes:

### Change 1: Update CSS Path (ALL FILES)
```html
<!-- Find -->
<link rel="stylesheet" href="../assets/css/styles.css">

<!-- Replace with -->
<link rel="stylesheet" href="../assets/styles/styles.css">
```

### Change 2: Update Home Links (ALL FILES)
```html
<!-- Find -->
<a href="index.html">
onclick="window.location.href='index.html'"

<!-- Replace with -->
<a href="../index.html">
onclick="window.location.href='../index.html'"
```

### Change 3: Keep Other Links Same
```html
<!-- These stay the same (same folder) -->
<a href="login.html">
<a href="signup.html">
<a href="dashboard.html">
<a href="map.html">
<!-- etc. -->
```

## Phase 4: Verify Structure (2 minutes)

Run this check:

```bash
# Check structure
ls -R docs/

# Should show:
# docs/
# docs/index.html
# docs/pages/
# docs/pages/[all html files]
# docs/js/
# docs/js/[all js files]
# docs/assets/
# docs/assets/styles/
# docs/assets/styles/styles.css
# docs/assets/icons/
# docs/assets/icons/[all svg files]
```

## Phase 5: Test Locally (5 minutes)

### Test 1: Open docs/index.html
```bash
# Open in browser
open docs/index.html
# or
start docs/index.html
# or just double-click the file
```

### Test 2: Check Console
- Press F12 to open developer tools
- Look for errors (should be none)
- Check Network tab (all files should load)

### Test 3: Test Navigation
- [ ] Click "Log in" button
- [ ] Should go to login page
- [ ] Click logo/home link
- [ ] Should go back to landing page
- [ ] Test all other links

### Test 4: Test Functionality
- [ ] Try to sign up
- [ ] Try to log in
- [ ] View map
- [ ] Submit report
- [ ] Check all features work

## Phase 6: Deploy to GitHub Pages (5 minutes)

### Step 6.1: Commit Changes
```bash
git add docs/
git commit -m "Restructure for GitHub Pages"
git push origin main
```

### Step 6.2: Configure GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll to "Pages" section
4. Under "Source":
   - Branch: `main` (or `master`)
   - Folder: `/docs`
5. Click "Save"

### Step 6.3: Wait for Deployment
- GitHub will build your site (takes 1-2 minutes)
- You'll see a green checkmark when ready
- Your site will be at: `https://username.github.io/repo-name/`

## Phase 7: Test Live Site (3 minutes)

Visit your GitHub Pages URL and test:
- [ ] Landing page loads
- [ ] CSS is applied
- [ ] Images display
- [ ] Navigation works
- [ ] All pages accessible
- [ ] All functionality works

## Quick Reference: File Changes

### docs/index.html:
```
../assets/ → assets/
../js/ → js/
login.html → pages/login.html
signup.html → pages/signup.html
map.html → pages/map.html
```

### docs/pages/*.html:
```
../assets/css/styles.css → ../assets/styles/styles.css
href="index.html" → href="../index.html"
```

## Automated Script (Optional)

Save this as `migrate.sh`:

```bash
#!/bin/bash

echo "Starting migration..."

# Create structure
mkdir -p docs/pages docs/js docs/assets/styles docs/assets/icons

# Copy files
cp pages/*.html docs/pages/
mv docs/pages/index.html docs/
cp js/*.js docs/js/
cp assets/css/styles.css docs/assets/styles/
cp assets/icons/*.svg docs/assets/icons/

# Update docs/index.html
sed -i 's|../assets/|assets/|g' docs/index.html
sed -i 's|../js/|js/|g' docs/index.html
sed -i 's|href="login.html"|href="pages/login.html"|g' docs/index.html
sed -i 's|href="signup.html"|href="pages/signup.html"|g' docs/index.html
sed -i 's|href="map.html"|href="pages/map.html"|g' docs/index.html
sed -i 's|href="dashboard.html"|href="pages/dashboard.html"|g' docs/index.html
sed -i 's|assets/css/styles.css|assets/styles/styles.css|g' docs/index.html

# Update docs/pages/*.html
for file in docs/pages/*.html; do
    sed -i 's|../assets/css/styles.css|../assets/styles/styles.css|g' "$file"
    sed -i 's|href="index.html"|href="../index.html"|g' "$file"
    sed -i 's|window.location.href=.index.html.|window.location.href="../index.html"|g' "$file"
done

echo "Migration complete!"
echo "Test by opening docs/index.html in your browser"
```

Run with:
```bash
chmod +x migrate.sh
./migrate.sh
```

## Troubleshooting

### Problem: CSS not loading
**Solution**: Check path is `assets/styles/styles.css` (not `assets/css/`)

### Problem: Images not showing
**Solution**: Verify icons are in `docs/assets/icons/`

### Problem: 404 on navigation
**Solution**: Check links in docs/index.html include `pages/` prefix

### Problem: Home link doesn't work
**Solution**: In docs/pages/*.html, use `../index.html`

### Problem: GitHub Pages shows 404
**Solution**: 
- Check repository settings (Pages section)
- Ensure `/docs` folder is selected
- Wait 2-3 minutes for deployment
- Check `docs/index.html` exists

## Rollback Plan

If something goes wrong:

```bash
# Delete docs folder
rm -rf docs/

# Restore from git
git checkout docs/

# Or start over
git reset --hard HEAD
```

## Success Criteria

Migration is successful when:
- ✅ `docs/index.html` opens and is styled
- ✅ All navigation works
- ✅ All images display
- ✅ No console errors
- ✅ All functionality works
- ✅ GitHub Pages site is live
- ✅ Live site works identically to local

## Time Estimate

- Phase 1: 5 minutes (create structure, move files)
- Phase 2: 3 minutes (update docs/index.html)
- Phase 3: 10 minutes (update all pages)
- Phase 4: 2 minutes (verify structure)
- Phase 5: 5 minutes (test locally)
- Phase 6: 5 minutes (deploy to GitHub)
- Phase 7: 3 minutes (test live site)

**Total: ~30-35 minutes**

## Final Checklist

- [ ] All files moved to docs/
- [ ] docs/index.html updated
- [ ] All docs/pages/*.html updated
- [ ] Local testing passed
- [ ] Committed to git
- [ ] GitHub Pages configured
- [ ] Live site tested
- [ ] All features working

**You're ready to migrate!** 🚀

---

**Need help?** Refer to:
- `GITHUB_PAGES_STRUCTURE.md` - Detailed structure guide
- `FILE_UPDATES_REQUIRED.md` - File-by-file changes
- GitHub Pages documentation
