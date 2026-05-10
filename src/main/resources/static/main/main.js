// API_BASE is already defined in token-refresh.js

// ==================== ROLE-BASED ACCESS CONTROL ====================

let currentUserRole = null;
let roleLoadPromise = null;
let currentAuthUserId = null; // Store auth user ID

// Hide sidebar as early as possible to prevent flash
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.style.display = 'none';
    }
});

// Get user role from profile endpoint
async function loadUserRole() {
    if (roleLoadPromise) return roleLoadPromise;

    roleLoadPromise = (async () => {
        try {
            console.log('🔄 Loading user role...');
            const profileData = await apiCall('/user/profile');

            if (profileData?.role?.name) {
                currentUserRole = profileData.role.name.toUpperCase().trim();
                currentAuthUserId = profileData.id; // Store user ID
                console.log('✅ User role loaded:', currentUserRole);
                console.log('✅ User ID:', currentAuthUserId);

                // Set the data attribute so CSS can show restricted items for ADMIN
                if (document.body) {
                    document.body.dataset.userRole = currentUserRole;
                }

                // Set user language from backend
                if (profileData?.settings?.language) {
                    const langMap = {
                        'ENG': 'en',
                        'UZB': 'uz',
                        'RU': 'ru'
                    };

                    const userLang = langMap[profileData.settings.language] || 'en';
                    console.log('✅ User language from backend:', userLang);
                    if (window.i18n && ['en', 'ru', 'uz'].includes(userLang)) {
                        window.i18n.setLanguage(userLang);
                    }
                }

                // Show sidebar with correct visibility
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) {
                    updateSidebarVisibility();
                    updateSidebarTranslations();
                    sidebar.style.display = '';
                }
            } else {
                console.warn('⚠️ Role not found in profile response');
                currentUserRole = null;
            }

            // Load other user settings if function exists
            if (typeof loadUserAndSettings === 'function') {
                await loadUserAndSettings(profileData);
            }

            return currentUserRole;

        } catch (error) {
            console.error('❌ Failed to load user role:', error);
            currentUserRole = null;

            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                updateSidebarVisibility();
                updateSidebarTranslations();
                sidebar.style.display = '';
            }
        } finally {
            roleLoadPromise = null;
        }
    })();

    return roleLoadPromise;
}

function isAdmin() {
    return currentUserRole === 'ADMIN';
}

function isDeveloper() {
    return currentUserRole === 'DEVELOPER';
}

function hasAccessToPage(pageName) {
    if (!currentUserRole) {
        console.warn('⚠️ Role not loaded yet → access denied');
        return false;
    }

    if (isAdmin()) return true;

    if (isDeveloper()) {
        const allowed = ['main', 'profile', 'settings'];
        return allowed.includes(pageName.toLowerCase());
    }

    return false;
}

function updateSidebarVisibility() {
    if (!currentUserRole) return;

    console.log('🔄 Updating sidebar visibility for role:', currentUserRole);

    const restrictedPages = ['databases', 'users', 'agents', 'organization'];

    document.querySelectorAll('.sidebar-item').forEach(item => {
        const page = item.dataset.page?.toLowerCase();
        if (!page) return;

        if (isAdmin()) {
            item.style.display = '';
        } else if (isDeveloper() && restrictedPages.includes(page)) {
            item.style.display = 'none';
        } else {
            item.style.display = '';
        }
    });
}

function updateSidebarTranslations() {
    if (!window.t) return;

    const sidebarItems = {
        'main': 'sidebar.main',
        'databases': 'sidebar.databases',
        'users': 'sidebar.users',
        'organization': 'sidebar.organization',
        'agents': 'sidebar.agents',
        'profile': 'sidebar.profile',
        'settings': 'sidebar.settings'
    };

    document.querySelectorAll('.sidebar-item').forEach(item => {
        const page = item.dataset.page?.toLowerCase();
        if (page && sidebarItems[page]) {
            const textElement = item.querySelector('.sidebar-text');
            if (textElement) {
                textElement.textContent = window.t(sidebarItems[page]);
            }
        }
    });
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'success', duration = 3000) {
    document.querySelectorAll('.toast-notification').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;

    const icon = type === 'success'
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-show'));

    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());

    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ==================== COPY TO CLIPBOARD ====================
function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

        showToast(window.t('common.copied'), 'success', 1200);

        setTimeout(() => btn.innerHTML = original, 1200);
    });
}

// ==================== PASSWORD VISIBILITY TOGGLE ====================
let credentialPasswordVisible = false;

