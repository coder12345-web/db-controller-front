// ==================== USERS SECTION ====================
const USERS_API = 'https://db-controller-production.up.railway.app/api/v1';
let usersSearchTimeout = null;
let currentUser = null;
let DEFAULT_DEVELOPER_ROLE_ID = null;  // Will be set dynamically when roles load
let isLoadingUsers = false;  // Prevents duplicate loading when user clicks multiple times

// Get current user info
async function getCurrentUser() {
    try {
        const token = sessionStorage.getItem("token");

        // Decode JWT to get user info (simple decode, not verification)
        if (token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            currentUser = { username: payload.sub || payload.username };
        }
    } catch (error) {
        console.error('Error getting current user:', error);
        currentUser = null;
    }
}

// Fetch all users from API
async function fetchAllUsers() {
    const token = sessionStorage.getItem("token");

    const response = await fetch(`${USERS_API}/user/all`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// Search users with query
async function searchUsersInList(query) {
    const token = sessionStorage.getItem("token");
    const searchParam = query.trim() || '';
    const endpoint = `/user?search=${encodeURIComponent(searchParam)}`;

    const response = await fetch(`${USERS_API}${endpoint}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// Render users list
function renderUsersList(users) {
    const container = document.getElementById('usersListContainer');
    container.innerHTML = '';

    if (!users || users.length === 0) {
        container.innerHTML = `
            <div class="users-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <p>${t('users.noUsers')}</p>
            </div>
        `;
        return;
    }

    users.forEach(user => {
        const userItem = createUserListItem(user);
        container.appendChild(userItem);
    });
}

// Create individual user list item
function createUserListItem(user) {
    const item = document.createElement('div');
    item.classList.add('user-list-item');

    // Check if this is the current user
    const isCurrentUser = currentUser && user.username === currentUser.username;

    item.innerHTML = `
        <div class="user-list-item-info">
            <div class="user-list-item-name">${user.name}</div>
            <div class="user-list-item-details">
                <span>@${user.username}</span>
            </div>
        </div>
        ${!isCurrentUser ? `
        <div class="user-list-item-actions">
            <button class="user-action-btn user-edit-btn" title="${t('users.listItem.editUser')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </button>
            <button class="user-action-btn user-delete-btn" title="${t('users.listItem.deleteUser')}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
        ` : ''}
    `;

    // Click on item to view details
    const infoSection = item.querySelector('.user-list-item-info');
    infoSection.addEventListener('click', () => openUserDetailModal(user));

    if (!isCurrentUser) {
        // Edit button
        const editBtn = item.querySelector('.user-edit-btn');
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditUserModal(user);
        });

        // Delete button
        const deleteBtn = item.querySelector('.user-delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openDeleteUserModal(user);
        });
    }

    return item;
}

// Load all users - with protection against multiple clicks + toast on error
async function loadUsers() {
    if (isLoadingUsers) {
        console.log('Users are already loading, ignoring extra call');
        return;
    }

    isLoadingUsers = true;

    const container = document.getElementById('usersListContainer');

    try {
        // Get current user first
        if (!currentUser) {
            await getCurrentUser();
        }

        // Show loading state
        container.innerHTML = `
            <div class="users-loading">
                <div class="loading-spinner"></div>
                <p>${t('users.loading')}</p>
            </div>
        `;

        const users = await fetchAllUsers();
        renderUsersList(users);
    } catch (error) {
        console.error('Error loading users:', error);
        showToast(t('users.loadError'), t('users.addUser.connectionError'), 'error');

        container.innerHTML = `
            <div class="users-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>${t('users.loadError')}</p>
                <button onclick="loadUsers()" style="margin-top: 16px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    ${t('users.retry')}
                </button>
            </div>
        `;
    } finally {
        isLoadingUsers = false;  // Always reset the flag
    }
}

// Handle search input
// Handle search input - fixed empty query + toast on error
function handleUsersSearch(event) {
    const query = event.target.value.trim();

    clearTimeout(usersSearchTimeout);
    usersSearchTimeout = setTimeout(async () => {
        const container = document.getElementById('usersListContainer');

        // If query is empty, load all users (prevents 400 error)
        if (query === '') {
            container.innerHTML = `
                <div class="users-loading">
                    <div class="loading-spinner"></div>
                    <p>${t('users.loading')}</p>
                </div>
            `;
            try {
                const users = await fetchAllUsers();
                renderUsersList(users);
            } catch (error) {
                console.error('Error loading all users:', error);
                showToast('Failed to load users' , t('users.addUser.connectionError'), 'error');
                renderUsersList([]);
            }
            return;
        }

        // Perform search
        container.innerHTML = `
            <div class="users-loading">
                <p>${t('users.searching')}</p>
            </div>
        `;

        try {
            const users = await searchUsersInList(query);
            renderUsersList(users);
        } catch (error) {
            console.error('Error searching users:', error);
            showToast('Search failed', t('users.addUser.connectionError'), 'error');
            container.innerHTML = `
                <div class="users-empty">
                    <p>${t('users.searchError')}</p>
                    <button onclick="document.querySelector('#usersSearchInput').value=''; handleUsersSearch({target:{value:''}})" 
                            style="margin-top: 16px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        ${t('users.clearSearch')}
                    </button>
                </div>
            `;
        }
    }, 300);
}

// ==================== USER DETAIL MODAL ====================

function openUserDetailModal(user) {
    // Show modal first
    document.getElementById('userDetailModalOverlay').style.display = 'flex';

    // Set user name in header
    document.getElementById('userDetailName').textContent = user.name;
    document.getElementById('userDetailUsername').textContent = user.username;

    // Email with copy button
    const emailContainer = document.getElementById('userDetailEmail');
    emailContainer.innerHTML = `
        <span>${user.email}</span>
        <button class="copy-value-btn" onclick="copyUserValue('${user.email}', this)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        </button>
    `;

    // Phone with copy button if exists
    const phoneContainer = document.getElementById('userDetailPhone');
    if (user.phone) {
        phoneContainer.innerHTML = `
            <span>${user.phone}</span>
            <button class="copy-value-btn" onclick="copyUserValue('${user.phone}', this)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            </button>
        `;
    } else {
        phoneContainer.textContent = t('users.detailModal.notProvided');
    }

    document.getElementById('userDetailRole').textContent = user.role ? user.role.name : t('users.detailModal.noRole');

    // Apply translations to labels
    updateUserDetailModalTranslations();
}

function copyUserValue(text, btn) {
    navigator.clipboard.writeText(text);
    const oldContent = btn.innerHTML;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`;
    setTimeout(() => btn.innerHTML = oldContent, 900);
}

function closeUserDetailModal() {
    document.getElementById('userDetailModalOverlay').style.display = 'none';
}

function handleUserDetailOverlayClick(e) {
    if (e.target.id === 'userDetailModalOverlay') {
        closeUserDetailModal();
    }
}

// ==================== ADD USER (PLACEHOLDER) ====================

let availableUserRoles = [];

async function openAddUserModal() {
    document.getElementById('addUserModalOverlay').style.display = 'flex';
    // Load roles first
    await loadUserRoles();

    updateAddUserModalTranslations();
}

function closeAddUserModal() {
    document.getElementById('addUserModalOverlay').style.display = 'none';

    // Reset form
    document.getElementById('addUserName').value = '';
    document.getElementById('addUserUsername').value = '';
    document.getElementById('addUserEmail').value = '';
    document.getElementById('addUserPhone').value = '';
    document.getElementById('addUserRole').value = '';

    // Reset button
    const submitBtn = document.getElementById('addUserSubmitBtn');
    submitBtn.disabled = false;
    submitBtn.textContent = t('users.addUser.createUser');
}

async function loadUserRoles() {
    try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(`${USERS_API}/role`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            }
        });

        if (!response.ok) throw new Error('Failed to fetch roles');

        availableUserRoles = await response.json();
        renderUserRoles();
    } catch (error) {
        console.error('Error loading roles:', error);
        availableUserRoles = [];
    }
}

