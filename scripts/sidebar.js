// ==================== SIDEBAR NAVIGATION ====================

const PAGE_CONFIG = {
    main: {
        elementId: 'mainPage',
        loader: 'loadMainDatabases'
    },
    databases: {
        elementId: 'databasesPage',
        loader: null
    },
    users: {
        elementId: 'usersPage',
        loader: 'loadUsers'
    },
    organization: {  // ADD THIS
        elementId: 'organizationPage',
        loader: 'initOrganizationPage'
    },
    agents: {
        elementId: 'agentsPage',
        loader: 'initAgentsPage'
    },
    profile: {
        elementId: 'profilePage',
        loader: 'loadProfile'
    },
    settings: {
        elementId: 'settingsPage',
        loader: 'initSettingsPage'
    }
};
// ==================== HELPER FUNCTIONS ====================



/**
 * Get all page elements
 */
function getAllPageElements() {
    return Object.values(PAGE_CONFIG)
        .map(config => document.getElementById(config.elementId))
        .filter(element => element !== null);
}



/**
 * Hide all pages
 */
function hideAllPages() {
    getAllPageElements().forEach(page => {
        page.classList.remove('active');
    });
}

/**
 * Remove active class from all sidebar items
 */
function clearActiveSidebarItems() {
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
}

/**
 * Show a specific page and run its loader if available
 */
function showPage(pageName) {
    console.log('🔄 Attempting to load page:', pageName);

    // Wait for role check function to be available
    if (typeof hasAccessToPage !== 'function') {
        console.error('❌ hasAccessToPage function not available yet');
        return;
    }

    // Check access before showing page
    if (!hasAccessToPage(pageName)) {  // ✅ FIXED - Added ! (NOT)
        console.log('❌ Access DENIED to page:', pageName);
        showToast('You do not have permission to access this page', 'error');

        // Prevent infinite loop
        if (pageName !== 'main') {
            showPage('main');
        }
        return;
    }

    console.log('✅ Access GRANTED to page:', pageName);

    // Hide all pages
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.remove('active');
    });

    // Remove active state from all sidebar items
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected page
    const pageElement = document.getElementById(`${pageName}Page`);
    if (pageElement) {
        pageElement.classList.add('active');

        // Set active state on sidebar
        const sidebarItem = document.querySelector(`[data-page="${pageName}"]`);
        if (sidebarItem) {
            sidebarItem.classList.add('active');
        }

        // Load page-specific content
        if (pageName === 'databases') {
            if (typeof loadDatabases === 'function') {
                loadDatabases();
            }
        } else if (pageName === 'users') {
            if (typeof loadUsers === 'function') {
                loadUsers();
            }
        } else if (pageName === 'organization') {
            if (typeof initOrganizationPage === 'function') {
                initOrganizationPage();
            }
        } else if (pageName === 'agents') {
            if (typeof initAgentsPage === 'function') {
                initAgentsPage();
            }
        } else if (pageName === 'profile') {
            if (typeof loadProfile === 'function') {
                loadProfile();
            }
        } else if (pageName === 'settings') {
            if (typeof initSettingsPage === 'function') {
                initSettingsPage();
            }
        }
    } else {
        console.error('❌ Page element not found:', `${pageName}Page`);
    }
}

/**
 * Handle sidebar item click
 */
function handleSidebarClick(event) {
    const sidebarItem = event.currentTarget;
    const pageName = sidebarItem.dataset.page;

    if (!pageName) {
        console.error('No page data attribute found on sidebar item');
        return;
    }

    // Update sidebar active state
    clearActiveSidebarItems();
    sidebarItem.classList.add('active');

    // Show the selected page
    showPage(pageName);
}

/**
 * Initialize sidebar navigation
 */
function initSidebarNavigation() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');

    if (sidebarItems.length === 0) {
        console.warn('No sidebar items found');
        return;
    }

    // Attach click listeners to all sidebar items
    sidebarItems.forEach(item => {
        item.addEventListener('click', handleSidebarClick);
    });

    console.log(`Sidebar navigation initialized with ${sidebarItems.length} items`);
}

/**
 * Navigate to a specific page programmatically
 * Can be called from anywhere in the app
 */
function navigateToPage(pageName) {
    const sidebarItem = document.querySelector(`.sidebar-item[data-page="${pageName}"]`);

    if (!sidebarItem) {
        console.error(`Sidebar item not found for page: ${pageName}`);
        return;
    }

    // Trigger the click handler
    clearActiveSidebarItems();
    sidebarItem.classList.add('active');
    showPage(pageName);
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing sidebar navigation...');
    initSidebarNavigation();
});

// ==================== EXPORT FUNCTIONS ====================

window.initSidebarNavigation = initSidebarNavigation;
window.navigateToPage = navigateToPage;
window.showPage = showPage;