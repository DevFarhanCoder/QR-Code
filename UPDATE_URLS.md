# 🔧 After GitHub Deployment - Update URLs

## ⚠️ IMPORTANT: Update These URLs After Deployment

Once your GitHub Pages site is live, you need to replace the placeholder URLs with your actual GitHub Pages URL.

### 🔍 Find and Replace:

**In `hdfc-qr.html` file:**
```javascript
// CHANGE THIS LINE:
const baseUrl = 'https://yourusername.github.io/repo-name/universal-collector.html';

// TO YOUR ACTUAL URL:
const baseUrl = 'https://YOUR-ACTUAL-USERNAME.github.io/YOUR-ACTUAL-REPO-NAME/universal-collector.html';
```

**Also update the admin panel link:**
```html
<!-- CHANGE THIS: -->
https://yourusername.github.io/repo-name/universal-collector.html?admin=true

<!-- TO YOUR ACTUAL URL: -->
https://YOUR-ACTUAL-USERNAME.github.io/YOUR-ACTUAL-REPO-NAME/universal-collector.html?admin=true
```

### 📝 Example:
If your GitHub username is `john123` and repository is `qr-collector`, then:
- Replace: `yourusername.github.io/repo-name`
- With: `john123.github.io/qr-collector`

### ✅ After Updates:
1. Your QR code will point to the live site
2. Data collection will work from anywhere
3. Admin panel will be accessible online
4. No more localhost issues!

---
**Remember to update these URLs after your site goes live!** 🚀