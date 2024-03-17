import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [cpuTaskRunning, setCpuTaskRunning] = useState(false);
    const [cpuUsage, setCpuUsage] = useState(null);
    const cpuInterval = useRef(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', { username, password });
            alert(response.data.message);
        } catch (error) {
            console.error('Login error', error);
        }
    };

    const increaseCpuUsage = () => {
        if (!cpuTaskRunning) {
            setCpuTaskRunning(true);
            cpuInterval.current = setInterval(() => {
                console.log('CPU-intensive task running');
                for (let i = 0; i < 1e9; i++) {} // Simulate CPU work
            }, 1000);
        }
    };

    const stopCpuUsage = () => {
        if (cpuTaskRunning) {
            clearInterval(cpuInterval.current);
            cpuInterval.current = null;
            setCpuTaskRunning(false);
            console.log('Stopped CPU-intensive task');
        }
    };

    const startBackendCpuLoad = () => {
        axios.post('http://localhost:3000/start-cpu-load')
            .then(() => {
                fetchCpuUsage();
            })
            .catch(error => console.error('Error starting CPU load', error));
    };

    const stopBackendCpuLoad = () => {
        axios.post('http://localhost:3000/stop-cpu-load')
            .then(() => {
                setCpuUsage(null);
                console.log('CPU load stopped');
            })
            .catch(error => console.error('Error stopping CPU load', error));
    };

    const fetchCpuUsage = () => {
        axios.get('http://localhost:3000/cpu-usage')
            .then(response => {
                setCpuUsage(response.data.averageCpuUsage);
                if (cpuUsage !== null) {
                    setTimeout(fetchCpuUsage, 2500); // Fetch CPU usage every 2.5 seconds
                }
            })
            .catch(error => console.error('Error fetching CPU usage', error));
    };

    useEffect(() => {
        if (cpuUsage !== null) {
            const timer = setTimeout(fetchCpuUsage, 5000);
            return () => clearTimeout(timer);
        }
    }, [cpuUsage]);

    return (
        <div className="App">
            <h1>ავტორიზაცია</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label>მომხარებელი:</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>პაროლი:</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="submit">შესვლა</button>
            </form>
            <button onClick={increaseCpuUsage} disabled={cpuTaskRunning}>პროცესორის მოხმარების გაზრდა</button>
            <button onClick={stopCpuUsage} disabled={!cpuTaskRunning}>პროცესორის მოხმარების გაზრდის შეწყვეტა</button>
            <button onClick={startBackendCpuLoad}>პროცესორის მოხმარების გაზრდა Backend</button>
            <button onClick={stopBackendCpuLoad}>პროცესორის მოხმარების გაზრდის შეწყვეტა Backend</button>
            <div>back end CPU Usage: {cpuUsage}%</div>
        </div>
    );
}

export default App;
