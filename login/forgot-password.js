// ==================== API BASE URL ====================
const API_BASE_URL = 'https://db-controller-production.up.railway.app';

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'success', duration = 3000) {
    const existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;

    const icon = type === 'success'
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-show'));
    setTimeout(() => {
        toast.classList.remove('toast-show');
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ==================== FORGOT PASSWORD ====================
async function submitForgotPassword() {
    const email = document.getElementById('emailInput').value.trim();
    const submitBtn = document.getElementById('submitBtn');

    if (!email) {
        showToast('Please enter your email address.', 'error');
        return;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
    }

    // Detect lang from i18n or URL
    const lang = (window.i18n?.getCurrentLanguage?.()) ||
        new URLSearchParams(window.location.search).get('lang') || 'en';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/forgot-password?lang=${lang}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error('Something went wrong. Please try again.');
        }

        // Always show success state regardless — prevents user enumeration
        document.getElementById('formState').style.display = 'none';
        document.getElementById('successState').style.display = 'block';

    } catch (error) {
        if (error.message === 'Failed to fetch' || !navigator.onLine) {
            showToast('Cannot connect to server. Please check your connection.', 'error', 4000);
        } else {
            showToast(error.message, 'error', 4000);
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Reset Link';
    }
}

// ==================== ENTER KEY SUPPORT ====================
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('emailInput');
    if (emailInput) {
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitForgotPassword();
        });
    }
});