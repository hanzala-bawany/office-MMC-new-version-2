module.exports = {
    apps: [
        {
            name: "node-backend",      // ← naam (kuch bhi rakho)
            script: "index.js",        // ← ye file chalao
            interpreter: "node",       // ← node se chalao
            cwd: "D:\\office work\\MMC\\office-MMC-new-version-2\\backend"  // ← is folder mein
        },
        {
            name: "whisper-python",    // ← naam
            script: "vosk_server.py",  // ← ye file chalao
            interpreter: "python",     // ← python se chalao
            cwd: "D:\\office work\\MMC\\office-MMC-new-version-2\\backend"  // ← is folder mein
        }
    ]
}


// start kay liye  pm2 start ecosystem.config.js

// stop kay liye  pm2 stop all