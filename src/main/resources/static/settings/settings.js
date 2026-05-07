function getToken() {
    return sessionStorage.getItem("token");
}

// ==================== TOAST NOTIFICATION SYSTEM ====================

function showToast(message, type = 'success', duration = 3000) {
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;

    const icon = type === 'success'
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
             <polyline points="20 6 9 17 4 12"></polyline>
           </svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
             <circle cx="12" cy="12" r="10"></circle>
             <line x1="15" y1="9" x2="9" y2="15"></line>
             <line x1="9" y1="9" x2="15" y2="15"></line>
           </svg>`;

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('toast-show');
    });

    setTimeout(() => {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ==================== UPDATE SETTINGS PAGE TRANSLATIONS ====================

function updateSettingsPageTranslations() {
    console.log('🌐 Updating settings page translations...');

    const elementsToTranslate = document.querySelectorAll('#settingsPage [data-i18n]');

    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);

        if (element.tagName === 'BUTTON' && element.querySelector('svg')) {
            const svg = element.querySelector('svg');
            const span = element.querySelector('span');
            if (span) {
                span.textContent = translation;
            } else {
                element.innerHTML = '';
                element.appendChild(svg.cloneNode(true));
                element.appendChild(document.createTextNode(translation));
            }
        } else if (element.tagName === 'OPTION') {
            element.textContent = translation;
        } else {
            element.textContent = translation;
        }
    });

    console.log('✅ Settings page translations updated');
}

// ==================== CHANGE PASSWORD FUNCTIONALITY ====================

let passwordAttempts = 0;
const MAX_PASSWORD_ATTEMPTS = 5;

function handleChangePassword() {
    passwordAttempts = 0;
    showPasswordModal();
}

function showPasswordModal() {
    // Remove any existing password modal
    document.getElementById('passwordModal')?.remove();

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'passwordModal';

    // NOTE: All input IDs are prefixed with "settings-" to avoid colliding
    // with the main page's static #newPasswordInput modal element in main.html.
    modal.innerHTML = `
        <div class="password-modal">
            <button class="modal-close" onclick="closePasswordModal()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            
            <!-- Step 1: Verify Current Password -->
            <div id="passwordStep1" class="password-modal-step active">
                <div class="password-modal-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <h2>${t('settingsPage.passwordModal.step1.title')}</h2>
                    <p>${t('settingsPage.passwordModal.step1.subtitle')}</p>
                </div>
                
                <div class="password-modal-content">
                    <div class="password-input-group">
                        <label for="settings-currentPassword">${t('settingsPage.passwordModal.step1.currentPassword')}</label>
                        <div class="password-input-wrapper">
                            <input 
                                type="password" 
                                id="settings-currentPassword" 
                                class="password-modal-input"
                                placeholder="${t('settingsPage.passwordModal.step1.placeholder')}"
                                autocomplete="current-password"
                            />
                            <button type="button" class="password-visibility-toggle" onclick="toggleSettingsPasswordVisibility('settings-currentPassword')">
                                <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <svg class="eye-off-icon" style="display:none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="password-attempts-warning" id="attemptsWarning" style="display: none;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                            <span id="attemptsText"></span>
                        </div>
                    </div>
                    
                    <div class="password-modal-actions">
                        <button class="password-btn password-btn-secondary" onclick="closePasswordModal()">
                            ${t('settingsPage.passwordModal.step1.cancel')}
                        </button>
                        <button class="password-btn password-btn-primary" id="verifyPasswordBtn">
                            <span>${t('settingsPage.passwordModal.step1.continue')}</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Step 2: Enter New Password -->
            <div id="passwordStep2" class="password-modal-step">
                <div class="password-modal-header">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    <h2>${t('settingsPage.passwordModal.step2.title')}</h2>
                    <p>${t('settingsPage.passwordModal.step2.subtitle')}</p>
                </div>
                
                <div class="password-modal-content">
                    <div class="password-input-group">
                        <label for="settings-newPasswordInput">${t('settingsPage.passwordModal.step2.newPassword')}</label>
                        <div class="password-input-wrapper">
                            <input 
                                type="password" 
                                id="settings-newPasswordInput" 
                                class="password-modal-input"
                                placeholder="${t('settingsPage.passwordModal.step2.newPasswordPlaceholder')}"
                                autocomplete="new-password"
                            />
                            <button type="button" class="password-visibility-toggle" onclick="toggleSettingsPasswordVisibility('settings-newPasswordInput')">
                                <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <svg class="eye-off-icon" style="display:none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="password-input-group">
                        <label for="settings-confirmPassword">${t('settingsPage.passwordModal.step2.confirmPassword')}</label>
                        <div class="password-input-wrapper">
                            <input 
                                type="password" 
                                id="settings-confirmPassword" 
                                class="password-modal-input"
                                placeholder="${t('settingsPage.passwordModal.step2.confirmPasswordPlaceholder')}"
                                autocomplete="new-password"
                            />
                            <button type="button" class="password-visibility-toggle" onclick="toggleSettingsPasswordVisibility('settings-confirmPassword')">
                                <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <svg class="eye-off-icon" style="display:none;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="password-requirements">
                        <div class="requirement-item" id="req-length">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            <span>${t('settingsPage.passwordModal.requirements.length')}</span>
                        </div>
                        <div class="requirement-item" id="req-match">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            <span>${t('settingsPage.passwordModal.requirements.match')}</span>
                        </div>
                    </div>
                    
                    <div class="password-modal-actions">
                        <button class="password-btn password-btn-secondary" onclick="closePasswordModal()">
                            <span>${t('settingsPage.passwordModal.step2.cancel')}</span>
                        </button>
                        <button class="password-btn password-btn-primary" id="saveAccountPasswordBtn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            <span>${t('settingsPage.passwordModal.step2.save')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // ✅ CRITICAL: Attach event listeners AFTER modal is in DOM
    setTimeout(() => {
        console.log('🔧 Attaching event listeners to password modal...');

        // Step 1: Verify button
        const verifyBtn = document.getElementById('verifyPasswordBtn');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', verifyCurrentPassword);
            console.log('✓ Verify button listener attached');
        } else {
            console.error('❌ Verify button not found!');
        }

        // Step 2: Save button
        const saveBtn = document.getElementById('saveAccountPasswordBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', saveNewAccountPassword);
            console.log('✓ Save button listener attached');
        } else {
            console.error('❌ Save button not found!');
        }

        // Enter key support for step 1
        const currentPasswordInput = document.getElementById('settings-currentPassword');
        if (currentPasswordInput) {
            currentPasswordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') verifyCurrentPassword();
            });
            currentPasswordInput.focus();
        }

        // Real-time validation for step 2
        const newPasswordInput = document.getElementById('settings-newPasswordInput');
        const confirmPasswordInput = document.getElementById('settings-confirmPassword');
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', validatePasswordRequirements);
        }
        if (confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', validatePasswordRequirements);
        }
    }, 50);
}

