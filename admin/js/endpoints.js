// ==================== ENDPOINTS SECTION ====================

const ENDPOINTS_API_URL = '/app/info';
let endpointsData = [];
let currentSort = 'most-usage'; // Default sort

// Get yesterday's date in dd-MM-yyyy format
function getYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const year = yesterday.getFullYear();
    const month = String(yesterday.getMonth() + 1).padStart(2, '0');
    const day = String(yesterday.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Return in YYYY-MM-DD for input[type="date"]
}

// Convert YYYY-MM-DD to dd-MM-yyyy for API
function formatDateForAPI(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
}

// Get response time class
function getResponseTimeClass(time) {
    if (time < 100) return 'response-fast';
    if (time < 200) return 'response-medium';
    return 'response-slow';
}

// Sort endpoints based on current filter
function sortEndpoints(data, sortType) {
    const sorted = [...data];

    switch(sortType) {
        case 'most-usage':
            return sorted.sort((a, b) => b.totalReqPerDay - a.totalReqPerDay);
        case 'least-usage':
            return sorted.sort((a, b) => a.totalReqPerDay - b.totalReqPerDay);
        case 'success-rate':
            return sorted.sort((a, b) => (b.successRate || 0) - (a.successRate || 0));
        case 'failure-rate':
            return sorted.sort((a, b) => (b.failureRate || 0) - (a.failureRate || 0));
        case 'fastest':
            return sorted.sort((a, b) => a.avgResponseTime - b.avgResponseTime);
        case 'slowest':
            return sorted.sort((a, b) => b.avgResponseTime - a.avgResponseTime);
        default:
            return sorted.sort((a, b) => b.totalReqPerDay - a.totalReqPerDay);
    }
}

// Render endpoints table
function renderEndpointsTable(data) {
    const tbody = document.getElementById('endpointsBody');
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-state">
                        <div class="empty-state-icon">📊</div>
                        <div class="empty-state-title">No Endpoints Data</div>
                        <div class="empty-state-description">No endpoint data available for this date.</div>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    data.forEach((endpoint, index) => {
        // Main row
        const row = document.createElement('tr');
        row.classList.add('endpoint-row');
        row.dataset.index = index;

        const responseClass = getResponseTimeClass(endpoint.avgResponseTime);

        row.innerHTML = `
            <td class="rank-cell">#${index + 1}</td>
            <td><span class="method-badge method-${endpoint.method}">${endpoint.method}</span></td>
            <td class="path-cell">${endpoint.path}</td>
            <td class="response-time ${responseClass}">${endpoint.avgResponseTime}ms</td>
            <td><span class="expand-icon">▶</span></td>
        `;

        tbody.appendChild(row);

        // Details row (hidden by default)
        const detailsRow = document.createElement('tr');
        detailsRow.classList.add('details-row');
        detailsRow.dataset.index = index;

        detailsRow.innerHTML = `
            <td colspan="5" class="details-cell">
                <div class="details-content">
                    <div class="detail-item">
                        <div class="detail-label">Total Calls</div>
                        <div class="detail-value">${endpoint.totalReqPerDay ? endpoint.totalReqPerDay.toLocaleString() : '0'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Avg Response Time</div>
                        <div class="detail-value ${responseClass}">${endpoint.avgResponseTime}ms</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Success Rate</div>
                        <div class="detail-value success-rate">${endpoint.successRate ? endpoint.successRate.toFixed(2) : '0.00'}%</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Failure Rate</div>
                        <div class="detail-value failure-rate">${endpoint.failureRate ? endpoint.failureRate.toFixed(2) : '0.00'}%</div>
                    </div>
                    <div class="detail-item" style="grid-column: span 2;">
                        <div class="detail-label">Peak Hours</div>
                        <div class="peak-hours">
                            ${endpoint.peakHours && endpoint.peakHours.length > 0
            ? endpoint.peakHours.map(hour => `<span class="hour-badge">${hour}</span>`).join('')
            : '<span style="color: #999;">No data</span>'}
                        </div>
                    </div>
                </div>
            </td>
        `;

        tbody.appendChild(detailsRow);

        // Add click event to toggle details
        row.addEventListener('click', () => {
            const isExpanded = row.classList.contains('expanded');

            // Close all other expanded rows
            document.querySelectorAll('.endpoint-row').forEach(r => {
                r.classList.remove('expanded');
            });
            document.querySelectorAll('.details-row').forEach(d => {
                d.classList.remove('show');
            });

            // Toggle current row
            if (!isExpanded) {
                row.classList.add('expanded');
                detailsRow.classList.add('show');
            }
        });
    });
}