function renderUserRoles() {
    const addSelect = document.getElementById('addUserRole');
    addSelect.innerHTML = '';  // Clear existing options

    const editSelect = document.getElementById('editUserRole');
    if (editSelect) {
        editSelect.innerHTML = '';  // Clear existing options (no placeholder)
    }

    let developerRoleId = null;

    availableUserRoles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name;
        addSelect.appendChild(option);

        // Detect DEVELOPER role (case-insensitive)
        if (role.name.toUpperCase() === 'DEVELOPER') {
            developerRoleId = role.id;
            option.selected = true;  // Pre-select DEVELOPER
        }

        if (editSelect) {
            const editOption = document.createElement('option');
            editOption.value = role.id;
            editOption.textContent = role.name;
            editSelect.appendChild(editOption);
        }
    });

    // Store the DEVELOPER role ID for fallback
    DEFAULT_DEVELOPER_ROLE_ID = developerRoleId;

    // If DEVELOPER exists, keep it selected
    if (developerRoleId) {
        addSelect.value = developerRoleId;
    }
}

async function submitAddUser() {
    const name = document.getElementById('addUserName').value.trim();
    const username = document.getElementById('addUserUsername').value.trim();
    const email = document.getElementById('addUserEmail').value.trim();
    const phone = document.getElementById('addUserPhone').value.trim();
    let roleId = document.getElementById('addUserRole').value;
    if (!roleId && DEFAULT_DEVELOPER_ROLE_ID !== null) {
        roleId = DEFAULT_DEVELOPER_ROLE_ID;
    }

    if (!name || !username || !email) {
        showToast(t('users.addUser.required'), 'error');
        return;
    }

    const submitBtn = document.getElementById('addUserSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = t('users.addUser.creating');

    try {
        const token = sessionStorage.getItem("token");
        const payload = { name, username, email, phone: phone || null, roleId: roleId || null };

        const response = await fetch(`${USERS_API}/user`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorMessage = t('users.addUser.error');

            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                // Fallback to text if JSON fails
                try {
                    const text = await response.text();
                    if (text.trim()) errorMessage = text.trim();
                } catch (e2) {}
            }

            showToast(errorMessage, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = t('users.addUser.createUser');
            return;
        }

        closeAddUserModal();
        showToast(`${name} ${t('users.addUser.success')}`, 'success');
        loadUsers();

    } catch (error) {
        console.error('Error creating user:', error);
        showToast(t('users.addUser.connectionError'), 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create User';
    }
}

function handleAddUserOverlayClick(e) {
    if (e.target.id === 'addUserModalOverlay') {
        closeAddUserModal();
    }
}

// ==================== EDIT USER ====================

let userToEdit = null;

async function openEditUserModal(user) {
    userToEdit = user;

    document.getElementById('editUserModalOverlay').style.display = 'flex';

    // Load roles first
    await loadUserRoles();

    // Populate form
    document.getElementById('editUserName').value = user.name;
    document.getElementById('editUserUsername').value = user.username;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserPhone').value = user.phone || '';

    // Set role - default to DEVELOPER if user has no role
    const editRoleSelect = document.getElementById('editUserRole');
    if (user.role && user.role.id) {
        editRoleSelect.value = user.role.id;
    } else if (DEFAULT_DEVELOPER_ROLE_ID) {
        editRoleSelect.value = DEFAULT_DEVELOPER_ROLE_ID;
    }

    // Apply translations AFTER modal is visible
    updateEditUserModalTranslations();
}

function closeEditUserModal() {
    document.getElementById('editUserModalOverlay').style.display = 'none';
    userToEdit = null;

    // Reset button
    const submitBtn = document.getElementById('editUserSubmitBtn');
    submitBtn.disabled = false;
    submitBtn.textContent = t('users.editUser.saveChanges');
}

async function submitEditUser() {
    if (!userToEdit) return;

    const name = document.getElementById('editUserName').value.trim();
    const username = document.getElementById('editUserUsername').value.trim();
    const email = document.getElementById('editUserEmail').value.trim();
    const phone = document.getElementById('editUserPhone').value.trim();
    const roleId = document.getElementById('editUserRole').value;

    if (!name || !username || !email) {
        showToast(t('users.editUser.required'), 'error');
        return;
    }

    const submitBtn = document.getElementById('editUserSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = t('users.editUser.updating');

    try {
        const token = sessionStorage.getItem("token");
        const payload = { name, username, email, phone: phone || null, roleId: roleId || null };

        const response = await fetch(`${USERS_API}/user/${userToEdit.id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            let errorMessage = t('users.editUser.error');

            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                try {
                    const text = await response.text();
                    if (text.trim()) errorMessage = text.trim();
                } catch (e2) {}
            }

            showToast(errorMessage, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = t('users.editUser.saveChanges');
            return;
        }

        closeEditUserModal();
        showToast(`${name} ${t('users.editUser.success')}`, 'success');
        loadUsers();

    } catch (error) {
        console.error('Error updating user:', error);
        showToast(t('users.editUser.connectionError'), 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Changes';
    }
}

function handleEditUserOverlayClick(e) {
    if (e.target.id === 'editUserModalOverlay') {
        closeEditUserModal();
    }
}

// ==================== DELETE USER ====================

let userToDelete = null;
let deleteUserCountdownInterval = null;

function openDeleteUserModal(user) {
    userToDelete = user;

    document.getElementById('deleteUserName').textContent = user.name;
    document.getElementById('deleteUserUsername').textContent = user.username;

    document.getElementById('deleteUserOverlay').style.display = 'flex';

    updateDeleteUserModalTranslations();

    startDeleteUserCountdown();
}

function startDeleteUserCountdown() {
    let countdown = 3;
    const confirmBtn = document.getElementById('deleteUserConfirmBtn');

    if (deleteUserCountdownInterval) {
        clearInterval(deleteUserCountdownInterval);
    }

    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `<span class="delete-user-countdown">${countdown}</span>`;

    deleteUserCountdownInterval = setInterval(() => {
        countdown--;

        if (countdown <= 0) {
            clearInterval(deleteUserCountdownInterval);
            deleteUserCountdownInterval = null;
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = t('users.deleteUser.deleteBtn');
        } else {
            confirmBtn.innerHTML = `<span class="delete-user-countdown">${countdown}</span>`;
        }
    }, 1000);
}

function closeDeleteUserModal() {
    document.getElementById('deleteUserOverlay').style.display = 'none';

    if (deleteUserCountdownInterval) {
        clearInterval(deleteUserCountdownInterval);
        deleteUserCountdownInterval = null;
    }

    userToDelete = null;

    // Reset button
    const confirmBtn = document.getElementById('deleteUserConfirmBtn');
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = t('users.deleteUser.deleteBtn');
}

async function confirmDeleteUser() {
    if (!userToDelete) return;

    const confirmBtn = document.getElementById('deleteUserConfirmBtn');
    const userName = userToDelete.name;

    confirmBtn.disabled = true;
    confirmBtn.textContent = t('users.deleteUser.deleting');

    try {
        const token = sessionStorage.getItem("token");

        const response = await fetch(`${USERS_API}/user/${userToDelete.id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            }
        });

        if (!response.ok) {
            let errorMessage = t('users.deleteUser.error');

            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                try {
                    const text = await response.text();
                    if (text.trim()) errorMessage = text.trim();
                } catch (e2) {}
            }

            showToast(errorMessage, 'error');
            confirmBtn.disabled = false;
            confirmBtn.textContent = t('users.deleteUser.deleteBtn');
            return;
        }

        closeDeleteUserModal();
        showToast(`${userName} ${t('users.deleteUser.success')}`, 'success');
        loadUsers();

    } catch (error) {
        console.error('Error deleting user:', error);
        showToast(t('users.deleteUser.connectionError'), 'error');
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Delete User';
    }
}

function handleDeleteUserOverlayClick(e) {
    if (e.target.id === 'deleteUserOverlay') {
        closeDeleteUserModal();
    }
}


// ==================== UPDATE MODAL TRANSLATIONS ====================

// Update Users Page UI translations
function updateUsersPageTranslations() {
    // Update page title and subtitle
    const pageTitle = document.querySelector('#usersPage h1');
    if (pageTitle) pageTitle.textContent = t('users.pageTitle');

    const pageSubtitle = document.querySelector('#usersPage > p');
    if (pageSubtitle) pageSubtitle.textContent = t('users.pageSubtitle');

    // Update search placeholder
    const searchInput = document.querySelector('#usersPage .users-search-input');
    if (searchInput) searchInput.placeholder = t('users.searchPlaceholder');

    // Update "Add User" button
    const addUserBtn = document.querySelector('#usersPage .add-user-btn');
    if (addUserBtn) {
        // Keep the SVG, only update text
        const btnText = addUserBtn.childNodes[addUserBtn.childNodes.length - 1];
        if (btnText && btnText.nodeType === Node.TEXT_NODE) {
            btnText.textContent = t('users.addUserBtn');
        }
    }
}

function updateUserDetailModalTranslations() {
    const modal = document.getElementById('userDetailModalOverlay');
    if (!modal || modal.style.display !== 'flex') return;

    // Update labels - they are direct text after the SVG
    const labels = modal.querySelectorAll('.user-detail-label');

    if (labels[0]) {
        // Keep SVG, replace only text
        const svg = labels[0].querySelector('svg');
        labels[0].innerHTML = '';
        labels[0].appendChild(svg);
        labels[0].appendChild(document.createTextNode(t('users.detailModal.username')));
    }

    if (labels[1]) {
        const svg = labels[1].querySelector('svg');
        labels[1].innerHTML = '';
        labels[1].appendChild(svg);
        labels[1].appendChild(document.createTextNode(t('users.detailModal.email')));
    }

    if (labels[2]) {
        const svg = labels[2].querySelector('svg');
        labels[2].innerHTML = '';
        labels[2].appendChild(svg);
        labels[2].appendChild(document.createTextNode(t('users.detailModal.phone')));
    }

    if (labels[3]) {
        const svg = labels[3].querySelector('svg');
        labels[3].innerHTML = '';
        labels[3].appendChild(svg);
        labels[3].appendChild(document.createTextNode(t('users.detailModal.role')));
    }
}

function updateAddUserModalTranslations() {
    const modal = document.getElementById('addUserModalOverlay');
    if (!modal || modal.style.display !== 'flex') return;

    // Update title
    const title = modal.querySelector('h2');
    if (title) title.textContent = t('users.addUser.title');

    // Update labels
    const labels = modal.querySelectorAll('label');
    if (labels[0]) labels[0].innerHTML = `${t('users.addUser.fullName')} <span class="required">*</span>`;
    if (labels[1]) labels[1].innerHTML = `${t('users.addUser.username')} <span class="required">*</span>`;
    if (labels[2]) labels[2].innerHTML = `${t('users.addUser.email')} <span class="required">*</span>`;
    if (labels[3]) labels[3].textContent = t('users.addUser.phone');
    if (labels[4]) labels[4].textContent = t('users.addUser.role');

    // Update placeholders
    const nameInput = document.getElementById('addUserName');
    if (nameInput) nameInput.placeholder = t('users.addUser.fullNamePlaceholder');

    const usernameInput = document.getElementById('addUserUsername');
    if (usernameInput) usernameInput.placeholder = t('users.addUser.usernamePlaceholder');

    const emailInput = document.getElementById('addUserEmail');
    if (emailInput) emailInput.placeholder = t('users.addUser.emailPlaceholder');

    const phoneInput = document.getElementById('addUserPhone');
    if (phoneInput) phoneInput.placeholder = t('users.addUser.phonePlaceholder');

    // Update hint
    const hint = modal.querySelector('.form-hint');
    if (hint) hint.textContent = t('users.addUser.roleHint');

    // Update buttons
    const cancelBtn = modal.querySelector('.modal-btn-secondary');
    if (cancelBtn) cancelBtn.textContent = t('users.addUser.cancel');

    const submitBtn = document.getElementById('addUserSubmitBtn');
    if (submitBtn && !submitBtn.disabled) submitBtn.textContent = t('users.addUser.createUser');
}

function updateEditUserModalTranslations() {
    const modal = document.getElementById('editUserModalOverlay');
    if (!modal || modal.style.display !== 'flex') return;

    // Update title
    const title = modal.querySelector('h2');
    if (title) title.textContent = t('users.editUser.title');

    // Update labels (same as add)
    const labels = modal.querySelectorAll('label');
    if (labels[0]) labels[0].innerHTML = `${t('users.editUser.fullName')} <span class="required">*</span>`;
    if (labels[1]) labels[1].innerHTML = `${t('users.editUser.username')} <span class="required">*</span>`;
    if (labels[2]) labels[2].innerHTML = `${t('users.editUser.email')} <span class="required">*</span>`;
    if (labels[3]) labels[3].textContent = t('users.editUser.phone');
    if (labels[4]) labels[4].textContent = t('users.editUser.role');

    // Update placeholders
    const nameInput = document.getElementById('editUserName');
    if (nameInput) nameInput.placeholder = t('users.editUser.fullNamePlaceholder');

    const usernameInput = document.getElementById('editUserUsername');
    if (usernameInput) usernameInput.placeholder = t('users.editUser.usernamePlaceholder');

    const emailInput = document.getElementById('editUserEmail');
    if (emailInput) emailInput.placeholder = t('users.editUser.emailPlaceholder');

    const phoneInput = document.getElementById('editUserPhone');
    if (phoneInput) phoneInput.placeholder = t('users.editUser.phonePlaceholder');

    // Update hint
    const hint = modal.querySelector('.form-hint');
    if (hint) hint.textContent = t('users.editUser.roleHint');

    // Update buttons
    const cancelBtn = modal.querySelector('.modal-btn-secondary');
    if (cancelBtn) cancelBtn.textContent = t('users.editUser.cancel');

    const submitBtn = document.getElementById('editUserSubmitBtn');
    if (submitBtn && !submitBtn.disabled) submitBtn.textContent = t('users.editUser.saveChanges');
}

function updateDeleteUserModalTranslations() {
    const modal = document.getElementById('deleteUserOverlay');
    if (!modal || modal.style.display !== 'flex') return;

    // Update title
    const title = modal.querySelector('.delete-user-title h3');
    if (title) title.textContent = t('users.deleteUser.title');

    const subtitle = modal.querySelector('.delete-user-title p');
    if (subtitle) subtitle.textContent = t('users.deleteUser.subtitle');

    // Update warnings
    const warningText = modal.querySelector('.delete-user-warning-text');
    if (warningText) warningText.textContent = t('users.deleteUser.warning');

    const warningSubtext = modal.querySelector('.delete-user-warning-subtext');
    if (warningSubtext) warningSubtext.textContent = t('users.deleteUser.warningText');

    // Update labels
    const labels = modal.querySelectorAll('.delete-user-info strong');
    if (labels[0]) labels[0].textContent = t('users.deleteUser.userName');
    if (labels[1]) labels[1].textContent = t('users.deleteUser.username');

    // Update buttons
    const cancelBtn = modal.querySelector('.delete-user-cancel-btn');
    if (cancelBtn) cancelBtn.textContent = t('users.deleteUser.cancel');

    const confirmBtn = document.getElementById('deleteUserConfirmBtn');
    if (confirmBtn && !confirmBtn.disabled) confirmBtn.textContent = t('users.deleteUser.deleteBtn');
}// ==================== INITIALIZE USERS SECTION ====================

function initUsersSection() {
    console.log('🔧 Initializing Users Section...');

    const usersPage = document.getElementById('usersPage');
    const usersSidebarItem = document.querySelector('[data-page="users"]');

    if (!usersPage) {
        console.error('❌ Users page element not found!');
        return;
    }

    if (!usersSidebarItem) {
        console.error('❌ Users sidebar item not found!');
        return;
    }

    console.log('✅ Users elements found');
    updateUsersPageTranslations();

    // Add click listener to sidebar
    usersSidebarItem.addEventListener('click', () => {
        console.log('🖱️ Users sidebar clicked');
        setTimeout(() => {
            if (usersPage.classList.contains('active')) {
                console.log('📄 Users page is active, loading users...');
                loadUsers();
            }
        }, 100);
    });

    // Add observer to detect when users page becomes active (for other navigation methods)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (usersPage.classList.contains('active') && !isLoadingUsers) {
                    console.log('👁️ Observer detected users page is active');
                    loadUsers();
                }
            }
        });
    });

    observer.observe(usersPage, { attributes: true });
    console.log('👁️ Observer attached to users page');

    // If users page is already active on load, load users
    if (usersPage.classList.contains('active')) {
        console.log('🚀 Users page is active on init, loading users...');
        loadUsers();
    }
}

// Language change handler
window.addEventListener('languageChanged', () => {
    console.log('🌐 Language changed, updating users section...');

    updateUsersPageTranslations();

    const usersPage = document.getElementById('usersPage');
    if (usersPage && usersPage.classList.contains('active')) {
        loadUsers();
    }

    // Update open modals
    updateUserDetailModalTranslations();
    updateAddUserModalTranslations();
    updateEditUserModalTranslations();
    updateDeleteUserModalTranslations();
});

// Single DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    console.log('📦 DOM Content Loaded - Initializing Users Section');
    initUsersSection();
});
// DIAGNOSTIC - Remove after debugging
(function() {
    console.log('🧪 Diagnostic check:');
    console.log('- DOMContentLoaded fired?', document.readyState);
    console.log('- usersPage exists?', !!document.getElementById('usersPage'));
    console.log('- usersSidebarItem exists?', !!document.querySelector('[data-page="users"]'));

    if (document.readyState === 'loading') {
        console.log('⏳ DOM not ready yet, waiting...');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('✅ DOMContentLoaded NOW fired');
            initUsersSection();
        });
    } else {
        console.log('✅ DOM already ready, calling initUsersSection()');
        initUsersSection();
    }
})();