function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) modal.remove();
    passwordAttempts = 0;
}

function toggleSettingsPasswordVisibility(inputId) {
    const input = document.getElementById(inputId);

    if (!input) {
        console.error('Password input not found:', inputId);
        return;
    }

    const wrapper = input.parentElement;
    if (!wrapper) {
        console.error('Password wrapper not found');
        return;
    }

    const button = wrapper.querySelector('.password-visibility-toggle');
    if (!button) {
        console.error('Toggle button not found');
        return;
    }

    const eyeIcon = button.querySelector('.eye-icon');
    const eyeOffIcon = button.querySelector('.eye-off-icon');

    if (!eyeIcon || !eyeOffIcon) {
        console.error('Eye icons not found');
        return;
    }

    if (input.type === 'password') {
        input.type = 'text';
        eyeIcon.style.display = 'none';
        eyeOffIcon.style.display = 'block';
    } else {
        input.type = 'password';
        eyeIcon.style.display = 'block';
        eyeOffIcon.style.display = 'none';
    }
}

async function verifyCurrentPassword() {
    console.log('🔐 Verifying current password...');

    const currentPasswordInput = document.getElementById('settings-currentPassword');

    if (!currentPasswordInput) {
        console.error('❌ Current password input not found');
        showToast('Error: Password field not found', 'error');
        return;
    }

    const currentPassword = currentPasswordInput.value.trim();

    if (!currentPassword) {
        showToast(t('settingsPage.passwordModal.toasts.fillAllFields'), 'error');
        return;
    }

    const button = document.getElementById('verifyPasswordBtn');
    if (!button) return;

    button.disabled = true;
    button.innerHTML = '<span>Verifying...</span>';

    try {
        const encodedPassword = btoa(currentPassword);

        const response = await fetch(`http://localhost:8080/api/v1/user/password?password=${encodeURIComponent(encodedPassword)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Connection error');
        }

        const isValid = await response.json();

        if (isValid) {
            passwordAttempts = 0;
            showStep2();
            showToast('Password verified successfully!', 'success');
        } else {
            passwordAttempts++;
            const remainingAttempts = MAX_PASSWORD_ATTEMPTS - passwordAttempts;

            if (remainingAttempts > 0) {
                showToast(`Incorrect password. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining.`, 'error');
                showAttemptsWarning(remainingAttempts);
                currentPasswordInput.value = '';
                currentPasswordInput.focus();
            } else {
                showToast('Too many failed attempts. Redirecting to login...', 'error', 3000);
                setTimeout(() => {
                    sessionStorage.removeItem('token');
                    window.location.href = "/login";
                }, 3000);
            }

            button.disabled = false;
            button.innerHTML = `
                <span>${t('settingsPage.passwordModal.step1.continue')}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            `;
        }
    } catch (error) {
        console.error('❌ Password verification failed:', error);
        showToast('Connection error. Please try again.', 'error');

        button.disabled = false;
        button.innerHTML = `
            <span>${t('settingsPage.passwordModal.step1.continue')}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        `;
    }
}

function showAttemptsWarning(remainingAttempts) {
    const warning = document.getElementById('attemptsWarning');
    const text = document.getElementById('attemptsText');
    if (warning && text) {
        const warningText = t('settingsPage.passwordModal.warnings.attemptRemaining')
            .replace('{count}', remainingAttempts)
            .replace('{s}', remainingAttempts > 1 ? t('settingsPage.passwordModal.warnings.attempts') : t('settingsPage.passwordModal.warnings.attempt'));
        text.textContent = warningText;
        warning.style.display = 'flex';
    }
}

function showStep2() {
    console.log('🔄 Moving to step 2...');

    const step1 = document.getElementById('passwordStep1');
    const step2 = document.getElementById('passwordStep2');

    if (!step1 || !step2) {
        console.error('❌ Step elements not found!');
        return;
    }

    step1.classList.remove('active');
    step2.classList.add('active');

    setTimeout(() => {
        const newPasswordInput = document.getElementById('settings-newPasswordInput');
        if (newPasswordInput) {
            newPasswordInput.focus();
            console.log('✓ Focused on new password input');
        }
    }, 100);
}

function goBackToStep1() {
    const step1 = document.getElementById('passwordStep1');
    const step2 = document.getElementById('passwordStep2');
    const currentPasswordInput = document.getElementById('settings-currentPassword');
    const attemptsWarning = document.getElementById('attemptsWarning');

    if (step2) step2.classList.remove('active');
    if (step1) step1.classList.add('active');
    if (currentPasswordInput) currentPasswordInput.value = '';
    if (attemptsWarning) attemptsWarning.style.display = 'none';

    setTimeout(() => {
        if (currentPasswordInput) currentPasswordInput.focus();
    }, 100);
}

function validatePasswordRequirements() {
    const newPasswordInput = document.getElementById('settings-newPasswordInput');
    const confirmPasswordInput = document.getElementById('settings-confirmPassword');
    const lengthReq = document.getElementById('req-length');
    const matchReq = document.getElementById('req-match');

    if (!newPasswordInput || !confirmPasswordInput || !lengthReq || !matchReq) {
        return;
    }

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword.length >= 8) {
        lengthReq.classList.add('valid');
    } else {
        lengthReq.classList.remove('valid');
    }

    if (newPassword && confirmPassword && newPassword === confirmPassword) {
        matchReq.classList.add('valid');
    } else {
        matchReq.classList.remove('valid');
    }
}

async function saveNewAccountPassword(event) {
    console.log('💾 Saving new account password...');

    const newPasswordInput = document.getElementById('settings-newPasswordInput');
    const confirmPasswordInput = document.getElementById('settings-confirmPassword');

    if (!newPasswordInput || !confirmPasswordInput) {
        console.error('❌ Password inputs not found');
        showToast(t('settingsPage.passwordModal.toasts.fillAllFields'), 'error');
        return;
    }

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!newPassword || !confirmPassword) {
        showToast(t('settingsPage.passwordModal.toasts.fillAllFields'), 'error');
        return;
    }

    if (newPassword.length < 8) {
        showToast(t('settingsPage.passwordModal.toasts.minLength'), 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast(t('settingsPage.passwordModal.toasts.noMatch'), 'error');
        return;
    }

    const button = document.getElementById('saveAccountPasswordBtn');
    if (!button) return;

    button.disabled = true;
    button.innerHTML = `<span>${t('settingsPage.passwordModal.step2.saving')}</span>`;

    try {
        const encodedPassword = btoa(unescape(encodeURIComponent(newPassword)));

        const response = await fetch(
            `http://localhost:8080/api/v1/user/password?password=${encodeURIComponent(encodedPassword)}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) throw new Error('Failed to update password');

        showToast(t('settingsPage.passwordModal.toasts.success'), 'success');
        setTimeout(() => closePasswordModal(), 1500);

    } catch (error) {
        console.error('❌ Account password update failed:', error);
        showToast(t('settingsPage.passwordModal.toasts.updateError'), 'error');

        button.disabled = false;
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${t('settingsPage.passwordModal.step2.save')}</span>
        `;
    }
}

// ==================== LOGOUT MODAL ====================

function openLogoutModal() {
    updateSettingsPageTranslations();
    document.getElementById('logoutModalOverlay').style.display = 'flex';
}

function closeLogoutModal() {
    document.getElementById('logoutModalOverlay').style.display = 'none';
}

function confirmLogout() {
    closeLogoutModal();
    clearTokensAndLogout('Logged out successfully');
}

function handleLogoutModalOverlayClick(e) {
    if (e.target.id === 'logoutModalOverlay') {
        closeLogoutModal();
    }
}

// ==================== SETTINGS PAGE INITIALIZATION ====================

function initSettingsPage() {
    console.log('🔧 Initializing settings page...');
    updateSettingsPageTranslations();
    console.log('✅ Settings page initialized');
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
    if (!getToken()) {
        window.location.href = "/login";
        return;
    }

    if (typeof loadUserAndSettings === 'function') {
        loadUserAndSettings().catch(err => {
            console.warn('Failed to load settings on settings page:', err);
            const fallbackTheme = (sessionStorage.getItem('theme') || 'auto').toUpperCase();
            applyTheme(fallbackTheme);
            const themeSelect = document.getElementById('themeSelect');
            if (themeSelect) {
                themeSelect.value = fallbackTheme.toLowerCase();
            }
        });
    } else {
        console.warn('loadUserAndSettings not available');
        const fallbackTheme = (sessionStorage.getItem('theme') || 'auto').toUpperCase();
        applyTheme(fallbackTheme);
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = fallbackTheme.toLowerCase();
        }
    }
});

window.addEventListener('languageChanged', () => {
    const settingsPage = document.getElementById('settingsPage');
    if (settingsPage && settingsPage.classList.contains('active')) {
        console.log('🌐 Language changed, updating settings page...');
        updateSettingsPageTranslations();
    }
});

// ==================== EXPORT FUNCTIONS ====================

window.initSettingsPage = initSettingsPage;

console.log('✅ Settings page loaded successfully with multilingual support');