function toggleCredentialPassword() {
    const passwordSpan = document.getElementById('credentialPassword');
    const toggleBtn = document.getElementById('toggleCredentialPasswordBtn');

    if (!passwordSpan || !toggleBtn) return;

    credentialPasswordVisible = !credentialPasswordVisible;

    if (credentialPasswordVisible) {
        passwordSpan.textContent = passwordSpan.dataset.password;
        toggleBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        `;
        toggleBtn.setAttribute('title', window.t('main.credentials.hidePassword'));
    } else {
        passwordSpan.textContent = window.t('main.credentials.passwordHidden');
        toggleBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `;
        toggleBtn.setAttribute('title', window.t('main.credentials.showPassword'));
    }
}

// ==================== PASSWORD CHANGE MODAL ====================
let passwordChangeStep = 1;

function openPasswordChangeModal() {
    const overlay = document.getElementById('passwordChangeModalOverlay');
    if (!overlay) return;

    overlay.classList.add('active');

    const input = document.getElementById('newPasswordInput');
    if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 50);
    }
}

function closePasswordChangeModal() {
    const overlay = document.getElementById('passwordChangeModalOverlay');
    if (overlay) overlay.classList.remove('active');
}

async function saveNewPassword() {
    const newPasswordInput = document.getElementById('newPasswordInput');
    const saveBtn = document.getElementById('saveNewPasswordBtn');

    if (!newPasswordInput || !saveBtn || !currentAuthUserId) return;

    const newPassword = newPasswordInput.value.trim();

    if (!newPassword) {
        showToast(window.t('main.passwordChange.enterNew'), 'error');
        return;
    }

    if (newPassword.length < 6) {
        showToast(window.t('main.passwordChange.minLength'), 'error');
        return;
    }

    // Disable button and show loading
    const originalContent = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
        ${window.t('main.passwordChange.saving')}
    `;

    try {
        // Call update endpoint
        await apiCall(`/databaseUser/${currentAuthUserId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: newPassword
        });

        showToast(window.t('main.passwordChange.updateSuccess'), 'success');
        closePasswordChangeModal();

        // Reload databases to get new password
        await loadMainDatabases();

    } catch (error) {
        console.error('Password update failed:', error);
        showToast(window.t('main.passwordChange.updateError'), 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalContent;
    }
}

function togglePasswordVisibility(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);

    if (!input || !button) return;

    const svg = button.querySelector('svg');

    if (input.type === 'password') {
        input.type = 'text';
        svg.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        input.type = 'password';
        svg.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
}

// ==================== ROLE DETAILS MODAL ====================
function openRoleModal(role) {
    const overlay = document.getElementById('roleModalOverlay');
    if (!overlay) return;

    const t = window.t;

    document.getElementById('roleModalName').textContent = role.name || t('main.roleModal.noDescription');
    document.getElementById('roleModalDescription').textContent = role.description || t('main.roleModal.noDescription');

    overlay.classList.add('active');
}

