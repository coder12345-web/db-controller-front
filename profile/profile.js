// Store current user data
let currentUserData = null;

// ==================== UPDATE UI TRANSLATIONS ====================

function updateProfilePageTranslations() {
    // Update page header
    const pageTitle = document.querySelector('#profilePage h1');
    if (pageTitle) pageTitle.textContent = t('profilePage.title');

    const pageSubtitle = document.querySelector('#profilePage > p');
    if (pageSubtitle) pageSubtitle.textContent = t('profilePage.subtitle');

    // Update field labels
    const labels = document.querySelectorAll('.profile-info-label');
    if (labels[0]) {
        const svg = labels[0].querySelector('svg');
        labels[0].innerHTML = '';
        labels[0].appendChild(svg);
        labels[0].appendChild(document.createTextNode(t('profilePage.fields.fullName')));
    }
    if (labels[1]) {
        const svg = labels[1].querySelector('svg');
        labels[1].innerHTML = '';
        labels[1].appendChild(svg);
        labels[1].appendChild(document.createTextNode(t('profilePage.fields.username')));
    }
    if (labels[2]) {
        const svg = labels[2].querySelector('svg');
        labels[2].innerHTML = '';
        labels[2].appendChild(svg);
        labels[2].appendChild(document.createTextNode(t('profilePage.fields.email')));
    }
    if (labels[3]) {
        const svg = labels[3].querySelector('svg');
        labels[3].innerHTML = '';
        labels[3].appendChild(svg);
        labels[3].appendChild(document.createTextNode(t('profilePage.fields.phone')));
    }

    // Update placeholders
    const nameInput = document.getElementById('nameInput');
    if (nameInput) nameInput.placeholder = t('profilePage.placeholders.fullName');

    const usernameInput = document.getElementById('usernameInput');
    if (usernameInput) usernameInput.placeholder = t('profilePage.placeholders.username');

    const emailInput = document.getElementById('emailInput');
    if (emailInput) emailInput.placeholder = t('profilePage.placeholders.email');

    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput) phoneInput.placeholder = t('profilePage.placeholders.phone');

    // Update all Edit buttons
    const editButtons = document.querySelectorAll('.profile-edit-btn');
    editButtons.forEach(btn => {
        const svg = btn.querySelector('svg');
        if (svg) {
            btn.innerHTML = '';
            btn.appendChild(svg);
            btn.appendChild(document.createTextNode(t('profilePage.buttons.edit')));
        }
    });

    // Update all Save buttons (only if not disabled/saving)
    const saveButtons = document.querySelectorAll('.profile-save-btn');
    saveButtons.forEach(btn => {
        if (!btn.disabled && btn.textContent.trim() !== t('profilePage.buttons.saving')) {
            const svg = btn.querySelector('svg');
            if (svg) {
                btn.innerHTML = '';
                btn.appendChild(svg);
                btn.appendChild(document.createTextNode(t('profilePage.buttons.save')));
            }
        }
    });

    // Update all Cancel buttons
    const cancelButtons = document.querySelectorAll('.profile-cancel-btn');
    cancelButtons.forEach(btn => {
        const svg = btn.querySelector('svg');
        if (svg) {
            btn.innerHTML = '';
            btn.appendChild(svg);
            btn.appendChild(document.createTextNode(t('profilePage.buttons.cancel')));
        }
    });

    // Update "Not provided" text if visible
    if (currentUserData) {
        const phoneValue = document.getElementById('profilePhoneValue');
        if (phoneValue && !currentUserData.phone) {
            phoneValue.textContent = t('profilePage.fields.notProvided');
        }
    }
}

