// ==================== SETTINGS SYNC SYSTEM ====================

let userSettings = {
    theme: 'AUTO',
    language: 'ENG',
    enableEmailing: true
};

let settingsLoaded = false;
let settingsCurrentUser = null;

// ==================== LOAD USER AND SETTINGS ====================

// Add this optional parameter
async function loadUserAndSettings(profileData = null) {
    try {
        console.log('Loading user settings...');

        let authUserDto;
        if (profileData) {
            authUserDto = profileData;
        } else {
            authUserDto = await apiCall('/user/profile');
        }

        settingsCurrentUser = authUserDto;

        if (authUserDto.settings) {
            userSettings = {
                theme: authUserDto.settings.theme || 'AUTO',
                language: authUserDto.settings.language || 'ENG',
                enableEmailing: authUserDto.settings.enableEmailing !== undefined
                    ? authUserDto.settings.enableEmailing
                    : true
            };
        }

        settingsLoaded = true;
        applyTheme(userSettings.theme);
        updateSettingsUI();

        console.log('Settings loaded successfully:', userSettings);
        return authUserDto;

    } catch (error) {
        console.error('Failed to load settings:', error);
        const fallbackTheme = sessionStorage.getItem('theme') || 'auto';
        applyTheme(fallbackTheme);
        return null;
    }
}

// ==================== SAVE INDIVIDUAL SETTING (PATCH) ====================

async function saveSingleSetting(field, value) {
    try {
        // Create payload with only the changed field
        const payload = {
            theme: null,
            language: null,
            enableEmailing: null
        };

        // Set only the changed field
        payload[field] = value;

        console.log(`Saving ${field}:`, value);

        // Use apiCall which handles empty responses
        await apiCall('/user/settings', {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });

        console.log(`${field} saved successfully`);
        return true;

    } catch (error) {
        console.error(`Failed to save ${field}:`, error);

        // Fallback to sessionStorage for critical settings like theme
        if (field === 'theme') {
            sessionStorage.setItem('theme', value);
        }

        return false;
    }
}

// ==================== APPLY THEME ====================

function applyTheme(theme) {
    const root = document.documentElement;
    const themeValue = theme ? theme.toLowerCase() : 'auto';

    if (themeValue === 'dark') {
        root.setAttribute('data-theme', 'dark');
    } else if (themeValue === 'light') {
        root.setAttribute('data-theme', 'light');
    } else {
        // Auto mode - remove attribute to use system preference
        root.removeAttribute('data-theme');
    }

    console.log('Theme applied:', themeValue);
}

// ==================== UPDATE UI ====================

function updateSettingsUI() {
    // Update theme select
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect && settingsLoaded) {
        themeSelect.value = userSettings.theme.toLowerCase();
    }

    // Update language select
    const languageSelect = document.querySelector('select[onchange*="handleLanguageChange"]');
    if (languageSelect && settingsLoaded) {
        const langMap = {
            'ENG': 'en',
            'UZB': 'uz',
            'RU': 'ru'
        };
        languageSelect.value = langMap[userSettings.language] || 'en';
    }

    // Update email notifications toggle - FIX: Set correct value
    const emailToggle = document.querySelector('input[onchange*="handleEmailNotifications"]');
    if (emailToggle && settingsLoaded) {
        emailToggle.checked = userSettings.enableEmailing;
    }
}

// ==================== HANDLE CHANGES ====================

function handleThemeChange(theme) {
    const newTheme = theme.toUpperCase();

    // FIX: Only save if value actually changed
    if (newTheme === userSettings.theme) {
        console.log('Theme unchanged, skipping save');
        return;
    }

    console.log('Theme changed to:', theme);

    // Update local settings
    userSettings.theme = newTheme;

    // Apply theme immediately for instant feedback
    applyTheme(userSettings.theme);

    // Save to backend (debounced)
    debouncedSaveSetting('theme', userSettings.theme);
}

function handleLanguageChange(language) {
    // Map UI values to backend enum
    const langMap = {
        'en': 'ENG',
        'uz': 'UZB',
        'ru': 'RU'
    };

    const newLanguage = langMap[language] || 'ENG';

    // FIX: Only save if value actually changed
    if (newLanguage === userSettings.language) {
        console.log('Language unchanged, skipping save');
        return;
    }

    console.log('Language changed to:', language);
    userSettings.language = newLanguage;

    // ✅ ADD THIS: Update UI instantly
    if (window.i18n && ['en', 'ru', 'uz'].includes(language)) {
        window.i18n.setLanguage(language);
    }

    // Save to backend (debounced)
    debouncedSaveSetting('language', userSettings.language);
}

function handleEmailNotifications(enabled) {
    // FIX: Only save if value actually changed
    if (enabled === userSettings.enableEmailing) {
        console.log('Email notification unchanged, skipping save');
        return;
    }

    console.log('Email notifications:', enabled);

    // Update local settings
    userSettings.enableEmailing = enabled;

    // Save to backend (debounced)
    debouncedSaveSetting('enableEmailing', userSettings.enableEmailing);
}

// ==================== DEBOUNCED SAVE FOR INDIVIDUAL FIELDS ====================

let saveTimeouts = {};

function debouncedSaveSetting(field, value) {
    // Clear existing timeout for this field
    if (saveTimeouts[field]) {
        clearTimeout(saveTimeouts[field]);
    }

    // Set new timeout - wait 1 second after last change
    saveTimeouts[field] = setTimeout(() => {
        saveSingleSetting(field, value);
        delete saveTimeouts[field]; // Clean up
    }, 1000);
}

// ==================== SAVE ALL PENDING CHANGES ====================

async function saveAllPendingSettings() {
    // Get all fields with pending timeouts
    const pendingFields = Object.keys(saveTimeouts);

    if (pendingFields.length === 0) {
        return; // Nothing to save
    }

    console.log('Saving pending settings:', pendingFields);

    // Clear all timeouts
    pendingFields.forEach(field => {
        clearTimeout(saveTimeouts[field]);
    });

    // Save all pending changes
    const savePromises = pendingFields.map(field =>
        saveSingleSetting(field, userSettings[field])
    );

    try {
        await Promise.all(savePromises);
        console.log('All pending settings saved');
    } catch (error) {
        console.error('Error saving pending settings:', error);
    }

    // Clear timeouts object
    saveTimeouts = {};
}

// ==================== EXIT HANDLERS ====================

function setupExitHandlers() {
    // Save on page unload
    window.addEventListener('beforeunload', () => {
        saveAllPendingSettings();
    });

    // Save on page hide (mobile/iOS)
    window.addEventListener('pagehide', () => {
        saveAllPendingSettings();
    });

    // Save when user switches tabs
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            saveAllPendingSettings();
        }
    });
}

// ==================== INITIALIZE ====================
// ✅ REMOVED: Duplicate DOMContentLoaded listener
// The initialization is handled by main.js and sidebar.js
// This file only provides utility functions for settings management

// Setup exit handlers when script loads
setupExitHandlers();

// ==================== EXPORTS ====================

window.userSettings = userSettings;
window.settingsCurrentUser = settingsCurrentUser;
window.loadUserAndSettings = loadUserAndSettings;
window.saveSingleSetting = saveSingleSetting;
window.saveAllPendingSettings = saveAllPendingSettings;
window.handleThemeChange = handleThemeChange;
window.handleLanguageChange = handleLanguageChange;
window.handleEmailNotifications = handleEmailNotifications;
window.applyTheme = applyTheme;