function closeRoleModal() {
    const overlay = document.getElementById('roleModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// ==================== MAIN PAGE - DATABASE LOADING ====================
async function loadMainDatabases() {
    const container = document.getElementById('mainPageContainer');
    if (!container) return;

    const t = window.t;

    container.innerHTML = `
        <div style="text-align: center; padding: 80px 20px; color: #64748b;">
            <div style="font-size: 18px; font-weight: 600;">${t('common.loading')}</div>
        </div>
    `;

    try {
        const data = await apiCall("/databaseUser/databases");

        if (!data || !data.databases || data.databases.length === 0) {
            container.innerHTML = `
                <div class="no-databases-container">
                    <div class="no-databases-icon">
                        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="60" cy="25" rx="45" ry="15" stroke="currentColor" stroke-width="4"/>
                            <path d="M105 60c0 8.3-20 15-45 15s-45-6.7-45-15" stroke="currentColor" stroke-width="4"/>
                            <path d="M15 25v70c0 8.3 20 15 45 15s45-6.7 45-15V25" stroke="currentColor" stroke-width="4"/>
                        </svg>
                    </div>
                    <h3 class="no-databases-title">${t('main.noDatabases.title')}</h3>
                    <p class="no-databases-message">
                        ${t('main.noDatabases.message')}<br>
                        ${t('main.noDatabases.contact')}
                    </p>
                </div>
            `;
            return;
        }

        renderDatabasesPage(data);

    } catch (err) {
        console.error('Failed to load databases:', err);
        container.innerHTML = `
            <div style="text-align: center; padding: 80px 20px;">
                <div style="font-size: 22px; font-weight: bold; color: #ef4444; margin-bottom: 16px;">${t('main.loadError')}</div>
                <button onclick="loadMainDatabases()" style="padding: 10px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    ${t('common.retry')}
                </button>
            </div>
        `;
    }
}

function renderDatabasesPage(data) {
    const container = document.getElementById('mainPageContainer');
    const t = window.t;

    const {dbPassword, databases} = data;

    // Build shared password section
    const sharedPasswordHTML = `
        <div class="credentials-container">
            <h2 class="credentials-title">${t('main.credentials.sharedPasswordTitle')}</h2>
            <p class="credentials-subtitle">${t('main.credentials.sharedPasswordSubtitle')}</p>
            
            <div class="shared-password-field">
                <label class="credential-label">${t('main.credentials.password')}</label>
                <div class="credential-value-container">
                    <span class="credential-value" id="credentialPassword" data-password="${dbPassword || ''}">${t('main.credentials.passwordHidden')}</span>
                    <div class="credential-actions">
                        ${dbPassword ? `
                        <button class="credential-btn" id="toggleCredentialPasswordBtn" onclick="toggleCredentialPassword()" title="${t('main.credentials.showPassword')}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                        <button class="credential-btn" onclick="copyToClipboard('${(dbPassword || '').replace(/'/g, "\\'")}', this)" title="${t('common.copy')}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                        </button>
                        <button class="credential-btn" onclick="openPasswordChangeModal()" title="${t('main.credentials.editPassword')}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Build databases list
    let databasesHTML = `
        <h2 class="databases-section-title">${t('main.availableDatabases.title')}</h2>
    `;

    if (!databases || databases.length === 0) {
        databasesHTML += `
            <div style="text-align: center; padding: 40px; color: #94a3b8;">
                ${t('main.availableDatabases.noDatabases')}
            </div>
        `;
    } else {
        databasesHTML += '<div class="databases-list">';

        databases.forEach(db => {
            databasesHTML += `
                <div class="database-item">
                    <h3 class="database-name">${db.databaseName || 'Unknown Database'}</h3>
                    
                    <!-- Database Username -->
                    <div class="database-username-section">
                        <label class="database-field-label">${t('main.availableDatabases.username')}</label>
                        <div class="database-username-display">
                            <span class="database-username-value">${db.dbUsername || 'N/A'}</span>
                            ${db.dbUsername ? `
                            <button class="database-copy-btn" onclick="copyToClipboard('${db.dbUsername.replace(/'/g, "\\'")}', this)" title="${t('common.copy')}">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                            </button>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Database Roles -->
                    <div class="database-roles-section">
                        <div class="database-roles-label">${t('main.availableDatabases.roles')}</div>
                        <div class="database-roles">
                            ${db.roleNames && db.roleNames.length > 0
                ? db.roleNames.map(role => `
                                    <span class="role-badge" onclick='openRoleModal(${JSON.stringify(role).replace(/'/g, "&#39;")})' title="${t('main.availableDatabases.viewRole')}">
                                        ${role.name}
                                    </span>
                                `).join('')
                : `<span class="no-roles">${t('main.availableDatabases.noRoles')}</span>`
            }
                        </div>
                    </div>
                </div>
            `;
        });

        databasesHTML += '</div>';
    }

    container.innerHTML = sharedPasswordHTML + databasesHTML;
}

// ==================== HANDLE LANGUAGE CHANGE EVENT ====================
function handleLanguageChangeEvent(newLang) {
    console.log('🌐 Language changed to:', newLang);

    if (window.i18n) {
        window.i18n.currentLang = newLang;
    }

    updateSidebarTranslations();
    loadMainDatabases();
}

window.addEventListener('languageChanged', (event) => {
    handleLanguageChangeEvent(event.detail.lang);
});

// ==================== MODAL OVERLAY CLICK HANDLERS ====================
function handlePasswordModalOverlayClick(event) {
    if (event.target.id === 'passwordChangeModalOverlay') {
        closePasswordChangeModal();
    }
}

function handleRoleModalOverlayClick(event) {
    if (event.target.id === 'roleModalOverlay') {
        closeRoleModal();
    }
}

// ==================== APP INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", async () => {
    console.log('App initializing...');

    if (!getToken()) {
        window.location.href = "/login";
        return;
    }

    await loadUserRole();
    await loadMainDatabases();
});

// ==================== GLOBAL EXPORTS ====================
window.loadMainDatabases = loadMainDatabases;
window.loadUserRole = loadUserRole;
window.isAdmin = isAdmin;
window.isDeveloper = isDeveloper;
window.hasAccessToPage = hasAccessToPage;
window.getCurrentUserRole = () => currentUserRole;
window.updateSidebarVisibility = updateSidebarVisibility;
window.updateSidebarTranslations = updateSidebarTranslations;
window.showToast = showToast;
window.copyToClipboard = copyToClipboard;
window.toggleCredentialPassword = toggleCredentialPassword;
window.openPasswordChangeModal = openPasswordChangeModal;
window.closePasswordChangeModal = closePasswordChangeModal;
window.saveNewPassword = saveNewPassword;
window.togglePasswordVisibility = togglePasswordVisibility;
window.openRoleModal = openRoleModal;
window.closeRoleModal = closeRoleModal;
window.handlePasswordModalOverlayClick = handlePasswordModalOverlayClick;
window.handleRoleModalOverlayClick = handleRoleModalOverlayClick;