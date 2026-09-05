const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simulated endpoint to fetch world directory size & player metrics
app.get('/api/server-stats', (req, res) => {
    // Replace with the actual path to your Minecraft world directory
    const worldPath = path.join(__dirname, 'world'); 
    
    let totalSizeGB = 0;
    try {
        // Quick approximation or logic to check folder size
        totalSizeGB = getFolderSizeInGB(worldPath);
    } catch (e) {
        totalSizeGB = 0.85; // Fallback mock value representing a massive world
    }

    res.json({
        serverName: "Anarchy 1TB Test Bed",
        status: "Online",
        playersOnline: 24,
        worldSizeGB: totalSizeGB.toFixed(2),
        maxStorageGB: 1000, // 1TB target limit
        tps: 19.4
    });
});

function getFolderSizeInGB(dirPath) {
    let stats = 0;
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                stats += getFolderSizeInGB(filePath);
            } else {
                stats += stat.size;
            }
        });
    }
    return stats / (1024 * 1024 * 1024);
}

app.listen(PORT, () => {
    console.log(`Anarchy dashboard backend running on port ${PORT}`);
});