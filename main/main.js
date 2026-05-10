// API_BASE is already defined in token-refresh.js

// ==================== ROLE-BASED ACCESS CONTROL ====================

let currentUserRole = null;
let roleLoadPromise = null;

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
                console.log('✅ User role loaded:', currentUserRole);

                // CRITICAL: Set the data attribute so CSS can show restricted items for ADMIN
                if (document.body) {
                    document.body.dataset.userRole = currentUserRole;
                    console.log('Body data-user-role set to:', document.body.dataset.userRole); // debug
                } else {
                    console.warn('document.body not available yet');
                }

                // ✅ Set user language from backend
                if (profileData?.settings?.language) {
                    // Add this mapping
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
                    updateSidebarTranslations(); // ✅ Translate sidebar items
                    sidebar.style.display = ''; // restore default display
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

            // Optional: still show sidebar in error case
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                updateSidebarVisibility();
                updateSidebarTranslations(); // ✅ Translate even on error
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

    const restrictedPages = ['databases', 'users', 'agents', 'organization']; // ← Add 'organization' here

    document.querySelectorAll('.sidebar-item').forEach(item => {
        const page = item.dataset.page?.toLowerCase();
        if (!page) return;

        if (isAdmin()) {
            item.style.display = ''; // default (usually flex or block)
        } else if (isDeveloper() && restrictedPages.includes(page)) {
            item.style.display = 'none';
        } else {
            item.style.display = ''; // default for other cases
        }
    });
}

// ✅ NEW: Update sidebar translations
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

        // ✅ Show toast with translation
        showToast(window.t('common.copied'), 'success', 1200);

        setTimeout(() => btn.innerHTML = original, 1200);
    });
}

// ==================== COMPLETE DATABASE MODAL WITH PASSWORD EDIT ====================

let currentModalDatabase = null;

function openModal(db) {
    console.log('Opening modal for database:', db);
    currentModalDatabase = db;

    // ✅ Use translations
    const t = window.t;

    // Build the modal content
    document.getElementById("modalLeft").innerHTML = `
        <h2>${db.databaseName}</h2>
        <div><strong>${t('main.modal.username')}:</strong> ${db.username}</div>
        <div class="password-field">
            <strong>${t('main.modal.password')}:</strong> 
            <div class="password-display" id="passwordDisplay">
                <span class="password-hidden" id="modalPassword">••••••••</span>
                <button type="button" class="password-toggle-btn" id="togglePasswordBtn" title="${t('main.modal.showPassword')}">
                    <svg id="eyeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
                <button type="button" class="password-edit-btn" id="editPasswordBtn" title="${t('main.modal.editPassword')}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
            </div>
            
            <!-- Edit Mode (hidden initially) -->
            <div class="password-edit-mode" id="passwordEditMode" style="display: none;">
                <div class="password-edit-field">
                    <input type="password" id="newPasswordInput" class="password-edit-input" placeholder="${t('main.passwordEdit.newPassword')}">
                    <button type="button" class="password-show-toggle" id="showPasswordToggle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                </div>
                <div class="password-edit-actions">
                    <button type="button" class="password-save-btn" id="savePasswordBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        ${t('main.passwordEdit.save')}
                    </button>
                    <button type="button" class="password-cancel-btn" id="cancelPasswordBtn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        ${t('main.passwordEdit.cancel')}
                    </button>
                </div>
            </div>
        </div>
    `;

    // ✅ CRITICAL: Attach event listeners AFTER DOM is updated
    setTimeout(() => {
        console.log('Attaching event listeners...');

        const toggleBtn = document.getElementById("togglePasswordBtn");
        const editBtn = document.getElementById("editPasswordBtn");
        const saveBtn = document.getElementById("savePasswordBtn");
        const cancelBtn = document.getElementById("cancelPasswordBtn");
        const showToggle = document.getElementById("showPasswordToggle");

        if (toggleBtn) {
            toggleBtn.addEventListener("click", togglePasswordVisibility);
            console.log('✓ Toggle button listener attached');
        }

        if (editBtn) {
            editBtn.addEventListener("click", startPasswordEdit);
            console.log('✓ Edit button listener attached');
        }

        if (saveBtn) {
            saveBtn.addEventListener("click", saveNewPassword);
            console.log('✓ Save button listener attached');
        }

        if (cancelBtn) {
            cancelBtn.addEventListener("click", cancelPasswordEdit);
            console.log('✓ Cancel button listener attached');
        }

        if (showToggle) {
            showToggle.addEventListener("click", toggleNewPasswordVisibility);
            console.log('✓ Show toggle listener attached');
        }
    }, 50);

    // Populate roles
    const rolesContainer = document.getElementById("modalRoles");
    if (rolesContainer) {
        rolesContainer.innerHTML = "";
        if (db.roleNames && db.roleNames.length > 0) {
            db.roleNames.forEach(role => {
                const div = document.createElement("div");
                div.classList.add("role-item");
                div.innerHTML = `<h4>${role.name}</h4><p>${role.description || t('main.modal.noDescription')}</p>`;
                rolesContainer.appendChild(div);
            });
        } else {
            rolesContainer.innerHTML = `<p style="color: #64748b;">${t('main.modal.noRoles')}</p>`;
        }
    }

    // Show the modal
    document.getElementById("modalOverlay").style.display = "flex";
}

