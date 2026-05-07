// ==================== AGENT VERSIONS SECTION ====================

const AGENT_VERSIONS_API_URL = '/jar/admin';

// Format bytes to readable size
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Format date
function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Render version cards
function renderVersionCards(versions, isNew = false) {
    if (!versions || versions.length === 0) {
        return `
            <div class="empty-state-small">
                <div class="empty-icon">📦</div>
                <div class="empty-text">No ${isNew ? 'new' : 'approved'} versions</div>
            </div>
        `;
    }

    return versions.map(version => `
        <div class="version-card ${isNew ? 'version-card-new' : 'version-card-approved'}">
            <div class="version-header">
                <div class="version-number">v${version.version}</div>
                ${version.id ? `<div class="version-id">${version.id.substring(0, 8)}</div>` : ''}
            </div>
            
            <div class="version-description">
                ${version.description || 'No description available'}
            </div>
            
            <div class="version-details">
                <div class="version-detail-item">
                    <div class="detail-label">Size</div>
                    <div class="detail-value size-value">${formatBytes(version.sizeInBytes || 0)}</div>
                </div>
                <div class="version-detail-item">
                    <div class="detail-label">Release Date</div>
                    <div class="detail-value date-value">${version.releaseDate ? formatDate(version.releaseDate) : 'N/A'}</div>
                </div>
            </div>
            
            ${isNew ? `
                <div class="version-actions">
                    <button class="action-btn approve-btn" onclick="openApproveModal('${version.version}')">
                        ✓ Approve
                    </button>
                </div>
            ` : `
                <div class="version-actions">
                    <button class="action-btn edit-btn" onclick="editVersion('${version.id}')">
                        ✎ Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteVersion('${version.id}')">
                        🗑 Delete
                    </button>
                </div>
            `}
        </div>
    `).join('');
}

// Render agent versions sections
function renderAgentVersions(data) {
    const newVersionsContainer = document.getElementById('newVersionsGrid');
    const approvedVersionsContainer = document.getElementById('approvedVersionsGrid');

    newVersionsContainer.innerHTML = renderVersionCards(data.newVersions, true);
    approvedVersionsContainer.innerHTML = renderVersionCards(data.approvedVersions, false);

    // Update counts
    document.getElementById('newVersionsCount').textContent = data.newVersions?.length || 0;
    document.getElementById('approvedVersionsCount').textContent = data.approvedVersions?.length || 0;
}

// Load agent versions data
async function loadAgentVersionsData() {
    try {
        renderAgentVersionsSection();

        const data = await apiCall(AGENT_VERSIONS_API_URL, {
            method: 'GET'
        });

        renderAgentVersions(data);

    } catch (error) {
        console.error('Error loading agent versions:', error);
        showToast('Failed to load agent versions: ' + error.message, 'error');

        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="content-header">
                <h1>Agent Versions</h1>
            </div>
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <div class="empty-state-title">Error Loading Data</div>
                <div class="empty-state-description">${error.message}</div>
            </div>
        `;
    }
}

// Open approve modal
function openApproveModal(version) {
    const modal = document.getElementById('approveModal');
    document.getElementById('approveVersionNumber').textContent = version;
    document.getElementById('approveVersionInput').value = version;
    document.getElementById('approveDescription').value = '';
    modal.style.display = 'flex';
}

// Close approve modal
function closeApproveModal() {
    const modal = document.getElementById('approveModal');
    modal.style.display = 'none';
}

// Approve version
async function approveVersion() {
    const version = document.getElementById('approveVersionInput').value;
    const description = document.getElementById('approveDescription').value.trim();

    const submitBtn = document.getElementById('approveSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Approving...';

    try {
        const response = await apiCall('/jar', {
            method: 'POST',
            body: JSON.stringify({
                version: version,
                description: description || null
            })
        });

        showToast('Version approved successfully!', 'success');
        closeApproveModal();
        loadAgentVersionsData(); // Refresh the list

    } catch (error) {
        console.error('Error approving version:', error);
        showToast('Failed to approve version: ' + error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = '✓ Approve';
    }
}

// Placeholder functions for actions (to be implemented)
function rejectVersion(version) {
    showToast('Reject functionality coming soon: ' + version, 'error');
    console.log('Reject version:', version);
}

function editVersion(id) {
    showToast('Edit functionality coming soon: ' + id, 'error');
    console.log('Edit version:', id);
}

function deleteVersion(id) {
    showToast('Delete functionality coming soon: ' + id, 'error');
    console.log('Delete version:', id);
}

// Render agent versions section
function renderAgentVersionsSection() {
    const mainContent = document.getElementById('mainContent');

    mainContent.innerHTML = `
        <div class="content-header">
            <h1>Agent Versions Management</h1>
            <button class="refresh-btn" onclick="loadAgentVersionsData()">
                <span>🔄</span>
                <span>Refresh</span>
            </button>
        </div>

        <!-- New Versions Section -->
        <div class="versions-section">
            <div class="section-header">
                <h2>🆕 New Versions</h2>
                <span class="version-count" id="newVersionsCount">0</span>
            </div>
            <div class="versions-grid" id="newVersionsGrid">
                <!-- Will be populated by JavaScript -->
            </div>
        </div>

        <!-- Approved Versions Section -->
        <div class="versions-section">
            <div class="section-header">
                <h2>✅ Approved Versions</h2>
                <span class="version-count" id="approvedVersionsCount">0</span>
            </div>
            <div class="versions-grid" id="approvedVersionsGrid">
                <!-- Will be populated by JavaScript -->
            </div>
        </div>

        <!-- Approve Modal -->
        <div id="approveModal" class="modal-overlay" onclick="if(event.target === this) closeApproveModal()">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Approve Version <span id="approveVersionNumber"></span></h3>
                    <button class="modal-close-btn" onclick="closeApproveModal()">✕</button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="approveVersionInput">
                    <div class="form-group">
                        <label for="approveDescription">Description (Optional)</label>
                        <textarea 
                            id="approveDescription" 
                            class="form-textarea" 
                            placeholder="Add a description for this version..."
                            rows="4"
                        ></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn cancel-btn" onclick="closeApproveModal()">Cancel</button>
                    <button class="modal-btn approve-btn" id="approveSubmitBtn" onclick="approveVersion()">✓ Approve</button>
                </div>
            </div>
        </div>
    `;
}

// Register this section with main navigation immediately
window.registerSectionRenderer = window.registerSectionRenderer || function() {};
registerSectionRenderer('agent-versions', loadAgentVersionsData);

// Export functions
window.openApproveModal = openApproveModal;
window.closeApproveModal = closeApproveModal;
window.approveVersion = approveVersion;
window.editVersion = editVersion;
window.deleteVersion = deleteVersion;