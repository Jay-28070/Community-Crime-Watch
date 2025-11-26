# Quick Reference: Rename pages → docs

## ✅ What I've Done

1. **Updated root index.html** - Changed all 3 references from `pages/` to `docs/`

## 🔧 What You Need to Do

### Single Step Required:
```bash
# In your project root directory, run:
mv pages docs
```

Or manually:
- Right-click `pages` folder → Rename → Type `docs` → Enter

## ✅ That's It!

All HTML files in the folder use relative paths (`../`) so they'll work automatically.

## 🧪 Quick Test

After renaming:
1. Open `index.html` in browser
2. Should redirect to `docs/index.html`
3. Click around - everything should work!

## 📁 Before & After

**Before**:
```
project/
├── index.html (references pages/)
├── pages/
│   └── *.html
├── js/
├── assets/
```

**After**:
```
project/
├── index.html (references docs/) ✅ UPDATED
├── docs/ (renamed from pages) ⬅️ YOU DO THIS
│   └── *.html
├── js/
├── assets/
```

## ⚠️ Important Notes

- **Only rename the folder** - Don't change any files inside it
- **All paths will work** - HTML files use `../` which works from any folder name
- **No other changes needed** - JavaScript, CSS, and assets don't reference the folder name

## 🚀 Ready to Deploy

After renaming to `docs/`:
- ✅ GitHub Pages compatible (standard folder name)
- ✅ All links work
- ✅ All assets load
- ✅ All functionality intact

## 🔄 Rollback (if needed)

```bash
mv docs pages
```

Then revert index.html changes (or use git checkout).

---

**Summary**: Rename folder → Test → Done! 🎉
