// ==================== ACTIVE USERS SECTION ====================

const ACTIVE_USERS_API_URL = '/admin/active-users';

// Format seconds to readable time
function formatDuration(seconds) {
    if (!seconds) return '0s';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

// Format timestamp
function formatTimestamp(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get user initials
function getUserInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

// Render users table
function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');

    if (!users || users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <div class="empty-state-icon">👥</div>
                        <div class="empty-state-title">No Active Users</div>
                        <div class="empty-state-description">There are no active users for the selected date.</div>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div class="user-info">
                    <div class="user-avatar">${getUserInitials(user.userName)}</div>
                    <div class="user-details">
                        <div class="user-name">${user.userName}</div>
                        <div class="user-email">${user.email}</div>
                    </div>
                </div>
            </td>
            <td>
                <span class="org-name">${user.organizationName}</span>
            </td>
            <td>
                <span class="status-badge status-${user.status}">
                    <span class="status-dot"></span>
                    ${user.status}
                </span>
            </td>
            <td>
                <span class="timestamp">${formatTimestamp(user.sessionStart)}</span>
            </td>
            <td>
                <span class="timestamp">${formatTimestamp(user.lastActivity)}</span>
            </td>
            <td>
                <span class="time-display">${formatDuration(user.totalTimeSpent)}</span>
            </td>
        </tr>
    `).join('');
}

// Update stats
function updateActiveUsersStats(data) {
    document.getElementById('currentActiveCount').textContent = data.currentActiveCount || 0;
    document.getElementById('totalSessionsToday').textContent = data.totalSessionsToday || 0;
    document.getElementById('avgSessionDuration').textContent = formatDuration(data.avgSessionDuration || 0);
}

// Load active users data
async function loadActiveUsersData() {
    try {
        // Render the section first to create the date picker
        renderActiveUsersSection();

        // Now get the date from the picker (it exists now)
        const datePicker = document.getElementById('activeUsersDatePicker');
        const dateValue = datePicker.value; // It's already set to today in renderActiveUsersSection
        const [year, month, day] = dateValue.split('-');
        const selectedDate = `${day}-${month}-${year}`;

        const data = await apiCall(`${ACTIVE_USERS_API_URL}/${selectedDate}`, {
            method: 'GET'
        });

        renderUsersTable(data.activeUsers);
        updateActiveUsersStats(data);

        // Setup auto-refresh every 60 seconds
        if (window.autoRefreshInterval) {
            clearInterval(window.autoRefreshInterval);
        }
        window.autoRefreshInterval = setInterval(() => {
            if (document.querySelector('.nav-item.active').getAttribute('data-section') === 'active-users') {
                loadActiveUsersDataSilent(selectedDate);
            }
        }, 60000);

    } catch (error) {
        console.error('Error loading active users:', error);
        showToast('Failed to load active users: ' + error.message, 'error');

        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <div class="empty-state-title">Error Loading Data</div>
                <div class="empty-state-description">${error.message}</div>
            </div>
        `;
    }
}

// Load data silently (for auto-refresh)
async function loadActiveUsersDataSilent(selectedDate) {
    try {
        const data = await apiCall(`${ACTIVE_USERS_API_URL}/${selectedDate}`, {
            method: 'GET'
        });

        renderUsersTable(data.activeUsers);
        updateActiveUsersStats(data);
    } catch (error) {
        console.error('Silent refresh failed:', error);
    }
}

// Render active users section
function renderActiveUsersSection() {
    const mainContent = document.getElementById('mainContent');
    const today = new Date().toISOString().split('T')[0];

    mainContent.innerHTML = `
        <div class="content-header">
            <h1>Active Users</h1>
            <div class="header-actions">
                <input type="date" id="activeUsersDatePicker" class="date-picker" value="${today}">
                <button class="refresh-btn" onclick="loadActiveUsersData()">
                    <span>🔄</span>
                    <span>Refresh</span>
                </button>
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">🟢</div>
                <div class="stat-label">Currently Active</div>
                <div class="stat-value" id="currentActiveCount">-</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-label">Total Sessions Today</div>
                <div class="stat-value" id="totalSessionsToday">-</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">⏱️</div>
                <div class="stat-label">Avg Session Duration</div>
                <div class="stat-value" id="avgSessionDuration">-</div>
            </div>
        </div>

        <div class="users-container" style="position: relative;">
            <table class="users-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Organization</th>
                        <th>Status</th>
                        <th>Session Start</th>
                        <th>Last Activity</th>
                        <th>Time Spent</th>
                    </tr>
                </thead>
                <tbody id="usersTableBody">
                </tbody>
            </table>
        </div>
    `;

    // Add date picker event listener
    document.getElementById('activeUsersDatePicker').addEventListener('change', () => {
        loadActiveUsersData();
    });
}

// Register this section with main navigation immediately
window.registerSectionRenderer = window.registerSectionRenderer || function() {};
registerSectionRenderer('active-users', loadActiveUsersData);

// Export function for refresh button
window.loadActiveUsersData = loadActiveUsersData;