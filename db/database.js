// ==================== DATABASE SECTION ====================
const t = (key) => window.t(key); // Translation helper

function updateAddMemberModalTranslations() {
    // Modal title
    const modalTitle = document.getElementById('addMemberModalTitle');
    if (modalTitle && currentDatabase) {
        modalTitle.textContent = `${window.t('databases.addMember.title')} ${currentDatabase.name}`;
    }

    // Step 1 labels
    const step1 = document.getElementById('addMemberStep1');
    if (step1) {
        const searchLabel = step1.querySelector('label[for="userSearchInput"]');
        if (searchLabel) searchLabel.textContent = window.t('databases.addMember.step1Title');

        const searchInput = document.getElementById('userSearchInput');
        if (searchInput) searchInput.placeholder = window.t('databases.addMember.searchPlaceholder');
    }

    // Step 2 labels
    const step2 = document.getElementById('addMemberStep2');
    if (step2) {
        const selectedUserLabel = step2.querySelector('h3');
        if (selectedUserLabel) selectedUserLabel.textContent = window.t('databases.addMember.selectedUser');

        const dbUsernameLabel = step2.querySelector('label[for="dbUsernameInput"]');
        if (dbUsernameLabel) {
            dbUsernameLabel.innerHTML = `${window.t('databases.addMember.dbUsername')} <span class="required">*</span>`;
        }

        const dbUsernameInput = document.getElementById('dbUsernameInput');
        if (dbUsernameInput) dbUsernameInput.placeholder = window.t('databases.addMember.dbUsernamePlaceholder');

        const dbPasswordLabel = step2.querySelectorAll('label')[1];
        if (dbPasswordLabel) {
            dbPasswordLabel.innerHTML = `${window.t('databases.addMember.dbPassword')} <span class="required">*</span>`;
        }

        const dbPasswordInput = document.getElementById('dbPasswordInput');
        if (dbPasswordInput) dbPasswordInput.placeholder = window.t('databases.addMember.dbPasswordPlaceholder');

        const rolesTitle = step2.querySelector('.roles-section h3');
        if (rolesTitle) rolesTitle.textContent = window.t('databases.addMember.selectRoles');

        const availableRolesLabel = step2.querySelector('.roles-section-header label');
        if (availableRolesLabel) availableRolesLabel.textContent = window.t('databases.addMember.availableRoles');

        const selectedRolesLabels = step2.querySelectorAll('.form-group label');
        if (selectedRolesLabels[1]) selectedRolesLabels[1].textContent = window.t('databases.addMember.selectedRoles');
    }

    // Buttons
    const backBtn = document.getElementById('addMemberBackBtn');
    if (backBtn) backBtn.textContent = window.t('databases.addMember.back');

    const cancelBtn = step2?.querySelector('.modal-btn-secondary:not(#addMemberBackBtn)');
    if (cancelBtn) cancelBtn.textContent = window.t('databases.addMember.cancel');

    const nextBtn = document.getElementById('addMemberNextBtn');
    if (nextBtn) nextBtn.textContent = window.t('databases.addMember.next');

    const submitBtn = document.getElementById('addMemberSubmitBtn');
    if (submitBtn && !submitBtn.disabled) submitBtn.textContent = window.t('databases.addMember.addMember');
}

