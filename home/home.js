// ==================== LANGUAGE SELECTOR LOGIC ====================

const langData = {
    en: { icon: '🇬🇧', text: 'EN', name: 'English' },
    ru: { icon: '🇷🇺', text: 'RU', name: 'Русский' },
    uz: { icon: '🇺🇿', text: 'UZ', name: "O'zbek" }
};

const dropdown = document.getElementById('langDropdown');
const button = document.getElementById('langButton');
const menu = document.getElementById('langMenu');
const currentIcon = document.getElementById('currentLangIcon');
const currentText = document.getElementById('currentLangText');

// Initialize with current language
function updateCurrentLanguage(lang) {
    const data = langData[lang];
    if (data) {
        currentIcon.textContent = data.icon;
        currentText.textContent = data.text;
    }

    // Update active state
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

        // Update i18n
        if (window.i18n) {
            window.i18n.setLanguage(selectedLang);
        }

        // Update UI
        updateCurrentLanguage(selectedLang);

        // Close dropdown
        dropdown.classList.remove('open');

        // Update page content
        updatePageLanguage();
    });
});

// Listen for language changes
window.addEventListener('languageChanged', (e) => {
    updateCurrentLanguage(e.detail.lang);
});

// ==================== UPDATE PAGE CONTENT ====================

function updatePageLanguage() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = window.t(key);

        if (translation && translation !== key) {
            element.textContent = translation;
        }
    });

    // Update links with language parameter
    updateLinksWithLanguage();

    console.log('✅ Page language updated to:', window.i18n.getCurrentLanguage());
}

// ==================== UPDATE LINKS WITH LANGUAGE ====================

function updateLinksWithLanguage() {
    const currentLang = window.i18n.getCurrentLanguage();

    // Update "Create Organization" links
    const createOrgLinks = [
        document.getElementById('createOrgLink'),
        document.getElementById('ctaCreateOrgLink')
    ];

    createOrgLinks.forEach(link => {
        if (link) {
            link.href = `/home-organization?lang=${currentLang}`;
        }
    });
}

// ==================== SMOOTH SCROLL ====================

document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
    document.querySelector('.info-section').scrollIntoView({
        behavior: 'smooth'
    });
});

// ==================== ANIMATION ON SCROLL ====================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards
document.querySelectorAll('.feature-card, .step').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ==================== INITIALIZE ====================

// Initialize language on page load
if (window.i18n) {
    updateCurrentLanguage(window.i18n.getCurrentLanguage());
    updatePageLanguage();
}

console.log('✅ Home page initialized with language:', window.i18n?.getCurrentLanguage() || 'unknown');