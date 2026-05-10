const API_BASE = 'https://db-controller-production.up.railway.app/api/v1';
let organizationName = '';
let organizationId = '';

// ==================== TOAST NOTIFICATION SYSTEM ====================

function createToastContainer() {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }
    return container;
}

function showToast(message, type = 'info', duration = 5000) {
    const container = createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
        error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
        warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
    };

    const titles = {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Info'
    };

    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.info}</div>
        <div class="toast-content">
            <div class="toast-title">${titles[type]}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.closest('.toast').classList.add('removing'); setTimeout(() => this.closest('.toast').remove(), 300)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    `;

    container.appendChild(toast);

    if (duration > 0) {
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    return toast;
}

function showSuccessToast(message, duration = 5000) {
    return showToast(message, 'success', duration);
}

function showErrorToast(message, duration = 5000) {
    return showToast(message, 'error', duration);
}

function showWarningToast(message, duration = 5000) {
    return showToast(message, 'warning', duration);
}

function showInfoToast(message, duration = 5000) {
    return showToast(message, 'info', duration);
}


// ==================== LANGUAGE SELECTOR LOGIC ====================

const langData = {
    en: { icon: '🇬🇧', text: 'EN', name: 'English' },
    ru: { icon: '🇷🇺', text: 'RU', name: 'Русский' },
    uz: { icon: '🇺🇿', text: 'UZ', name: "O'zbek" }
};

function initLanguageSelector() {
    const dropdown = document.getElementById('langDropdown');
    const button = document.getElementById('langButton');
    const currentIcon = document.getElementById('currentLangIcon');
    const currentText = document.getElementById('currentLangText');

    // Initialize with current language
    function updateCurrentLanguage(lang) {
        const data = langData[lang];
        if (data) {
            currentIcon.textContent = data.icon;
            currentText.textContent = data.text;
        }

        document.querySelectorAll('.lang-option').forEach(option => {
            option.classList.toggle('active', option.dataset.lang === lang);
        });
    }

    // Toggle dropdown
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });

    // Handle language selection
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', () => {
            const selectedLang = option.dataset.lang;

            if (window.i18n) {
                window.i18n.setLanguage(selectedLang);
            }

            updateCurrentLanguage(selectedLang);
            dropdown.classList.remove('open');
            updatePageLanguage();
        });
    });

    // Listen for language changes
    window.addEventListener('languageChanged', (e) => {
        updateCurrentLanguage(e.detail.lang);
    });

    // Initialize
    if (window.i18n) {
        updateCurrentLanguage(window.i18n.getCurrentLanguage());
    }
}

// ==================== UPDATE PAGE CONTENT ====================

function updatePageLanguage() {
    // Update regular text elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = window.t(key);

        if (translation && translation !== key) {
            element.textContent = translation;
        }
    });

    // Update placeholders separately
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = window.t(key);

        if (translation && translation !== key) {
            element.setAttribute('placeholder', translation);
        }
    });

    console.log('✅ Page language updated to:', window.i18n.getCurrentLanguage());
}

// ==================== GET LANGUAGE FOR API ====================

// ==================== GET LANGUAGE FOR API ====================

function getApiLanguage() {
    if (!window.i18n) return 'ENG';

    const currentLang = window.i18n.getCurrentLanguage();

    // Map frontend language codes to backend format
    const langMap = {
        'en': 'ENG',
        'uz': 'UZB',
        'ru': 'RU'
    };

    return langMap[currentLang] || 'ENG';
}

// ==================== STEP 1: ORGANIZATION NAME ====================

document.getElementById('orgNameForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    organizationName = document.getElementById('organizationName').value.trim();

    if (!organizationName) {
        showErrorToast(window.t('org.enterOrgName'));
        return;
    }

    // Just move to step 2 - NO API call yet
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');

    // Toggle back links
    document.getElementById('backLinkStep1').style.display = 'none';
    document.getElementById('backLinkStep2').style.display = 'block';
});

// ==================== STEP 2: USER DETAILS ====================

document.getElementById('userDetailsForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();

    // Validation
    if (!fullName || !username || !email) {
        showErrorToast(window.t('org.fillAllFields'));
        return;
    }

    if (fullName.length < 2) {
        showErrorToast(window.t('org.nameMinLength'));
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showErrorToast(window.t('org.invalidEmail'));
        return;
    }

    const createBtn = document.getElementById('createBtn');
    const originalContent = createBtn.innerHTML;
    createBtn.disabled = true;
    createBtn.querySelector('span').textContent = window.t('org.creatingOrg');

    try {
        const apiLang = getApiLanguage();

        // STEP 1: Create Organization
        console.log('Creating organization:', organizationName, 'with lang:', apiLang);

        const organizationRequestBody = {
            organizationName: organizationName
        };

        console.log('Sending organization data:', JSON.stringify(organizationRequestBody, null, 2));

        const orgResponse = await fetch(`${API_BASE}/organization?lang=${apiLang}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(organizationRequestBody)
        });

        if (!orgResponse.ok) {
            let errorMessage;
            const contentType = orgResponse.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                // Response is JSON
                const errorData = await orgResponse.json();
                errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
            } else {
                // Response is text
                errorMessage = await orgResponse.text();
            }

            console.error('Organization creation failed:', errorMessage);
            throw new Error(errorMessage);
        }

        const orgData = await orgResponse.json();
        organizationId = orgData.id;
        console.log('Organization created successfully with ID:', organizationId);

        // Update button text for second step
        createBtn.querySelector('span').textContent = window.t('org.creatingAccount');

        // STEP 2: Create Admin User
        console.log('Creating admin user for organization:', organizationId);

        const userRequestBody = {
            organizationId: organizationId,
            fullName: fullName,
            username: username,
            email: email
        };

        console.log('Sending user data:', JSON.stringify(userRequestBody, null, 2));

        const userResponse = await fetch(`${API_BASE}/user/organization?lang=${apiLang}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userRequestBody)
        });

        if (!userResponse.ok) {
            let errorMessage;
            const contentType = userResponse.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                // Response is JSON
                const errorData = await userResponse.json();
                errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
            } else {
                // Response is text
                errorMessage = await userResponse.text();
            }

            console.error('User creation failed:', errorMessage);
            throw new Error(errorMessage);
        }

        console.log('Admin account created successfully');

        // Show success section
        document.getElementById('formSection').classList.remove('active');
        document.getElementById('successSection').classList.add('active');

    } catch (error) {
        console.error('Error:', error);

        // Show error toast with the actual error message
        showErrorToast(error.message || window.t('common.error'), 7000);

        createBtn.disabled = false;
        createBtn.innerHTML = originalContent;
    }
});

// ==================== GO BACK TO STEP 1 ====================

function goBackToStep1() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');

    document.getElementById('backLinkStep1').style.display = 'block';
    document.getElementById('backLinkStep2').style.display = 'none';

    document.getElementById('organizationName').value = organizationName;

    setTimeout(() => {
        document.getElementById('organizationName').focus();
        document.getElementById('organizationName').select();
    }, 100);
}

// ==================== COPY ORGANIZATION ID ====================

document.getElementById('goToLoginBtn').addEventListener('click', () => {
    window.location.href = '/login';
});

// ==================== INITIALIZE ====================

document.addEventListener('DOMContentLoaded', () => {
    initLanguageSelector();

    if (window.i18n) {
        updatePageLanguage();
    }

    console.log('✅ Organization page initialized with language:', window.i18n?.getCurrentLanguage() || 'unknown');
});