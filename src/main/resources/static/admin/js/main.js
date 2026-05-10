// ==================== ADMIN MAIN - NAVIGATION CONTROLLER ====================

let currentSection = 'endpoints';
let autoRefreshInterval = null;

// Section renderer registry
const sectionRenderers = {
    'endpoints': null, // Will be set by admin-endpoints.js
    'active-users': null, // Will be set by admin-active-users.js
    'org-activity': null // Will be set by admin-org-activity.js
};

// Register a section renderer
function registerSectionRenderer(sectionName, renderFunction) {
    sectionRenderers[sectionName] = renderFunction;
}

// Navigate to a section
function navigateToSection(sectionName) {
    // Stop any existing auto-refresh
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }

    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionName) {
            item.classList.add('active');
        }
    });

    // Update current section
    currentSection = sectionName;

    // Render the section
    const renderer = sectionRenderers[sectionName];
    if (renderer && typeof renderer === 'function') {
        renderer();
    } else {
        console.error(`No renderer found for section: ${sectionName}`);
        showEmptyState('Section not implemented', '🚧');
    }
}

// Show empty state
function showEmptyState(message = 'No data available', icon = '📭') {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">${icon}</div>
            <div class="empty-state-title">${message}</div>
        </div>
    `;
}

// Show loading
function showLoading() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="loading-overlay" style="position: relative; min-height: 400px;">
            <div class="spinner"></div>
        </div>
    `;
}

// Initialize navigation
function initializeNavigation() {
    // Add click listeners to nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            navigateToSection(section);
        });
    });

    // Load initial section
    navigateToSection('endpoints');
}

// Wait for all scripts to load
window.addEventListener('load', () => {
    if (typeof apiCall === 'function') {
        // Give other scripts time to register
        setTimeout(() => {
            initializeNavigation();
        }, 100);
    } else {
        console.error('apiCall not found - make sure token-refresh.js is loaded first');
        showEmptyState('Failed to initialize. Please refresh the page.', '⚠️');
    }
});

// Export functions for other modules
window.registerSectionRenderer = registerSectionRenderer;
window.navigateToSection = navigateToSection;
window.showLoading = showLoading;
window.showEmptyState = showEmptyState;
window.autoRefreshInterval = autoRefreshInterval;