function updateEditMemberModalTranslations() {
    const modalTitle = document.getElementById('editMemberModalTitle');
    const username = memberToEdit?.authUserDto?.username || 'Unknown';
    if (modalTitle) {
        modalTitle.textContent = `${window.t('databases.editMember.title')} ${username}`;
    }

    // Labels in modal
    const modal = document.getElementById('editMemberModalOverlay');
    if (modal) {
        const usernameLabel = modal.querySelector('.edit-member-info-label:nth-child(1)');
        if (usernameLabel) usernameLabel.textContent = window.t('databases.editMember.username');

        const passwordLabel = modal.querySelector('.edit-member-info-label:nth-child(2)');
        if (passwordLabel) passwordLabel.textContent = window.t('databases.editMember.password');

        const hint = modal.querySelector('.edit-roles-hint');
        if (hint) hint.textContent = window.t('databases.editMember.hint');

        const manageRoles = modal.querySelector('.edit-roles-section h3');
        if (manageRoles) manageRoles.textContent = window.t('databases.editMember.manageRoles');

        const availableRolesLabel = modal.querySelector('.roles-section-header label');
        if (availableRolesLabel) availableRolesLabel.textContent = window.t('databases.editMember.availableRoles');

        const selectedRolesLabel = modal.querySelectorAll('.form-group label')[1];
        if (selectedRolesLabel) selectedRolesLabel.textContent = window.t('databases.editMember.selectedRoles');
    }

    // Buttons
    const cancelBtn = document.querySelector('#editMemberModalOverlay .modal-btn-secondary');
    if (cancelBtn) cancelBtn.textContent = window.t('databases.editMember.cancel');

    const submitBtn = document.getElementById('editMemberSubmitBtn');
    if (submitBtn && !submitBtn.disabled) submitBtn.textContent = window.t('databases.editMember.saveChanges');
}

function updateDeleteMemberModalTranslations() {
    const modal = document.getElementById('deleteConfirmOverlay');
    if (!modal) return;

    const title = modal.querySelector('.delete-confirm-title h3');
    if (title) title.textContent = window.t('databases.deleteMember.title');

    const subtitle = modal.querySelector('.delete-confirm-title p');
    if (subtitle) subtitle.textContent = window.t('databases.deleteMember.subtitle');

    const warningText = modal.querySelector('.delete-warning-text');
    if (warningText) warningText.textContent = window.t('databases.deleteMember.warning');

    const warningSubtext = modal.querySelector('.delete-warning-subtext');
    if (warningSubtext) warningSubtext.textContent = window.t('databases.deleteMember.warningText');

    const memberLabel = modal.querySelectorAll('.delete-member-info strong')[0];
    if (memberLabel) memberLabel.textContent = window.t('databases.deleteMember.memberLabel');

    const databaseLabel = modal.querySelectorAll('.delete-member-info strong')[1];
    if (databaseLabel) databaseLabel.textContent = window.t('databases.deleteMember.databaseLabel');

    const cancelBtn = modal.querySelector('.delete-cancel-btn');
    if (cancelBtn) cancelBtn.textContent = window.t('databases.deleteMember.cancel');

    const confirmBtn = document.getElementById('deleteConfirmBtn');
    if (confirmBtn && !confirmBtn.disabled) confirmBtn.textContent = window.t('databases.deleteMember.deleteBtn');
}

// Fetch databases from API
async function fetchDatabases() {
    return await apiCall('/database');
}

// Render database cards
function renderDatabaseCards(databases) {
    const container = document.getElementById('databasesContainer');
    container.innerHTML = '';

    if (!databases || databases.length === 0) {
        container.innerHTML = `
            <div class="database-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
                <p>${window.t('databases.noDatabases')}</p>
            </div>
        `;
        return;
    }

    databases.forEach(db => {
        const card = createDatabaseCard(db);
        container.appendChild(card);
    });
}