// Load endpoints data
async function loadEndpointsData(useInstant = false) {
    try {
        renderEndpointsSection();

        let apiUrl;
        if (useInstant) {
            apiUrl = `${ENDPOINTS_API_URL}/instant`;
        } else {
            const datePicker = document.getElementById('endpointsDatePicker');
            const selectedDate = datePicker.value;
            const formattedDate = formatDateForAPI(selectedDate);
            apiUrl = `${ENDPOINTS_API_URL}/${formattedDate}`;
        }

        const data = await apiCall(apiUrl, {
            method: 'GET'
        });

        endpointsData = data.endpoints || [];
        const sortedData = sortEndpoints(endpointsData, currentSort);

        renderEndpointsTable(sortedData);

    } catch (error) {
        console.error('Error loading endpoints data:', error);

        let errorMessage = error.message;
        let errorIcon = '⚠️';

        if (errorMessage.includes('No daily report found')) {
            errorMessage = 'No data available for this date. Try selecting a different date or get today\'s instant data.';
            errorIcon = '📭';
        }

        showToast('Failed to load endpoints data: ' + errorMessage, 'error');

        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>Endpoints Monitor</h1>
            </div>
            <div class="empty-state">
                <div class="empty-state-icon">${errorIcon}</div>
                <div class="empty-state-title">Error Loading Data</div>
                <div class="empty-state-description">${errorMessage}</div>
            </div>
        `;
    }
}

// Handle filter change
function handleEndpointsFilter(filterValue) {
    currentSort = filterValue;
    const sortedData = sortEndpoints(endpointsData, currentSort);
    renderEndpointsTable(sortedData);

    // Update button text and close dropdown
    const filterBtn = document.getElementById('endpointsFilterBtn');
    const filterOptions = {
        'most-usage': 'Most Usage',
        'least-usage': 'Least Usage',
        'success-rate': 'Success Rate',
        'failure-rate': 'Failure Rate'
    };
    filterBtn.innerHTML = `${filterOptions[filterValue]} <span class="filter-arrow">▼</span>`;

    // Close dropdown
    document.getElementById('endpointsFilterDropdown').classList.remove('show');
}

// Toggle filter dropdown
function toggleFilterDropdown() {
    const dropdown = document.getElementById('endpointsFilterDropdown');
    dropdown.classList.toggle('show');
}

// Render endpoints section
function renderEndpointsSection() {
    const mainContent = document.getElementById('mainContent');
    const yesterday = getYesterdayDate();

    mainContent.innerHTML = `
        <div class="content-header">
            <h1>Endpoints Monitor</h1>
            <div class="endpoints-controls">
                <div class="date-control">
                    <label for="endpointsDatePicker">📅 Select Date:</label>
                    <input type="date" id="endpointsDatePicker" class="fancy-date-picker" value="${yesterday}">
                    <button class="instant-btn" onclick="event.preventDefault(); loadEndpointsData(true)">
                        ⚡ Get Instant
                    </button>
                </div>
            </div>
        </div>

        <div class="table-container">
            <table class="endpoints-table" id="endpointsTable">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Method</th>
                        <th>Path</th>
                        <th>
                            <div class="th-with-filter-container">
                                <span>Avg Response Time</span>
                                <button class="filter-btn-inline" id="endpointsFilterBtn" onclick="event.stopPropagation(); toggleFilterDropdown()">
                                    Most Usage ▼
                                </button>
                            </div>
                            <div class="filter-dropdown" id="endpointsFilterDropdown">
                                <div class="filter-option" onclick="handleEndpointsFilter('most-usage')">
                                    📈 Most Usage
                                </div>
                                <div class="filter-option" onclick="handleEndpointsFilter('least-usage')">
                                    📉 Least Usage
                                </div>
                                <div class="filter-option" onclick="handleEndpointsFilter('success-rate')">
                                    ✅ Success Rate
                                </div>
                                <div class="filter-option" onclick="handleEndpointsFilter('failure-rate')">
                                    ❌ Failure Rate
                                </div>
                            </div>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="endpointsBody">
                </tbody>
            </table>
        </div>
    `;

    // Add date picker event listener with proper event handling
    const datePicker = document.getElementById('endpointsDatePicker');
    datePicker.addEventListener('change', (e) => {
        e.stopPropagation();
        loadEndpointsData(false);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('endpointsFilterDropdown');
        const filterBtn = document.getElementById('endpointsFilterBtn');
        if (dropdown && !dropdown.contains(e.target) && e.target !== filterBtn && !filterBtn.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

// Register this section with main navigation immediately
window.registerSectionRenderer = window.registerSectionRenderer || function() {};
registerSectionRenderer('endpoints', () => loadEndpointsData(false));

// Export functions
window.loadEndpointsData = loadEndpointsData;
window.handleEndpointsFilter = handleEndpointsFilter;
window.toggleFilterDropdown = toggleFilterDropdown;