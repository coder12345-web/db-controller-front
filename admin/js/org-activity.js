// ==================== ORGANIZATION ACTIVITY SECTION ====================

// Render organization activity section (placeholder)
function renderOrgActivitySection() {
    const mainContent = document.getElementById('mainContent');

    mainContent.innerHTML = `
        <div class="content-header">
            <h1>Organization Activity</h1>
        </div>

        <div class="org-activity-container">
            <div class="empty-state">
                <div class="empty-state-icon">🏢</div>
                <div class="empty-state-title">Coming Soon</div>
                <div class="empty-state-description">Organization activity tracking will be available here.</div>
            </div>
        </div>
    `;
}

// Register this section with main navigation immediately
window.registerSectionRenderer = window.registerSectionRenderer || function() {};
registerSectionRenderer('org-activity', renderOrgActivitySection);