// Create individual database card
function createDatabaseCard(db) {
    const card = document.createElement('div');
    card.classList.add('database-card');

    card.innerHTML = `
            <div class="database-card-header">
            <div class="database-card-name">${db.name}</div>
        </div>
    
        <div class="database-members">
            <div class="database-members-header">
                ${window.t('databases.card.members')}
                <span class="member-count">${db.members ? db.members.length : 0}</span>
                <button class="add-member-btn" title="${window.t('databases.card.addMember')}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                </button>
            </div>
            <div class="database-members-list">
            </div>
        </div>
    `;

    const addBtn = card.querySelector('.add-member-btn');
    addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openAddMemberModal(db);
    });

    const membersList = card.querySelector('.database-members-list');
    if (db.members && db.members.length > 0) {
        if (db.members.length > 4) {
            membersList.classList.add('scrollable');
        }

        db.members.forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.classList.add('member-username');

            memberElement.innerHTML = `
                <span class="member-name-text">${member.authUserDto ? member.authUserDto.username : window.t('databases.memberModal.unknownUser')}</span>
                <div class="member-actions">
                    <button class="member-action-btn member-edit-btn" title="${window.t('databases.card.editMember')}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="member-action-btn member-delete-btn" title="${window.t('databases.card.deleteMember')}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;

            const nameText = memberElement.querySelector('.member-name-text');
            nameText.addEventListener('click', (e) => {
                e.stopPropagation();
                openMemberModal(member);
            });

            const editBtn = memberElement.querySelector('.member-edit-btn');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openEditMemberModal(member, db);
            });

            const deleteBtn = memberElement.querySelector('.member-delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteMember(member, db);
            });

            membersList.appendChild(memberElement);
        });
    } else {
        membersList.innerHTML = `<div class="database-empty"><p>${window.t('databases.card.noMembers')}</p></div>`;
    }

    return card;
}

// Open member details modal
function openMemberModal(member) {
    const authUser = member.authUserDto || {};

    const leftContent = `
        <h2>${authUser.name || window.t('databases.memberModal.unknownUser')}</h2>
        
        <div class="auth-user-info">
            <div class="auth-info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <div class="auth-info-content">
                    <div class="auth-info-label">${window.t('databases.memberModal.username')}</div>
                    <div class="auth-info-value">${authUser.username || window.t('databases.memberModal.na')}</div>
                </div>
            </div>
            
            <div class="auth-info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <div class="auth-info-content">
                    <div class="auth-info-label">${window.t('databases.memberModal.email')}</div>
                    <div class="auth-info-value">${authUser.email || window.t('databases.memberModal.na')}</div>
                </div>
            </div>
            
            <div class="auth-info-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <div class="auth-info-content">
                    <div class="auth-info-label">${window.t('databases.memberModal.phone')}</div>
                    <div class="auth-info-value">${authUser.phone || window.t('databases.memberModal.na')}</div>
                </div>
            </div>
        </div>
        
        <div class="role-badge-large">
            <div class="auth-info-label">${window.t('databases.memberModal.role')}</div>
            <div class="auth-info-value">${authUser.role ? authUser.role.name : window.t('databases.memberModal.na')}</div>
        </div>
    `;

    const rolesHtml = member.roles && member.roles.length > 0
        ? member.roles.map(role => `
            <div class="db-role-item">
                <h4>${role.name}</h4>
                <p>${role.description || window.t('databases.memberModal.noDescription')}</p>
            </div>
        `).join('')
        : `<p style="color: #64748b; text-align: center; padding: 20px;">${window.t('databases.memberModal.noRolesAssigned')}</p>`;

    const rightContent = `
        <h3>${window.t('databases.memberModal.databaseInfo')}</h3>
        
        <div class="db-user-info">
            <div class="db-username-display">
                <div class="db-username-label">${window.t('databases.memberModal.databaseUsername')}</div>
                <div class="db-username-value">${member.dbUsername || window.t('databases.memberModal.na')}</div>
            </div>
        </div>
        
        <div class="db-roles-section">
            <div class="db-roles-title">${window.t('databases.memberModal.databaseRoles')}</div>
            <div class="db-roles-list">
                ${rolesHtml}
            </div>
        </div>
    `;

    document.getElementById("memberModalLeft").innerHTML = leftContent;
    document.getElementById("memberModalRight").innerHTML = rightContent;
    document.getElementById("memberModalOverlay").style.display = "flex";
}

function closeMemberModal() {
    document.getElementById("memberModalOverlay").style.display = "none";
}

function handleMemberModalOverlayClick(e) {
    if (e.target.id === "memberModalOverlay") {
        closeMemberModal();
    }
}

async function loadDatabases() {
    const container = document.getElementById('databasesContainer');

    container.innerHTML = `
        <div class="database-loading">
            <div class="loading-spinner"></div>
            <p>${window.t('databases.loading')}</p>
        </div>
    `;

    try {
        const databases = await fetchDatabases();
        renderDatabaseCards(databases);
    } catch (error) {
        console.error('Error loading databases:', error);
        container.innerHTML = `
            <div class="database-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>${window.t('databases.loadError')}</p>
            </div>
        `;
    }
}

function initDatabaseSection() {
    const databasesPage = document.getElementById('databasesPage');
    const databaseSidebarItem = document.querySelector('[data-page="databases"]');

    if (databaseSidebarItem) {
        databaseSidebarItem.addEventListener('click', () => {
            if (databasesPage.classList.contains('active')) {
                loadDatabases();
            }
        });
    }
}

// Make functions available for language change events
window.loadDatabases = loadDatabases;

// Listen for language changes
window.addEventListener('languageChanged', () => {
    const databasesPage = document.getElementById('databasesPage');
    if (databasesPage && databasesPage.classList.contains('active')) {
        loadDatabases();
    }
});

// Add after initDatabaseSection()

function updateDatabasesPageHeaders() {
    const databasesPage = document.getElementById('databasesPage');
    if (!databasesPage) return;

    const h1 = databasesPage.querySelector('h1');
    const p = databasesPage.querySelector('p');

    if (h1) h1.textContent = window.t('databases.pageTitle');
    if (p) p.textContent = window.t('databases.pageSubtitle');
}

// Call on page load
document.addEventListener('DOMContentLoaded', () => {
    initDatabaseSection();
    updateDatabasesPageHeaders(); // Add this
});

// Update on language change
window.addEventListener('languageChanged', () => {
    updateDatabasesPageHeaders();

    const databasesPage = document.getElementById('databasesPage');
    if (databasesPage && databasesPage.classList.contains('active')) {
        loadDatabases();
    }
});

// ==================== ADD MEMBER MODAL ====================

let currentDatabase = null;
let selectedUser = null;
let searchTimeout = null;
let availableRoles = [];
let selectedRoles = [];

function openAddMemberModal(database) {
    currentDatabase = database;
    selectedUser = null;
    selectedRoles = [];

    document.getElementById('addMemberModalTitle').textContent = `Add Member to ${database.name}`;
    document.getElementById('addMemberModalOverlay').style.display = 'flex';
    updateAddMemberModalTranslations();

    showAddMemberStep(1);
    searchUsers('');
}

function closeAddMemberModal() {
    document.getElementById('addMemberModalOverlay').style.display = 'none';
    closeRolesExpandModal(); // Close roles modal when main modal closes

    currentDatabase = null;
    selectedUser = null;
    selectedRoles = [];

    document.getElementById('userSearchInput').value = '';
    document.getElementById('dbUsernameInput').value = '';
    document.getElementById('dbPasswordInput').value = '';

    const submitBtn = document.getElementById('addMemberSubmitBtn');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Member';

    showAddMemberStep(1);
}

function showAddMemberStep(step) {
    document.querySelectorAll('.add-member-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`addMemberStep${step}`).classList.add('active');

    const backBtn = document.getElementById('addMemberBackBtn');
    const nextBtn = document.getElementById('addMemberNextBtn');
    const submitBtn = document.getElementById('addMemberSubmitBtn');

    if (step === 1) {
        backBtn.style.display = 'none';
        nextBtn.style.display = 'inline-block';
        submitBtn.style.display = 'none';
        nextBtn.disabled = !selectedUser;
    } else {
        backBtn.style.display = 'inline-block';
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-block';
    }
}

async function searchUsers(query) {
    const userList = document.getElementById('userList');
    userList.innerHTML = '<div class="user-loading">Searching...</div>';

    try {
        const searchParam = query.trim() || '';
        const users = await apiCall(`/user?search=${encodeURIComponent(searchParam)}`);
        renderUserList(users);
    } catch (error) {
        console.error('Error searching users:', error);
        userList.innerHTML = '<div class="user-empty">Failed to load users</div>';
    }
}

function handleUserSearch(event) {
    const query = event.target.value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => searchUsers(query), 300);
}

function renderUserList(users) {
    const userList = document.getElementById('userList');

    if (!users || users.length === 0) {
        userList.innerHTML = '<div class="user-empty">No users found</div>';
        return;
    }

    userList.innerHTML = '';
    users.forEach(user => {
        const userItem = document.createElement('div');
        userItem.classList.add('user-item');
        if (selectedUser && selectedUser.id === user.id) {
            userItem.classList.add('selected');
        }

        userItem.innerHTML = `
            <div class="user-item-name">${user.name}</div>
            <div class="user-item-details">@${user.username} • ${user.email}</div>
        `;

        userItem.addEventListener('click', () => selectUser(user));
        userList.appendChild(userItem);
    });
}

function selectUser(user) {
    selectedUser = user;
    document.querySelectorAll('.user-item').forEach(item => item.classList.remove('selected'));
    event.target.closest('.user-item').classList.add('selected');
    document.getElementById('addMemberNextBtn').disabled = false;
}

async function goToNextStep() {
    if (!selectedUser) return;
    document.getElementById('selectedUserName').textContent = selectedUser.name;

    // Load roles for the specific database
    await loadAvailableRoles();

    renderSelectedRoles();
    showAddMemberStep(2);
}

function goBackStep() {
    showAddMemberStep(1);
}

async function submitAddMember() {
    const dbUsername = document.getElementById('dbUsernameInput').value.trim();
    const dbPassword = document.getElementById('dbPasswordInput').value.trim();

    if (!dbUsername || !dbPassword) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    // Validate database username - PostgreSQL doesn't allow special characters
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(dbUsername)) {
        showToast('Database username can only contain letters, numbers, and underscores', 'error');
        return;
    }

    const submitBtn = document.getElementById('addMemberSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    try {
        const payload = {
            dbUsername: dbUsername,
            dbPassword: dbPassword,
            databaseId: currentDatabase.id,
            authUserId: selectedUser.id,
            roleIds: selectedRoles.map(role => role.id)
        };

        await apiCall('/databaseUser', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        const userName = selectedUser.name;
        const dbName = currentDatabase.name;

        closeAddMemberModal();
        showToast(`${userName} has been added to ${dbName}`, 'success');
        loadDatabases();

    } catch (error) {
        console.error('Error adding member:', error);
        // Display the actual error message from backend
        const errorMsg = error.message || 'Could not add member. Please try again.';
        showToast(errorMsg, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Member';
    }
}

function handleAddMemberOverlayClick(e) {
    if (e.target.id === 'addMemberModalOverlay') {
        closeAddMemberModal();
    }
}

// ==================== ROLE MANAGEMENT ====================

async function loadAvailableRoles() {
    if (!currentDatabase && !memberToEdit) {
        console.error('No database selected');
        availableRoles = [];
        return;
    }

    const databaseId = currentDatabase ? currentDatabase.id : memberToEdit.databaseId;

    try {
        console.log(`🔄 Loading roles for database ID: ${databaseId}`);
        availableRoles = await apiCall(`/database-role/all/${databaseId}`);
        console.log('✅ Roles loaded:', availableRoles.length, 'roles');
    } catch (error) {
        console.error('❌ Error loading roles:', error);
        availableRoles = [];
        showToast('Failed to load database roles', 'error');
    }
}

function renderSelectedRoles() {
    const container = document.getElementById('selectedRolesList');
    container.innerHTML = '';

    if (selectedRoles.length === 0) {
        container.innerHTML = '<div class="empty-roles-message">No roles selected</div>';
        return;
    }

    selectedRoles.forEach(role => {
        const roleItem = document.createElement('div');
        roleItem.classList.add('selected-role-item');

        roleItem.innerHTML = `
            <div class="role-item-name">${role.name}</div>
            <div class="role-item-description">${role.description || 'No description'}</div>
            <button class="remove-role-btn" title="Remove role">×</button>
        `;

        const removeBtn = roleItem.querySelector('.remove-role-btn');
        removeBtn.addEventListener('click', () => removeRole(role.id));

        container.appendChild(roleItem);
    });
}

function addRole(role) {
    if (!selectedRoles.some(r => r.id === role.id)) {
        selectedRoles.push(role);
        renderRolesExpandModal();
        renderSelectedRoles();
    }
}

function removeRole(roleId) {
    selectedRoles = selectedRoles.filter(r => r.id !== roleId);
    renderRolesExpandModal();
    renderSelectedRoles();
}

// ==================== ROLES EXPAND MODAL (ADD MEMBER) ====================

function openRolesExpandModal() {
    const modal = document.getElementById('rolesExpandModal');
    const mainModal = document.getElementById('addMemberModalOverlay');

    modal.style.display = 'flex';
    mainModal.classList.add('shifted-left');

    renderRolesExpandModal();
}

function closeRolesExpandModal() {
    const modal = document.getElementById('rolesExpandModal');
    const mainModal = document.getElementById('addMemberModalOverlay');

    modal.style.display = 'none';
    mainModal.classList.remove('shifted-left');
}

function renderRolesExpandModal() {
    const container = document.getElementById('rolesExpandList');
    container.innerHTML = '';

    if (availableRoles.length === 0) {
        container.innerHTML = '<div class="empty-roles-message">No roles available for this database</div>';
        return;
    }

    availableRoles.forEach(role => {
        const isSelected = selectedRoles.some(r => r.id === role.id);

        const roleItem = document.createElement('div');
        roleItem.classList.add('role-item-selectable');
        if (isSelected) {
            roleItem.classList.add('disabled');
        }

        roleItem.innerHTML = `
            <div class="role-item-content">
                <div class="role-item-name">${role.name}</div>
                <div class="role-item-description">${role.description || 'No description'}</div>
            </div>
            ${isSelected ? '<span class="role-selected-badge">✓ Selected</span>' : ''}
        `;

        if (!isSelected) {
            roleItem.addEventListener('click', () => addRole(role));
        }

        container.appendChild(roleItem);
    });
}

function handleRolesExpandOverlayClick(e) {
    if (e.target.id === 'rolesExpandModal') {
        closeRolesExpandModal();
    }
}

// ==================== EDIT MEMBER ====================

let memberToEdit = null;
let editSelectedRoles = [];
let originalEditRoles = []; // Add this line

function openEditMemberModal(member, database) {
    memberToEdit = member;
    editSelectedRoles = member.roles ? [...member.roles] : [];
    currentDatabase = database;

    // Store original roles for comparison
    originalEditRoles = member.roles ? [...member.roles] : [];

    const username = member.authUserDto ? member.authUserDto.username : 'Unknown';

    document.getElementById('editMemberModalTitle').textContent = `Edit Member: ${username}`;
    document.getElementById('editMemberUsername').textContent = member.dbUsername || 'N/A';
    document.getElementById('editMemberPassword').textContent = '••••••••';

    loadAvailableRolesForEdit();
    document.getElementById('editMemberModalOverlay').style.display = 'flex';
    updateEditMemberModalTranslations();
}

function closeEditMemberModal() {
    document.getElementById('editMemberModalOverlay').style.display = 'none';
    closeEditRolesExpandModal(); // Close roles modal when main modal closes

    memberToEdit = null;
    editSelectedRoles = [];
    currentDatabase = null;

    const submitBtn = document.getElementById('editMemberSubmitBtn');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Save Changes';
}

async function loadAvailableRolesForEdit() {
    try {
        await loadAvailableRoles();
        renderEditSelectedRoles();
    } catch (error) {
        console.error('Error loading roles:', error);
        availableRoles = [];
    }
}

function renderEditSelectedRoles() {
    const container = document.getElementById('editSelectedRolesList');
    container.innerHTML = '';

    if (editSelectedRoles.length === 0) {
        container.innerHTML = '<div class="empty-roles-message">No roles selected</div>';
        return;
    }

    editSelectedRoles.forEach(role => {
        const roleItem = document.createElement('div');
        roleItem.classList.add('selected-role-item');

        roleItem.innerHTML = `
            <div class="role-item-name">${role.name}</div>
            <div class="role-item-description">${role.description || 'No description'}</div>
            <button class="remove-role-btn" title="Remove role">×</button>
        `;

        const removeBtn = roleItem.querySelector('.remove-role-btn');
        removeBtn.addEventListener('click', () => removeEditRole(role.id));

        container.appendChild(roleItem);
    });
}

function addEditRole(role) {
    if (!editSelectedRoles.some(r => r.id === role.id)) {
        editSelectedRoles.push(role);
        renderEditRolesExpandModal();
        renderEditSelectedRoles();
    }
}

function removeEditRole(roleId) {
    editSelectedRoles = editSelectedRoles.filter(r => r.id !== roleId);
    renderEditRolesExpandModal();
    renderEditSelectedRoles();
}

async function submitEditMember() {
    if (!memberToEdit) {
        showToast('No member selected for editing', 'error');
        return;
    }

    // Check if roles have changed
    const rolesChanged = !areRolesEqual(originalEditRoles, editSelectedRoles);

    if (!rolesChanged) {
        closeEditMemberModal();
        showToast(`changes are successfully saved`, 'success');
        return;
    }

    const submitBtn = document.getElementById('editMemberSubmitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating...';

    try {
        const payload = {
            dbUsername: memberToEdit.dbUsername,
            dbPassword: memberToEdit.dbPassword,
            databaseId: memberToEdit.databaseId,
            authUserId: memberToEdit.authUserDto.id,
            roleIds: editSelectedRoles.map(role => role.id)
        };

        await apiCall(`/databaseUser/${memberToEdit.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });

        const userName = memberToEdit.authUserDto ? memberToEdit.authUserDto.username : 'Member';

        closeEditMemberModal();
        showToast(`${userName}'s roles have been updated successfully`, 'success');
        loadDatabases();

    } catch (error) {
        console.error('Error updating member:', error);
        const errorMsg = error.message || 'Could not update member. Please try again.';
        showToast(errorMsg, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Changes';
    }
}