// ==================== LOAD PROFILE ====================
// ==================== LOAD PROFILE ====================
async function loadProfile() {
    const profileCard = document.querySelector('.profile-card');

    if (!profileCard) {
        console.error('Profile card not found');
        return;
    }

    try {
        // Add loading state
        profileCard.classList.add('loading');

        // Call API to get user profile
        console.log('Fetching profile data...');
        const userData = await apiCall("/user/profile");
        console.log('Profile data received:', userData);

        // Store user data globally
        currentUserData = userData;

        // Update profile information
        document.getElementById('profileName').textContent = userData.name || t('profilePage.fields.na');
        document.getElementById('profileRole').textContent = userData.role?.name || 'USER';

        // Update editable fields
        document.getElementById('profileNameValue').textContent = userData.name || t('profilePage.fields.na');
        document.getElementById('profileUsernameValue').textContent = userData.username || t('profilePage.fields.na');
        document.getElementById('profileEmailValue').textContent = userData.email || t('profilePage.fields.na');
        document.getElementById('profilePhoneValue').textContent = userData.phone || t('profilePage.fields.notProvided');

        // Remove loading state
        profileCard.classList.remove('loading');

        // ✅ ADD THIS: Apply translations after loading data
        updateProfilePageTranslations();

    } catch (error) {
        console.error('Failed to load profile:', error);

        // Remove loading state
        profileCard.classList.remove('loading');

        // Show error message
        showProfileError();
    }
}

// ==================== START EDIT ====================
function startEdit(field) {
    // Hide all other edit modes first
    const allItems = ['name', 'username', 'email', 'phone'];
    allItems.forEach(item => {
        if (item !== field) {
            cancelEdit(item);
        }
    });

    const item = document.getElementById(`${field}Item`);
    const content = item.querySelector('.profile-info-content');
    const edit = item.querySelector('.profile-info-edit');
    const input = document.getElementById(`${field}Input`);
    const currentValue = document.getElementById(`profile${field.charAt(0).toUpperCase() + field.slice(1)}Value`).textContent;

    // Set current value in input (don't set "Not provided" or "N/A" or translated versions)
    const notProvidedTexts = [
        'Not provided', 'N/A',
        'Не указано', 'Н/Д',
        'Ko\'rsatilmagan', 'M/Y'
    ];

    if (!notProvidedTexts.includes(currentValue)) {
        input.value = currentValue;
    } else {
        input.value = '';
    }

    // Toggle visibility
    content.style.display = 'none';
    edit.style.display = 'block';

    // Focus input
    input.focus();
}

// ==================== CANCEL EDIT ====================
function cancelEdit(field) {
    const item = document.getElementById(`${field}Item`);
    const content = item.querySelector('.profile-info-content');
    const edit = item.querySelector('.profile-info-edit');
    const input = document.getElementById(`${field}Input`);

    // Clear input
    input.value = '';

    // Toggle visibility
    content.style.display = 'flex';
    edit.style.display = 'none';
}