// ==================== PASSWORD VISIBILITY TOGGLE ====================
function togglePasswordVisibility() {
    const passwordSpan = document.getElementById("modalPassword");
    const eyeIcon = document.getElementById("eyeIcon");
    const toggleBtn = document.getElementById("togglePasswordBtn");

    if (!passwordSpan || !eyeIcon || !currentModalDatabase) {
        console.error('Missing elements for password visibility toggle');
        return;
    }

    const t = window.t;

    if (passwordSpan.classList.contains('password-hidden')) {
        // Show password
        passwordSpan.textContent = currentModalDatabase.password;
        passwordSpan.classList.remove('password-hidden');
        toggleBtn.setAttribute('title', t('main.modal.hidePassword'));
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        // Hide password
        passwordSpan.textContent = '••••••••';
        passwordSpan.classList.add('password-hidden');
        toggleBtn.setAttribute('title', t('main.modal.showPassword'));
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
}

// ==================== START PASSWORD EDIT ====================
function startPasswordEdit() {
    console.log('🔧 Starting password edit...');
    const passwordDisplay = document.getElementById("passwordDisplay");
    const passwordEditMode = document.getElementById("passwordEditMode");

    if (!passwordDisplay || !passwordEditMode) {
        console.error('❌ Password display or edit mode elements not found');
        return;
    }

    passwordDisplay.style.display = "none";
    passwordEditMode.style.display = "block";

    setTimeout(() => {
        const input = document.getElementById("newPasswordInput");
        if (input) {
            input.focus();
            console.log('✓ Password input focused');
        }
    }, 100);
}

// ==================== CANCEL PASSWORD EDIT ====================
function cancelPasswordEdit() {
    console.log('❌ Canceling password edit...');
    const passwordDisplay = document.getElementById("passwordDisplay");
    const passwordEditMode = document.getElementById("passwordEditMode");
    const newPasswordInput = document.getElementById("newPasswordInput");

    if (passwordDisplay && passwordEditMode) {
        passwordDisplay.style.display = "flex";
        passwordEditMode.style.display = "none";
    }

    if (newPasswordInput) {
        newPasswordInput.value = "";
    }
}

// ==================== TOGGLE NEW PASSWORD VISIBILITY ====================
function toggleNewPasswordVisibility() {
    const input = document.getElementById("newPasswordInput");
    const toggleBtn = document.getElementById("showPasswordToggle");

    if (!input || !toggleBtn) {
        console.error('❌ Input or toggle button not found');
        return;
    }

    const svg = toggleBtn.querySelector("svg");
    if (!svg) return;

    if (input.type === "password") {
        input.type = "text";
        svg.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
    } else {
        input.type = "password";
        svg.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
    }
}

// ==================== SAVE NEW PASSWORD ====================
async function saveNewPassword() {
    console.log('💾 === SAVE PASSWORD START ===');

    const t = window.t;
    const newPasswordInput = document.getElementById("newPasswordInput");

    if (!newPasswordInput) {
        console.error('❌ newPasswordInput not found');
        showToast(t('main.passwordEdit.notFound'), 'error');
        return;
    }

    if (!currentModalDatabase) {
        console.error('❌ currentModalDatabase is null');
        showToast(t('main.passwordEdit.dbNotAvailable'), 'error');
        return;
    }

    const newPassword = newPasswordInput.value.trim();

    if (!newPassword) {
        showToast(t('main.passwordEdit.enterPassword'), 'error');
        return;
    }

    if (newPassword.length < 6) {
        showToast(t('main.passwordEdit.minLength'), 'error');
        return;
    }

    const saveBtn = document.getElementById("savePasswordBtn");
    if (!saveBtn) {
        console.error('❌ Save button not found');
        showToast(t('main.passwordEdit.saveButtonNotFound'), 'error');
        return;
    }

    const originalContent = saveBtn.innerHTML;
    saveBtn.disabled = true;
    saveBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
        ${t('main.passwordEdit.saving')}
    `;

    try {
        console.log('📡 Sending PATCH to:', `/databaseUser/${currentModalDatabase.memberId}`);

        const requestBody = {
            dbUsername: null,
            dbPassword: newPassword,
            databaseId: null,
            authUserId: null,
            roleIds: null
        };

        const response = await apiCall(`/databaseUser/${currentModalDatabase.memberId}`, {
            method: 'PATCH',
            body: JSON.stringify(requestBody)
        });

        console.log('✅ Success:', response);

        currentModalDatabase.password = newPassword;
        showToast(t('main.passwordEdit.updateSuccess'), 'success');
        cancelPasswordEdit();

        if (typeof loadMainDatabases === 'function') {
            await loadMainDatabases();
        }

    } catch (error) {
        console.error('❌ Error:', error);
        showToast(error.message || t('main.passwordEdit.updateError'), 'error');
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalContent;
    }

    console.log('💾 === SAVE PASSWORD END ===');
}

// ==================== CLOSE MODAL ====================
function closeModal() {
    document.getElementById("modalOverlay").style.display = "none";
    currentModalDatabase = null;
}

// Make functions globally available
window.openModal = openModal;
window.closeModal = closeModal;
window.togglePasswordVisibility = togglePasswordVisibility;
window.startPasswordEdit = startPasswordEdit;
window.cancelPasswordEdit = cancelPasswordEdit;
window.toggleNewPasswordVisibility = toggleNewPasswordVisibility;
window.saveNewPassword = saveNewPassword;

// ==================== MAIN PAGE - DATABASE CARDS ====================
async function loadMainDatabases() {
    const container = document.getElementById("cardsContainer");
    if (!container) return;

    const t = window.t;

    container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 80px 20px; color: #64748b;">
            <div style="font-size: 18px; font-weight: 600;">${t('main.loading')}</div>
        </div>
    `;

    try {
        const databases = await apiCall("/databaseUser/databases");

        if (!databases || databases.length === 0) {
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
        renderCards(databases);

    } catch (err) {
        console.error('Failed to load databases:', err);
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 80px 20px;">
                <div style="font-size: 22px; font-weight: bold; color: #ef4444; margin-bottom: 16px;">${t('main.loadError')}</div>
                <button onclick="loadMainDatabases()" style="padding: 10px 24px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    ${t('common.retry')}
                </button>
            </div>
        `;
    }
}

function renderCards(databases) {
    const container = document.getElementById("cardsContainer");
    const t = window.t;

    container.innerHTML = "";

    databases.forEach(db => {
        const card = document.createElement("div");
        card.classList.add("db-card");

        card.innerHTML = `
            <div class="db-card-name">${db.databaseName}</div>
            <div class="db-field">
                <label>${t('main.card.username')}</label>
                <div class="value-with-copy">
                    <span>${db.username}</span>
                    <button class="copy-btn" onclick="event.stopPropagation(); copyToClipboard('${db.username.replace(/'/g, "\\'")}', this)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="db-field">
                <label>${t('main.card.password')}</label>
                <div class="value-with-copy">
                    <span>••••••••</span>
                    <button class="copy-btn" onclick="event.stopPropagation(); copyToClipboard('${db.password.replace(/'/g, "\\'")}', this)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        card.addEventListener("click", (e) => {
            if (!e.target.closest('.copy-btn')) {
                openModal(db);
            }
        });

        container.appendChild(card);
    });
}