// Helper function to compare two role arrays
function areRolesEqual(roles1, roles2) {
    if (roles1.length !== roles2.length) {
        return false;
    }

    const ids1 = roles1.map(r => r.id).sort();
    const ids2 = roles2.map(r => r.id).sort();

    return ids1.every((id, index) => id === ids2[index]);
}

function handleEditMemberOverlayClick(e) {
    if (e.target.id === 'editMemberModalOverlay') {
        closeEditMemberModal();
    }
}

// ==================== EDIT ROLES EXPAND MODAL ====================

function openEditRolesExpandModal() {
    const modal = document.getElementById('editRolesExpandModal');
    const mainModal = document.getElementById('editMemberModalOverlay');

    modal.style.display = 'flex';
    mainModal.classList.add('shifted-left');

    renderEditRolesExpandModal();
}

function closeEditRolesExpandModal() {
    const modal = document.getElementById('editRolesExpandModal');
    const mainModal = document.getElementById('editMemberModalOverlay');

    modal.style.display = 'none';
    mainModal.classList.remove('shifted-left');
}

function renderEditRolesExpandModal() {
    const container = document.getElementById('editRolesExpandList');
    container.innerHTML = '';

    if (availableRoles.length === 0) {
        container.innerHTML = '<div class="empty-roles-message">No roles available for this database</div>';
        return;
    }

    availableRoles.forEach(role => {
        const isSelected = editSelectedRoles.some(r => r.id === role.id);

        const roleItem = document.createElement('div');
        roleItem.classList.add('role-item-selectable');
        if (isSelected) {
            roleItem.classList.add('disabled');
        }

        roleItem.innerHTML = `
            <div class="role-item-content">
                <div class="role-item-name">${role.name}</div>
                <div class="role-item-description">${role.description || 'No description'}</div>
            </div>
            ${isSelected ? '<span class="role-selected-badge">✓ Selected</span>' : ''}
        `;

        if (!isSelected) {
            roleItem.addEventListener('click', () => addEditRole(role));
        }

        container.appendChild(roleItem);
    });
}

