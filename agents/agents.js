// ==================== AGENTS PAGE LOGIC ====================
let availableVersions = [];


// ==================== UPDATE UI TRANSLATIONS ====================

function updateAgentsPageTranslations() {
    // Update page header
    const pageTitle = document.querySelector('#agentsPage .page-header h1');
    if (pageTitle) pageTitle.textContent = t('agentsPage.title');

    const pageSubtitle = document.querySelector('#agentsPage .page-subtitle');
    if (pageSubtitle) pageSubtitle.textContent = t('agentsPage.subtitle');

    // Update Available Versions section
    const versionsTitle = document.querySelector('.agents-section-fixed .section-header h2');
    if (versionsTitle) {
        const svg = versionsTitle.querySelector('svg');
        versionsTitle.innerHTML = '';
        versionsTitle.appendChild(svg);
        versionsTitle.appendChild(document.createTextNode(t('agentsPage.versionsSection.title')));
    }

    const versionsLoadingText = document.querySelector('#versionsLoadingState p');
    if (versionsLoadingText) versionsLoadingText.textContent = t('agentsPage.versionsSection.loading');

    const versionsErrorText = document.querySelector('#versionsErrorState p');
    if (versionsErrorText) versionsErrorText.textContent = t('agentsPage.versionsSection.error');

    const versionsRetryBtn = document.querySelector('#versionsErrorState .retry-btn');
    if (versionsRetryBtn) {
        const svg = versionsRetryBtn.querySelector('svg');
        versionsRetryBtn.innerHTML = '';
        versionsRetryBtn.appendChild(svg);
        versionsRetryBtn.appendChild(document.createTextNode(t('agentsPage.versionsSection.retry')));
    }

    const selectLabel = document.querySelector('.version-select-wrapper .select-label');
    if (selectLabel) selectLabel.textContent = t('agentsPage.versionsSection.selectLabel');

    const selectPlaceholder = document.querySelector('#versionSelect option[value=""]');
    if (selectPlaceholder) selectPlaceholder.textContent = t('agentsPage.versionsSection.selectPlaceholder');

    const downloadBtn = document.getElementById('downloadSelectedBtn');
    if (downloadBtn && !downloadBtn.classList.contains('downloading')) {
        const svg = downloadBtn.querySelector('svg');
        if (svg) {
            downloadBtn.innerHTML = '';
            downloadBtn.appendChild(svg);
            downloadBtn.appendChild(document.createTextNode(t('agentsPage.versionsSection.download')));
        }
    }

    // Update Download History section
    const historyTitle = document.querySelector('.agents-section-history .section-header h2');
    if (historyTitle) {
        const svg = historyTitle.querySelector('svg');
        historyTitle.innerHTML = '';
        historyTitle.appendChild(svg);
        historyTitle.appendChild(document.createTextNode(t('agentsPage.historySection.title')));
    }

    const historyLoadingText = document.querySelector('#historyLoadingState p');
    if (historyLoadingText) historyLoadingText.textContent = t('agentsPage.historySection.loading');

    const historyErrorText = document.querySelector('#historyErrorState p');
    if (historyErrorText) historyErrorText.textContent = t('agentsPage.historySection.error');

    const historyRetryBtn = document.querySelector('#historyErrorState .retry-btn');
    if (historyRetryBtn) {
        const svg = historyRetryBtn.querySelector('svg');
        historyRetryBtn.innerHTML = '';
        historyRetryBtn.appendChild(svg);
        historyRetryBtn.appendChild(document.createTextNode(t('agentsPage.historySection.retry')));
    }

    const historyEmptyText = document.querySelector('#historyEmptyState p');
    if (historyEmptyText) historyEmptyText.textContent = t('agentsPage.historySection.empty');

    const historyEmptyHint = document.querySelector('#historyEmptyState small');
    if (historyEmptyHint) historyEmptyHint.textContent = t('agentsPage.historySection.emptyHint');

    // Update table headers
    const tableHeaders = document.querySelectorAll('.history-table thead th');
    if (tableHeaders[0]) tableHeaders[0].textContent = t('agentsPage.historySection.tableHeaders.version');
    if (tableHeaders[1]) tableHeaders[1].textContent = t('agentsPage.historySection.tableHeaders.downloadedBy');
    if (tableHeaders[2]) tableHeaders[2].textContent = t('agentsPage.historySection.tableHeaders.downloadDate');
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Format file size from bytes to human readable
 */
function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return t('agentsPage.time.unknownSize');

    const units = ['B', 'KB', 'MB', 'GB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + units[i];
}

/**
 * Format date to readable string
 */
function formatDate(dateString) {
    if (!dateString) return t('agentsPage.time.notProvided');

    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        // Less than 1 hour ago
        if (diffMins < 60) {
            return diffMins === 0 ? t('agentsPage.time.justNow') : `${diffMins} ${t('agentsPage.time.minAgo')}`;
        }

        // Less than 24 hours ago
        if (diffHours < 24) {
            return `${diffHours} ${diffHours > 1 ? t('agentsPage.time.hoursAgo') : t('agentsPage.time.hourAgo')}`;
        }

        // Less than 7 days ago
        if (diffDays < 7) {
            return `${diffDays} ${diffDays > 1 ? t('agentsPage.time.daysAgo') : t('agentsPage.time.dayAgo')}`;
        }

        // Format as date
        const currentLang = window.i18n.getCurrentLanguage();

        // Uzbek locale isn't well supported, format manually
        if (currentLang === 'uz') {
            const months = ['yan', 'fev', 'mar', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek'];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();

            return `${day} ${month}. ${year}`;
        }

        return date.toLocaleDateString(currentLang === 'ru' ? 'ru-RU' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return t('agentsPage.time.invalidDate');
    }
}

/**
 * Format date with time
 */
function formatDateTime(dateString) {
    if (!dateString) return t('agentsPage.time.notProvided');

    try {
        const date = new Date(dateString);
        const currentLang = window.i18n.getCurrentLanguage();

        // Uzbek locale isn't well supported, so we format manually
        if (currentLang === 'uz') {
            const months = ['yan', 'fev', 'mar', 'apr', 'may', 'iyun', 'iyul', 'avg', 'sen', 'okt', 'noy', 'dek'];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');

            return `${day} ${month}. ${year}, ${hours}:${minutes}`;
        }

        // For English and Russian, use built-in locale formatting
        return date.toLocaleString(currentLang === 'ru' ? 'ru-RU' : 'en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting datetime:', error);
        return t('agentsPage.time.invalidDate');
    }
}
// ==================== LOAD AVAILABLE VERSIONS ====================

async function loadAvailableVersions() {
    console.log('Loading available agent versions...');

    const loadingState = document.getElementById('versionsLoadingState');
    const errorState = document.getElementById('versionsErrorState');
    const container = document.getElementById('versionsContainer');

    // Show loading
    loadingState.style.display = 'block';
    errorState.style.display = 'none';
    container.style.display = 'none';

    try {
        // Use apiCall instead of raw fetch
        const versions = await apiCall('/jar');

        console.log('Available versions:', versions);

        // Store versions globally
        availableVersions = versions;

        // Display versions in dropdown
        displayVersionsDropdown(versions);

    } catch (error) {
        console.error('Error loading versions:', error);
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
        showToast(t('agentsPage.toasts.loadVersionsError'), 'error');
    }
}

function displayVersionsDropdown(versions) {
    const loadingState = document.getElementById('versionsLoadingState');
    const container = document.getElementById('versionsContainer');
    const selectElement = document.getElementById('versionSelect');
    const downloadBtn = document.getElementById('downloadSelectedBtn');

    // Hide loading
    loadingState.style.display = 'none';

    if (!versions || versions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 8v4"></path>
                    <path d="M12 16h.01"></path>
                </svg>
                <p>${t('agentsPage.versionsSection.noVersions')}</p>
                <small>${t('agentsPage.versionsSection.noVersionsHint')}</small>
            </div>
        `;
        container.style.display = 'block';
        return;
    }

    // Clear existing options except the first placeholder
    selectElement.innerHTML = `<option value="">${t('agentsPage.versionsSection.selectPlaceholder')}</option>`;

    // Add version options
    versions.forEach(version => {
        const option = document.createElement('option');
        option.value = version.version;

        // Format option text with version, size, and date
        const sizeText = formatFileSize(version.sizeInBytes);
        const dateText = formatDate(version.releaseDate);
        option.textContent = `DB Agent v${version.version} - ${sizeText} - ${dateText}`;

        selectElement.appendChild(option);
    });

    // Show container
    container.style.display = 'block';

    // Enable/disable download button based on selection
    selectElement.addEventListener('change', () => {
        downloadBtn.disabled = !selectElement.value;
    });
}

// ==================== DOWNLOAD SELECTED VERSION ====================

async function downloadSelectedVersion() {
    const selectElement = document.getElementById('versionSelect');
    const selectedVersion = selectElement.value;

    if (!selectedVersion) {
        showToast(t('agentsPage.toasts.selectVersion'), 'error');
        return;
    }

    console.log('Downloading version:', selectedVersion);

    const downloadBtn = document.getElementById('downloadSelectedBtn');
    const originalContent = downloadBtn.innerHTML;

    // Disable button and show loading
    downloadBtn.disabled = true;
    downloadBtn.classList.add('downloading');
    downloadBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        ${t('agentsPage.versionsSection.downloading')}
    `;

    try {
        const fileName = `db-agent-${selectedVersion}.jar`;

        console.log('Starting download for:', fileName);

        // Ensure valid token
        const token = await ensureValidToken();

        // Use XMLHttpRequest for better control over large file downloads
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${API_BASE}/download-app/${encodeURIComponent(fileName)}`, true);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.responseType = 'blob';

        // Progress tracking (optional)
        xhr.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                console.log(`Download progress: ${percentComplete.toFixed(2)}%`);
            }
        };

        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('Download completed, creating blob...');

                // Create blob from response
                const blob = xhr.response;

                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();

                // Cleanup
                setTimeout(() => {
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                }, 100);

                console.log('File download triggered successfully');

                // Update button
                downloadBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    ${t('agentsPage.versionsSection.downloaded')}
                `;

                showToast(`DB Agent v${selectedVersion} ${t('agentsPage.toasts.downloadSuccess')}`, 'success');

                // Reload history after 1 second
                setTimeout(() => {
                    loadDownloadHistory();
                }, 1000);

                // Reset button after 2 seconds
                setTimeout(() => {
                    downloadBtn.disabled = false;
                    downloadBtn.classList.remove('downloading');
                    downloadBtn.innerHTML = originalContent;

                    // Reset select
                    selectElement.value = '';
                    downloadBtn.disabled = true;
                }, 2000);

            } else {
                throw new Error(`Download failed with status: ${xhr.status}`);
            }
        };

        xhr.onerror = function() {
            throw new Error('Network error during download');
        };

        xhr.ontimeout = function() {
            throw new Error('Download timeout');
        };

        // Set a longer timeout for large files (5 minutes)
        xhr.timeout = 300000;

        // Start the download
        xhr.send();

    } catch (error) {
        console.error('Download error:', error);
        showToast(t('agentsPage.toasts.downloadError'), 'error');

        // Reset button
        downloadBtn.disabled = false;
        downloadBtn.classList.remove('downloading');
        downloadBtn.innerHTML = originalContent;
    }
}

// ==================== LOAD DOWNLOAD HISTORY ====================

async function loadDownloadHistory() {
    console.log('Loading download history...');

    const loadingState = document.getElementById('historyLoadingState');
    const errorState = document.getElementById('historyErrorState');
    const emptyState = document.getElementById('historyEmptyState');
    const container = document.getElementById('historyContainer');

    // Show loading
    loadingState.style.display = 'block';
    errorState.style.display = 'none';
    emptyState.style.display = 'none';
    container.style.display = 'none';

    try {
        // Use apiCall instead of raw fetch
        const history = await apiCall('/download-app/history');

        console.log('Download history:', history);

        // Display history
        displayHistory(history);

    } catch (error) {
        console.error('Error loading history:', error);
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
        showToast(t('agentsPage.toasts.loadHistoryError'), 'error');
    }
}

function displayHistory(history) {
    const loadingState = document.getElementById('historyLoadingState');
    const emptyState = document.getElementById('historyEmptyState');
    const container = document.getElementById('historyContainer');
    const tableBody = document.getElementById('historyTableBody');

    // Hide loading
    loadingState.style.display = 'none';

    if (!history || history.length === 0) {
        emptyState.style.display = 'block';
        return;
    }

    // Sort history by download date (newest first)
    const sortedHistory = [...history].sort((a, b) => {
        return new Date(b.downloadDate) - new Date(a.downloadDate);
    });

    // Generate table rows
    const historyRows = sortedHistory.map(item => `
        <tr>
            <td>${item.versionName}</td>
            <td>${item.downloadedBy}</td>
            <td>${formatDateTime(item.downloadDate)}</td>
        </tr>
    `).join('');

    tableBody.innerHTML = historyRows;
    container.style.display = 'block';
}

// ==================== PAGE INITIALIZATION ====================

function initAgentsPage() {
    console.log('Initializing agents page...');

    // Apply translations first
    updateAgentsPageTranslations();

    // Load both sections
    loadAvailableVersions();
    loadDownloadHistory();
}

// Listen for language changes
window.addEventListener('languageChanged', () => {
    const agentsPage = document.getElementById('agentsPage');
    if (agentsPage && agentsPage.classList.contains('active')) {
        updateAgentsPageTranslations();
        // Reload data to update formatted dates/times
        loadAvailableVersions();
        loadDownloadHistory();
    }
});

// ==================== EXPORT FUNCTIONS ====================

window.loadAvailableVersions = loadAvailableVersions;
window.loadDownloadHistory = loadDownloadHistory;
window.downloadSelectedVersion = downloadSelectedVersion;
window.initAgentsPage = initAgentsPage;

console.log('✅ Agents page loaded successfully');