// ==================== SAVE EDIT ====================
async function saveEdit(field) {
    const input = document.getElementById(`${field}Input`);
    const newValue = input.value.trim();

    // Get current value from display
    const currentValueElement = document.getElementById(`profile${field.charAt(0).toUpperCase() + field.slice(1)}Value`);
    const currentValue = currentValueElement.textContent;

    // Check if value is one of the "not provided" texts
    const notProvidedTexts = [
        'Not provided', 'N/A',
        'Не указано', 'Н/Д',
        'Ko\'rsatilmagan', 'M/Y'
    ];

    const currentActualValue = notProvidedTexts.includes(currentValue) ? '' : currentValue;

    // Validation
    if (!newValue) {
        showToast(t('profilePage.validation.fieldEmpty'), 'error');
        return;
    }

    if (field === 'email' && !isValidEmail(newValue)) {
        showToast(t('profilePage.validation.invalidEmail'), 'error');
        return;
    }

    // ✅ CHECK IF VALUE ACTUALLY CHANGED
    if (newValue === currentActualValue) {
        console.log('No changes detected, skipping API call');

        // Just close the edit mode and show success without API call
        cancelEdit(field);

        const successMessages = {
            name: t('profilePage.success.nameUpdated'),
            username: t('profilePage.success.usernameUpdated'),
            email: t('profilePage.success.emailUpdated'),
            phone: t('profilePage.success.phoneUpdated')
        };

        showSuccessMessage(successMessages[field]);
        return;
    }

    // Prepare PATCH data - only send the field being edited
    const patchData = {
        name: null,
        username: null,
        email: null,
        phone: null
    };
    patchData[field] = newValue;

    // Get buttons BEFORE the try block
    const saveBtn = document.querySelector(`#${field}Item .profile-save-btn`);
    const cancelBtn = document.querySelector(`#${field}Item .profile-cancel-btn`);

    // Store original button content
    const originalSaveBtnContent = saveBtn.innerHTML;

    try {
        // Disable buttons while saving
        saveBtn.disabled = true;
        cancelBtn.disabled = true;
        saveBtn.textContent = t('profilePage.buttons.saving');

        console.log('Updating profile...', patchData);

        // Call PATCH API
        const updatedData = await apiCall(`/user/${currentUserData.id}`, {
            method: 'PATCH',
            body: JSON.stringify(patchData)
        });

        console.log('Profile updated successfully:', updatedData);

        // Update stored user data
        currentUserData = updatedData;

        // Update UI with new data
        document.getElementById('profileName').textContent = updatedData.name || t('profilePage.fields.na');
        document.getElementById('profileRole').textContent = updatedData.role?.name || 'USER';

        document.getElementById('profileNameValue').textContent = updatedData.name || t('profilePage.fields.na');
        document.getElementById('profileUsernameValue').textContent = updatedData.username || t('profilePage.fields.na');
        document.getElementById('profileEmailValue').textContent = updatedData.email || t('profilePage.fields.na');
        document.getElementById('profilePhoneValue').textContent = updatedData.phone || t('profilePage.fields.notProvided');

        // ✅ IMPORTANT: Reset buttons BEFORE canceling edit
        saveBtn.disabled = false;
        cancelBtn.disabled = false;
        saveBtn.innerHTML = originalSaveBtnContent;

        // Exit edit mode
        cancelEdit(field);

        // Show success message based on field
        const successMessages = {
            name: t('profilePage.success.nameUpdated'),
            username: t('profilePage.success.usernameUpdated'),
            email: t('profilePage.success.emailUpdated'),
            phone: t('profilePage.success.phoneUpdated')
        };

        showSuccessMessage(successMessages[field]);

    } catch (error) {
        console.error('Failed to update profile:', error);
        const errorMessage = t('profilePage.toasts.updateError').replace('{field}', field);
        showToast(error.message || errorMessage, 'error');

        // Re-enable buttons
        saveBtn.disabled = false;
        cancelBtn.disabled = false;
        saveBtn.innerHTML = originalSaveBtnContent;
    }
}

// ==================== HELPER FUNCTIONS ====================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage(message) {
    // Create success toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== SHOW ERROR ====================
function showProfileError() {
    const profileContainer = document.querySelector('.profile-container');
    if (!profileContainer) return;

    profileContainer.innerHTML = `
        <div class="profile-card">
            <div class="profile-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h3>${t('profilePage.error.title')}</h3>
                <p>${t('profilePage.error.message')}</p>
                <button class="profile-retry-btn" onclick="loadProfile()">
                    ${t('profilePage.buttons.retry')}
                </button>
            </div>
        </div>
    `;
}

// ==================== PAGE INITIALIZATION ====================

function initProfilePage() {
    console.log('Initializing profile page...');
    updateProfilePageTranslations();
}

// Listen for language changes
window.addEventListener('languageChanged', () => {
    const profilePage = document.getElementById('profilePage');
    if (profilePage && profilePage.classList.contains('active')) {
        updateProfilePageTranslations();

        // Only update the data values that need translation (like "Not provided")
        if (currentUserData) {
            // Update "Not provided" text for phone if it doesn't exist
            const phoneValue = document.getElementById('profilePhoneValue');
            if (phoneValue && !currentUserData.phone) {
                phoneValue.textContent = t('profilePage.fields.notProvided');
            }

            // Update N/A for any empty fields
            const nameValue = document.getElementById('profileNameValue');
            if (nameValue && !currentUserData.name) {
                nameValue.textContent = t('profilePage.fields.na');
            }

            const usernameValue = document.getElementById('profileUsernameValue');
            if (usernameValue && !currentUserData.username) {
                usernameValue.textContent = t('profilePage.fields.na');
            }

            const emailValue = document.getElementById('profileEmailValue');
            if (emailValue && !currentUserData.email) {
                emailValue.textContent = t('profilePage.fields.na');
            }
        }
    }
});
// ==================== ADD TOAST ANIMATIONS ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Profile page loaded successfully');