// ==================== MODAL INITIALIZATION ====================
function initializeModals() {
    const overlay = document.getElementById("modalOverlay");
    if (overlay) {
        overlay.style.display = "none";
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeModal();
        });
    }

    const closeBtn = document.getElementById("modalClose");
    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            closeModal();
        });
    }
}

// ✅ NEW: Handle language change event from settings
function handleLanguageChangeEvent(newLang) {
    console.log('🌐 Language changed to:', newLang);

    // Update i18n
    if (window.i18n) {
        window.i18n.currentLang = newLang;
    }

    // Update sidebar translations
    updateSidebarTranslations();

    // Reload database cards with new language
    if (typeof loadMainDatabases === 'function') {
        loadMainDatabases();
    }

    // If modal is open, refresh it
    if (currentModalDatabase && document.getElementById("modalOverlay").style.display === "flex") {
        openModal(currentModalDatabase);
    }
}

// Listen for language changes
window.addEventListener('languageChanged', (event) => {
    handleLanguageChangeEvent(event.detail.lang);
});

// ==================== APP INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", async () => {
    console.log('App initializing...');

    if (!getToken()) {
        window.location.href = "/login";
        return;
    }

    initializeModals();

    // Load role first (this will also show sidebar when ready and set language)
    await loadUserRole();

    // Load main content
    await loadMainDatabases();
});

// ==================== GLOBAL EXPORTS ====================
window.loadMainDatabases = loadMainDatabases;
window.closeModal = closeModal;
window.loadUserRole = loadUserRole;
window.isAdmin = isAdmin;
window.isDeveloper = isDeveloper;
window.hasAccessToPage = hasAccessToPage;
window.getCurrentUserRole = () => currentUserRole;
window.updateSidebarVisibility = updateSidebarVisibility;
window.updateSidebarTranslations = updateSidebarTranslations;
window.showToast = showToast;