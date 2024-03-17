const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const os = require('os');

const app = express();
const PORT = 5000;

let cpuLoadInterval = null;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock user for authentication
const user = {
    username: 'testuser',
    password: 'password'
};

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === user.username && password === user.password) {
        res.json({ success: true, message: 'შესვლა განხორციელდა წარმატებით' });
    } else {
        res.json({ success: false, message: 'არასწორი მონაცემი' });
    }
});

// Start CPU load endpoint
app.post('/start-cpu-load', (req, res) => {
    if (!cpuLoadInterval) {
        cpuLoadInterval = setInterval(() => {
            // CPU-intensive task
            for (let i = 0; i < 1e8; i++) {}
        }, 1000);
        res.json({ success: true, message: 'CPU-intensive task started' });
    } else {
        res.json({ success: false, message: 'CPU-intensive task already running' });
    }
});

// Stop CPU load endpoint
app.post('/stop-cpu-load', (req, res) => {
    if (cpuLoadInterval) {
        clearInterval(cpuLoadInterval);
        cpuLoadInterval = null;
        res.json({ success: true, message: 'CPU-intensive task stopped' });
    } else {
        res.json({ success: false, message: 'No CPU-intensive task is running' });
    }
});

// Endpoint to get CPU usage
app.get('/cpu-usage', (req, res) => {
    const cpuUsage = os.cpus().map(cpu => {
        const total = Object.keys(cpu.times).reduce((acc, key) => acc + cpu.times[key], 0);
        return ((total - cpu.times.idle) / total) * 100;
    });
    const averageCpuUsage = cpuUsage.reduce((acc, usage) => acc + usage, 0) / cpuUsage.length;
    res.json({ success: true, averageCpuUsage });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});