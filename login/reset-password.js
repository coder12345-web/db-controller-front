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

// ==================== PASSWORD HINTS ====================
function checkPasswordStrength() {
    const password = document.getElementById('newPassword').value;
    const hint = document.getElementById('lengthHint');
    if (password.length >= 8) {
        hint.textContent = '✓ At least 8 characters';
        hint.classList.add('valid');
    } else {
        hint.textContent = 'At least 8 characters';
        hint.classList.remove('valid');
    }
    checkMatch(); // also re-check match whenever password changes
}

function checkMatch() {
    const password = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    const hint = document.getElementById('matchHint');

    if (!confirm) {
        hint.textContent = 'Passwords must match';
        hint.classList.remove('valid');
        return;
    }

    if (password === confirm) {
        hint.textContent = '✓ Passwords match';
        hint.classList.add('valid');
    } else {
        hint.textContent = 'Passwords do not match';
        hint.classList.remove('valid');
    }
}

// ==================== TOGGLE PASSWORD VISIBILITY ====================
function toggleVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    const eyeIcon = btn.querySelector('.eye-icon');
    const eyeOffIcon = btn.querySelector('.eye-off-icon');

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

// ==================== RESET PASSWORD ====================
async function submitResetPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = document.getElementById('submitBtn');

    // Validation
    if (!newPassword || !confirmPassword) {
        showToast('Please fill in all fields.', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showToast('Password must be at least 8 characters.', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
    }

    // Get token from URL
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
        document.getElementById('formState').style.display = 'none';
        document.getElementById('errorState').style.display = 'block';
        return;
    }

    // Detect lang
    const lang = (window.i18n?.getCurrentLanguage?.()) ||
        new URLSearchParams(window.location.search).get('lang') || 'en';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Resetting...';

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/reset-password?lang=${lang}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword })
        });

        if (response.ok) {
            // Show success state
            document.getElementById('formState').style.display = 'none';
            document.getElementById('successState').style.display = 'block';
        } else {
            // Token invalid or expired
            document.getElementById('formState').style.display = 'none';
            document.getElementById('errorState').style.display = 'block';
        }

    } catch (error) {
        if (error.message === 'Failed to fetch' || !navigator.onLine) {
            showToast('Cannot connect to server. Please check your connection.', 'error', 4000);
        } else {
            showToast('Something went wrong. Please try again.', 'error', 4000);
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Reset Password';
    }
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    // If no token in URL, immediately show error state
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
        document.getElementById('formState').style.display = 'none';
        document.getElementById('errorState').style.display = 'block';
    }

    // Enter key support
    ['newPassword', 'confirmPassword'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('keypress', e => {
            if (e.key === 'Enter') submitResetPassword();
        });
    });
});