function handleEditRolesExpandOverlayClick(e) {
    if (e.target.id === 'editRolesExpandModal') {
        closeEditRolesExpandModal();
    }
}

// ==================== DELETE MEMBER ====================

let deleteCountdownInterval = null;
let memberToDelete = null;
let databaseForDelete = null;

async function deleteMember(member, database) {
    memberToDelete = member;
    databaseForDelete = database;

    const username = member.authUserDto ? member.authUserDto.username : 'Unknown User';
    const dbName = database.name;

    document.getElementById('deleteMemberName').textContent = username;
    document.getElementById('deleteDatabaseName').textContent = dbName;

    document.getElementById('deleteConfirmOverlay').style.display = 'flex';
    updateDeleteMemberModalTranslations();
    startDeleteCountdown();
}

function startDeleteCountdown() {
    let countdown = 3;
    const confirmBtn = document.getElementById('deleteConfirmBtn');

    if (deleteCountdownInterval) {
        clearInterval(deleteCountdownInterval);
    }

    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `<span class="delete-countdown" id="deleteCountdown">${countdown}</span>`;

    deleteCountdownInterval = setInterval(() => {
        countdown--;

        if (countdown <= 0) {
            clearInterval(deleteCountdownInterval);
            deleteCountdownInterval = null;
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = 'Delete Member';
        } else {
            confirmBtn.innerHTML = `<span class="delete-countdown">${countdown}</span>`;
        }
    }, 1000);
}

