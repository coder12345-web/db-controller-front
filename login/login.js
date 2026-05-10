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

// ==================== LOGIN FUNCTION ====================
async function login(event) {
    event.preventDefault();

    // Get form values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validation
    if (!username || !password) {
        showToast('Please enter both username and password', 'error');
        return;
    }

    // Disable button and show loading
    const loginBtn = document.querySelector('.login-btn');
    if (!loginBtn) {
        console.error('Login button not found');
        showToast('Login button not found. Please refresh the page.', 'error');
        return;
    }

    const originalText = loginBtn.innerHTML;
    loginBtn.disabled = true;
    loginBtn.innerHTML = 'Logging in...';

    try {
        console.log('Attempting login with:', username);

        // Prepare request body
        const requestBody = {
            username: username,
            password: password
        };

        console.log('Sending POST request to:', `${API_BASE_URL}/api/v1/auth/login`);

        // Make API call - POST with JSON body
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        // Check if response is not OK
        if (!response.ok) {
            let errorMessage = 'Login failed. Please try again.';

            try {
                const errorData = await response.json();

                // Handle specific error messages from backend
                if (errorData.message) {
                    const backendMessage = errorData.message.toLowerCase();

                    // Bad credentials
                    if (backendMessage.includes('bad credentials') ||
                        backendMessage.includes('invalid credentials') ||
                        backendMessage.includes('incorrect password') ||
                        backendMessage.includes('wrong password')) {
                        errorMessage = 'Invalid username or password. Please try again.';
                    }
                    // User not found
                    else if (backendMessage.includes('user not found') ||
                        backendMessage.includes('username not found')) {
                        errorMessage = 'User not found. Please check your username.';
                    }
                    // Account disabled/locked
                    else if (backendMessage.includes('disabled') ||
                        backendMessage.includes('locked') ||
                        backendMessage.includes('suspended')) {
                        errorMessage = 'Your account has been disabled. Please contact support.';
                    }
                    // Generic backend message
                    else {
                        errorMessage = errorData.message;
                    }
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                }

                // Handle by status code if no message
                if (response.status === 401) {
                    errorMessage = 'Invalid username or password. Please try again.';
                } else if (response.status === 403) {
                    errorMessage = 'Access forbidden. Your account may be disabled.';
                } else if (response.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                } else if (response.status === 503) {
                    errorMessage = 'Service unavailable. Please try again later.';
                }

            } catch (e) {
                // Failed to parse error response
                if (response.status === 401 || response.status === 403) {
                    errorMessage = 'Invalid username or password. Please try again.';
                } else {
                    errorMessage = `Login failed (Error ${response.status}). Please try again.`;
                }
            }

            throw new Error(errorMessage);
        }

        // Parse response
        const data = await response.json();
        console.log('Login successful! Response:', data);

        // Check if token exists
        if (!data.token && !data.accessToken) {
            throw new Error('Authentication failed. No token received from server.');
        }

        // Use the saveTokens function from token-refresh.js
        if (typeof saveTokens === 'function') {
            saveTokens({
                token: data.token || data.accessToken,
                refreshToken: data.refreshToken,
                expiry: data.expiry,
                refreshExpiry: data.refreshExpiry
            });
        } else {
            // Fallback if token-refresh.js is not loaded
            sessionStorage.setItem('token', data.token || data.accessToken);
            if (data.refreshToken) {
                sessionStorage.setItem('refreshToken', data.refreshToken);
            }
            if (data.expiry) {
                sessionStorage.setItem('tokenExpiry', data.expiry);
            }
            if (data.refreshExpiry) {
                sessionStorage.setItem('refreshTokenExpiry', data.refreshExpiry);
            }
        }

        // Store username
        if (data.username || username) {
            sessionStorage.setItem('username', data.username || username);
        }

        console.log('Tokens saved successfully, redirecting to main page...');

        // Show success toast
        showToast('Login successful! Redirecting...', 'success', 1500);

        window.location.href = '/db-controller-front/main/main.html';

    } catch (error) {
        console.error('Login error:', error);

        // Check if it's a network error (backend not running)
        if (error.message === 'Failed to fetch' ||
            error.name === 'TypeError' ||
            !navigator.onLine) {
            showToast('Cannot connect to server. Please check your connection or try again later.', 'error', 4000);
        } else {
            // Show the specific error message
            showToast(error.message, 'error', 4000);
        }

        // Re-enable button
        loginBtn.disabled = false;
        loginBtn.innerHTML = originalText;
    }
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Login page loaded');

    // No auto-redirect - let users login even if they have a token
    // This allows them to login with a different account

    // Get form element
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
        console.log('Login form listener attached');
    } else {
        console.warn('Login form not found! Make sure form has id="loginForm"');
    }

    // Add Enter key support for inputs
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (usernameInput && passwordInput) {
        [usernameInput, passwordInput].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    login(e);
                }
            });
        });
        console.log('Enter key listeners attached');
    } else {
        console.warn('Username or password input not found!');
    }

    console.log('Login page initialization complete');
});

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.eye-icon');
    const eyeOffIcon = document.querySelector('.eye-off-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.style.display = 'none';
        eyeOffIcon.style.display = 'block';
    } else {
        passwordInput.type = 'password';
        eyeIcon.style.display = 'block';
        eyeOffIcon.style.display = 'none';
    }
}