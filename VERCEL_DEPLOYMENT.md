# 🚀 Deploy to Vercel - Step by Step Guide

Your QR Code system is ready for Vercel deployment! Follow these simple steps:

## 🌐 Method 1: GitHub + Vercel (Recommended)

### Step 1: Push to GitHub (if not done already)
```bash
git add .
git commit -m "Ready for Vercel deployment"  
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. **Import** your `QR-Code` repository
5. Click **"Deploy"** 

### Step 3: Get Your Live URL
After deployment (2-3 minutes), you'll get:
```
https://qr-code-[random].vercel.app
```

### Step 4: Update URLs in Your Code
Replace `your-project-name.vercel.app` with your actual Vercel URL in:
- `hdfc-qr.html` (2 places)

---

## ⚡ Method 2: Direct Upload (Drag & Drop)

### Step 1: Prepare Files
1. Create a folder with your 6 files:
   - `universal-collector.html`
   - `hdfc-qr.html` 
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. **Drag and drop** your folder
4. Click **"Deploy"**

---

## 🔧 After Deployment

### Update Your URLs
Once deployed, replace in `hdfc-qr.html`:
```javascript
// FROM:
const baseUrl = 'https://your-project-name.vercel.app/universal-collector.html';

// TO: 
const baseUrl = 'https://YOUR-ACTUAL-VERCEL-URL.vercel.app/universal-collector.html';
```

### Your Live URLs Will Be:
- **QR Generator**: `https://your-url.vercel.app/hdfc-qr.html`
- **Admin Panel**: `https://your-url.vercel.app/universal-collector.html?admin=true`
- **Homepage**: `https://your-url.vercel.app/`

---

## ✅ Vercel Benefits

- ✅ **Instant deployment** - Live in 2 minutes
- ✅ **Auto HTTPS** - Secure by default  
- ✅ **Global CDN** - Fast worldwide
- ✅ **Free plan** - Perfect for your needs
- ✅ **Auto deployments** - Updates when you push to GitHub
- ✅ **Custom domains** - Can add your own domain later

---

## 📱 Testing After Deployment

1. **Visit your QR generator**: `https://your-url.vercel.app/hdfc-qr.html`
2. **Scan the QR code** with your phone
3. **Check data collection**: Visit admin panel
4. **Download CSV** with collected data

---

## 🎯 Final Result

Your QR code system will be:
- **Live worldwide** - Anyone can scan from anywhere
- **Lightning fast** - Vercel's global CDN
- **Professional** - Custom domain available
- **Reliable** - 99.9% uptime guarantee

**Ready to deploy? Go to [vercel.com](https://vercel.com) and get started!** 🚀