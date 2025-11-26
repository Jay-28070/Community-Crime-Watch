# Pages → Docs Migration Checklist

## Pre-Migration Verification ✅

### Files Checked:
- ✅ All HTML files in `pages/` use relative paths (`../`)
- ✅ No JavaScript files reference `pages/` folder
- ✅ No CSS files reference `pages/` folder
- ✅ Root `index.html` updated to reference `docs/`

### Path Analysis:
```
HTML files use:
  ../assets/css/styles.css  ✅ Works from any folder
  ../js/script.js           ✅ Works from any folder
  ../assets/icons/logo.svg  ✅ Works from any folder
```

## Migration Steps

### Step 1: Rename Folder ⬜
```bash
mv pages docs
```
- [ ] Folder renamed successfully
- [ ] Folder name is exactly `docs` (lowercase)

### Step 2: Verify Root Index ✅
- [x] Root `index.html` updated (DONE)
- [x] Meta refresh tag updated
- [x] JavaScript redirect updated
- [x] Fallback link updated

## Post-Migration Testing

### Basic Tests:
- [ ] Open `index.html` - redirects to `docs/index.html`
- [ ] Landing page loads correctly
- [ ] All images display
- [ ] CSS styling applied
- [ ] No console errors

### Navigation Tests:
- [ ] Login link works (`docs/login.html`)
- [ ] Signup link works (`docs/signup.html`)
- [ ] Map link works (`docs/map.html`)
- [ ] Dashboard accessible after login

### Asset Loading Tests:
- [ ] CSS file loads (`../assets/css/styles.css`)
- [ ] JavaScript files load (`../js/*.js`)
- [ ] Icons display (`../assets/icons/*.svg`)
- [ ] Favicon shows in browser tab

### Functionality Tests:
- [ ] Login form works
- [ ] Signup form works
- [ ] Google authentication works
- [ ] Map displays correctly
- [ ] Report form loads
- [ ] AI analysis works
- [ ] Police dashboard accessible

### All Pages Tests:
- [ ] `docs/index.html` - Landing page
- [ ] `docs/login.html` - Login page
- [ ] `docs/signup.html` - Signup page
- [ ] `docs/dashboard.html` - User dashboard
- [ ] `docs/dashboardPolice.html` - Police dashboard
- [ ] `docs/map.html` - Crime map
- [ ] `docs/report.html` - Report form
- [ ] `docs/alerts.html` - User alerts
- [ ] `docs/alertsPolice.html` - Police alerts
- [ ] `docs/safety.html` - Safety checker
- [ ] `docs/trends.html` - Crime trends

## Browser Testing

### Desktop Browsers:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

### Mobile Browsers:
- [ ] Mobile Chrome
- [ ] Mobile Safari
- [ ] Mobile Firefox

## Deployment Checklist

### Local Development:
- [ ] Works on localhost
- [ ] All features functional
- [ ] No errors in console

### GitHub Pages (if applicable):
- [ ] Repository settings updated to serve from `docs/`
- [ ] Changes committed and pushed
- [ ] Site accessible at GitHub Pages URL
- [ ] All pages load correctly

### Other Hosting:
- [ ] `docs/` folder uploaded
- [ ] Root `index.html` uploaded
- [ ] All assets uploaded
- [ ] Site accessible at domain

## Rollback Plan

If issues occur:

### Quick Rollback:
```bash
# 1. Rename folder back
mv docs pages

# 2. Revert index.html
git checkout index.html
# OR manually change "docs/" back to "pages/"
```

### Verification After Rollback:
- [ ] Site works as before
- [ ] All links functional
- [ ] No broken assets

## Files Modified

### Changed Files (1):
1. ✅ `index.html` (root)
   - Line 5: `pages/index.html` → `docs/index.html`
   - Line 8: `pages/index.html` → `docs/index.html`
   - Line 13: `pages/index.html` → `docs/index.html`

### Unchanged Files (All Others):
- ✅ All HTML files in docs/ (use relative paths)
- ✅ All JavaScript files (no folder references)
- ✅ All CSS files (no folder references)
- ✅ All asset files (no folder references)

## Success Criteria

Migration is successful when:
- ✅ All pages load without errors
- ✅ All navigation works
- ✅ All assets load correctly
- ✅ All functionality works
- ✅ No console errors
- ✅ Mobile responsive
- ✅ Cross-browser compatible

## Notes

### Why This Works:
- HTML files use `../` for relative paths
- Relative paths work from any folder name
- Only root index.html references the folder name
- No hardcoded paths in JavaScript or CSS

### Benefits of `docs/`:
- ✅ GitHub Pages standard folder
- ✅ Clear purpose (documentation/pages)
- ✅ Professional naming convention
- ✅ Easy to understand structure

## Sign-Off

- [ ] Migration completed
- [ ] All tests passed
- [ ] No errors found
- [ ] Ready for production

**Date**: _______________
**Tested by**: _______________
**Status**: ⬜ Pending / ✅ Complete

---

## Quick Command Reference

```bash
# Rename folder
mv pages docs

# Test locally
# Open index.html in browser

# Commit changes (if using git)
git add .
git commit -m "Rename pages to docs"
git push

# Rollback if needed
mv docs pages
git checkout index.html
```

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify folder name is exactly `docs`
3. Clear browser cache (Ctrl+Shift+R)
4. Check all paths use `../` not absolute paths
5. Refer to RENAME_TO_DOCS_GUIDE.md for details

---

**Status**: Ready for migration! 🚀
**Risk Level**: Very Low ✅
**Estimated Time**: < 2 minutes
**Rollback**: Easy