function closeDeleteModal() {
    document.getElementById('deleteConfirmOverlay').style.display = 'none';

    if (deleteCountdownInterval) {
        clearInterval(deleteCountdownInterval);
        deleteCountdownInterval = null;
    }

    memberToDelete = null;
    databaseForDelete = null;

    const confirmBtn = document.getElementById('deleteConfirmBtn');
    confirmBtn.disabled = false;
    confirmBtn.innerHTML = 'Delete Member';
}

async function confirmDeleteMember() {
    if (!memberToDelete) return;

    const confirmBtn = document.getElementById('deleteConfirmBtn');
    const username = memberToDelete.authUserDto ? memberToDelete.authUserDto.username : 'Member';

    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Deleting...';

    try {
        await apiCall(`/databaseUser/${memberToDelete.id}`, {
            method: 'DELETE'
        });

        closeDeleteModal();
        showToast(`${username} has been removed from the database`, 'success');
        loadDatabases();

    } catch (error) {
        console.error('Error deleting member:', error);
        showToast('Could not delete member. Please try again.', 'error');
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Delete Member';
    }
}



// ==================== INITIALIZE ====================

document.addEventListener('DOMContentLoaded', () => {
    initDatabaseSection();
});

window.addEventListener('languageChanged', () => {
    updateDatabasesPageHeaders();

    const databasesPage = document.getElementById('databasesPage');
    if (databasesPage && databasesPage.classList.contains('active')) {
        loadDatabases();
    }

    // Update open modals
    if (document.getElementById('addMemberModalOverlay').style.display === 'flex') {
        updateAddMemberModalTranslations();
    }
    if (document.getElementById('editMemberModalOverlay').style.display === 'flex') {
        updateEditMemberModalTranslations();
    }
    if (document.getElementById('deleteConfirmOverlay').style.display === 'flex') {
        updateDeleteMemberModalTranslations();
    }
});