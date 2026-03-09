// Settings Page JavaScript

// Functions for settings page
async function loadSystemInfo() {
    // Test database connection
    await testDatabaseConnection();
    
    // Test API endpoints
    await testApiEndpoints();
    
    // Get basic system info
    getSystemInfo();
    
    // Load database stats
    await loadDatabaseStats();
}

async function testDatabaseConnection() {
    try {
        const token = localStorage.getItem('token');
        
        const startTime = Date.now();
        const response = await fetch('/api/health/database', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (response.ok) {
            const data = await response.json();
            document.getElementById('db-status').textContent = 'CONNECTED';
            document.getElementById('db-status').className = 'info-value status-indicator connected';
            document.getElementById('db-pool').textContent = data.pool || 'N/A';
            document.getElementById('db-tables').textContent = data.tables || 'N/A';
        } else {
            document.getElementById('db-status').textContent = 'FAILED';
            document.getElementById('db-status').className = 'info-value status-indicator failed';
            document.getElementById('db-pool').textContent = 'N/A';
            document.getElementById('db-tables').textContent = 'N/A';
        }
    } catch (error) {
        console.error('Database test error:', error);
        document.getElementById('db-status').textContent = 'ERROR';
        document.getElementById('db-status').className = 'info-value status-indicator failed';
    }
}

async function testApiEndpoints() {
    try {
        const token = localStorage.getItem('token');
        const startTime = Date.now();
        
        const response = await fetch('/api/health/api', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (response.ok) {
            const data = await response.json();
            document.getElementById('api-status').textContent = 'ACTIVE';
            document.getElementById('api-status').className = 'info-value status-indicator connected';
            document.getElementById('api-response').textContent = `${responseTime}ms`;
            document.getElementById('api-endpoints').textContent = data.endpoints || 'N/A';
        } else {
            document.getElementById('api-status').textContent = 'FAILED';
            document.getElementById('api-status').className = 'info-value status-indicator failed';
        }
    } catch (error) {
        console.error('API test error:', error);
        document.getElementById('api-status').textContent = 'ERROR';
        document.getElementById('api-status').className = 'info-value status-indicator failed';
    }
}

function getSystemInfo() {
    // For now, we'll simulate system info
    document.getElementById('server-status').textContent = 'RUNNING';
    document.getElementById('server-status').className = 'info-value status-indicator connected';
    document.getElementById('memory-usage').textContent = '45%';
    document.getElementById('cpu-usage').textContent = '23%';
}

async function refreshSystemInfo() {
    await loadSystemInfo();
}

async function loadDatabaseStats() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const stats = await response.json();
            document.getElementById('total-citizens').textContent = stats.totalCitizens || 0;
            document.getElementById('total-complaints').textContent = stats.totalComplaints || 0;
            document.getElementById('total-admins').textContent = stats.totalAdmins || 0;
        } else {
            document.getElementById('total-citizens').textContent = 'ERROR';
            document.getElementById('total-complaints').textContent = 'ERROR';
            document.getElementById('total-admins').textContent = 'ERROR';
        }
    } catch (error) {
        console.error('Database stats error:', error);
        document.getElementById('total-citizens').textContent = 'ERROR';
        document.getElementById('total-complaints').textContent = 'ERROR';
        document.getElementById('total-admins').textContent = 'ERROR';
    }
}

async function runDatabaseMaintenance() {
    if (confirm('Are you sure you want to run database maintenance? This may take a few minutes.')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/maintenance', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Database maintenance completed successfully!');
                await loadDatabaseStats();
            } else {
                alert('Database maintenance failed. Please check server logs.');
            }
        } catch (error) {
            console.error('Maintenance error:', error);
            alert('Error running database maintenance. Please try again.');
        }
    }
}

async function backupDatabase() {
    if (confirm('Are you sure you want to backup the database? This may take a few minutes.')) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/admin/backup', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert('Database backup completed successfully!');
            } else {
                alert('Database backup failed. Please check server logs.');
            }
        } catch (error) {
            console.error('Backup error:', error);
            alert('Error backing up database. Please try again.');
        }
    }
}