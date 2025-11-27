# GitHub Pages Deployment Checklist

## ✅ Pre-Deployment Verification

### File Structure
- [x] `docs/index.html` exists (landing page)
- [x] `docs/pages/index.html` exists (redirect file)
- [x] All HTML pages are in `docs/pages/`
- [x] All JavaScript files are in `docs/js/`
- [x] All CSS files are in `docs/assets/css/`
- [x] All icons are in `docs/assets/icons/`

### Path Verification
- [x] No absolute paths (no `href="/..."` or `src="/..."`)
- [x] No localhost references
- [x] All paths use relative references
- [x] Logout redirects to `../index.html`
- [x] Home buttons redirect correctly

### File Names
- [x] All files use lowercase names
- [x] No spaces in file names
- [x] Consistent naming convention

## 🚀 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### 2. Configure GitHub Pages
1. Go to repository **Settings**
2. Click **Pages** in sidebar
3. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/docs**
4. Click **Save**

### 3. Wait for Deployment
- GitHub Pages takes 1-2 minutes to build
- Check **Actions** tab for build status
- Look for "pages build and deployment" workflow

### 4. Access Your Site
Your site will be at:
```
https://[your-username].github.io/[repository-name]/
```

## 🧪 Post-Deployment Testing

### Test These URLs:
- [ ] Landing page: `https://[username].github.io/[repo]/`
- [ ] Login: `https://[username].github.io/[repo]/pages/login.html`
- [ ] Signup: `https://[username].github.io/[repo]/pages/signup.html`
- [ ] Dashboard: `https://[username].github.io/[repo]/pages/dashboard.html`

### Test These Features:
- [ ] CSS loads correctly (page is styled)
- [ ] JavaScript loads (check browser console)
- [ ] Images/icons display
- [ ] Navigation between pages works
- [ ] Login functionality works
- [ ] Signup functionality works
- [ ] Logout redirects to home
- [ ] Home button works on all pages
- [ ] Map displays correctly
- [ ] Report form works
- [ ] Alerts page loads

## 🐛 Troubleshooting

### If you see 404 errors:

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Wait 2 minutes** for GitHub Pages to rebuild
3. **Check Actions tab** for build errors
4. **Try incognito mode** to rule out caching
5. **Force refresh** (Ctrl+F5)

### If CSS/JS doesn't load:

1. Open browser console (F12)
2. Check Network tab for failed requests
3. Verify paths in HTML files
4. Check that files exist in repository

### If navigation doesn't work:

1. Check JavaScript console for errors
2. Verify Firebase configuration
3. Test locally first before deploying

## 📝 Common Issues

### Issue: "404 File not found"
**Solution**: 
- Verify GitHub Pages is set to `/docs` folder
- Check file exists in repository
- Verify file name case matches URL

### Issue: Blank page
**Solution**:
- Check browser console for JavaScript errors
- Verify Firebase API keys are correct
- Check that all scripts are loading

### Issue: Styles not applied
**Solution**:
- Verify CSS path in HTML: `href="../assets/css/styles.css"`
- Check that styles.css exists in `docs/assets/css/`
- Clear browser cache

## 🔄 Updating Your Site

After making changes:

1. **Test locally first**
2. **Commit changes**: `git commit -am "Update message"`
3. **Push to GitHub**: `git push origin main`
4. **Wait 1-2 minutes** for rebuild
5. **Clear cache and test**

## ✨ Your Site is Ready!

Once deployed successfully, share your site:
```
https://[your-username].github.io/[repository-name]/
```

Remember to replace `[your-username]` and `[repository-name]` with your actual GitHub username and repository name!

---

**Need help?** Check `GITHUB_PAGES_FIX.md` for detailed troubleshooting steps.
