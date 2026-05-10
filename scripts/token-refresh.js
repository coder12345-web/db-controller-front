// ==================== TOKEN REFRESH SYSTEM ====================
// This file should be loaded FIRST before all other scripts

const API_BASE = 'https://db-controller-production.up.railway.app/api/v1';

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise = null;

// ==================== GET TOKENS ====================

function getToken() {
    return sessionStorage.getItem("token");
}

function getRefreshToken() {
    return sessionStorage.getItem("refreshToken");
}

function getTokenExpiry() {
    const expiry = sessionStorage.getItem("tokenExpiry");
    return expiry ? parseInt(expiry) : null;
}

// ==================== TOKEN EXPIRY CHECK ====================

function isTokenExpired() {
    const expiry = getTokenExpiry();
    if (!expiry) {
        console.log('No token expiry found');
        return true;
    }

    // Add 30 second buffer to refresh before actual expiry
    const bufferMs = 30 * 1000;
    const now = Date.now();
    const expiryWithBuffer = expiry - bufferMs;
    const isExpired = now >= expiryWithBuffer;

    // Debug logging
    const timeUntilExpiry = Math.floor((expiry - now) / 1000);
    console.log(`Token check: ${isExpired ? 'EXPIRED' : 'VALID'} (expires in ${timeUntilExpiry}s)`);

    return isExpired;
}

function isTokenValid() {
    const token = getToken();
    return token && !isTokenExpired();
}

// ==================== SAVE TOKENS ====================

function saveTokens(loginResponse) {
    console.log('=== SAVING TOKENS DEBUG ===');
    console.log('Raw response:', loginResponse);

    if (loginResponse.token) {
        sessionStorage.setItem('token', loginResponse.token);
        console.log('✓ Access token saved');
    }

    if (loginResponse.refreshToken) {
        sessionStorage.setItem('refreshToken', loginResponse.refreshToken);
        console.log('✓ Refresh token saved');
    }

    if (loginResponse.expiry) {
        const expiryMs = loginResponse.expiry;
        sessionStorage.setItem('tokenExpiry', expiryMs.toString());

        const expiryDate = new Date(expiryMs);
        const timeUntilExpiry = Math.floor((expiryMs - Date.now()) / 1000);
        console.log('✓ Access token expiry:', expiryDate.toLocaleString());
        console.log('  Time until access expiry:', timeUntilExpiry, 'seconds');
    }

    if (loginResponse.refreshExpiry) {
        const refreshExpiryMs = loginResponse.refreshExpiry;
        sessionStorage.setItem('refreshTokenExpiry', refreshExpiryMs.toString());

        const refreshExpiryDate = new Date(refreshExpiryMs);
        const timeUntilRefreshExpiry = Math.floor((refreshExpiryMs - Date.now()) / 1000 / 60);
        console.log('✓ Refresh token expiry:', refreshExpiryDate.toLocaleString());
        console.log('  Time until REFRESH expiry:', timeUntilRefreshExpiry, 'minutes (~', Math.floor(timeUntilRefreshExpiry / 60), 'hours)');
    }

    console.log('=========================');
}

// ==================== CLEAR TOKENS & LOGOUT ====================

function clearTokensAndLogout(message = 'Session expired. Please login again.') {
    console.log('Clearing tokens and logging out:', message);

    // Clear all auth-related data
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('tokenExpiry');
    sessionStorage.removeItem('refreshTokenExpiry');
    sessionStorage.removeItem('username');

    // Reset refresh state
    isRefreshing = false;
    refreshPromise = null;

    // Redirect immediately
    window.location.href = '/login/';  // ✅ NEW
}

// ==================== REFRESH ACCESS TOKEN ====================

async function refreshAccessToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        console.error('No refresh token available');
        clearTokensAndLogout('Session expired. Please login again.');
        return null;
    }

    // If already refreshing, return the existing promise
    if (isRefreshing && refreshPromise) {
        console.log('⏳ Using existing refresh promise');
        return refreshPromise;
    }

    // Set refreshing flag and create new promise
    isRefreshing = true;

    refreshPromise = (async () => {
        try {
            console.log('🔄 Refreshing access token...');

            const response = await fetch(`${API_BASE}/auth/refresh-token?refreshToken=${encodeURIComponent(refreshToken)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Refresh token is also expired or invalid
                if (response.status === 403 || response.status === 401) {
                    throw new Error('Refresh token expired');
                }
                throw new Error('Failed to refresh token');
            }

            const data = await response.json();
            console.log('🔄 REFRESH TOKEN RESPONSE:', data);
            console.log('  - Has token?', !!data.token);
            console.log('  - Has expiry?', !!data.expiry);
            console.log('  - Has refreshToken?', !!data.refreshToken);
            console.log('  - Has refreshExpiry?', !!data.refreshExpiry);

            if (data.refreshExpiry) {
                const refreshExpiryDate = new Date(data.refreshExpiry);
                console.log('  - Refresh expiry date:', refreshExpiryDate.toLocaleString());
                console.log('  - Hours until refresh expiry:', Math.floor((data.refreshExpiry - Date.now()) / 1000 / 60 / 60));
            }

            console.log('✅ Token refreshed successfully');

            saveTokens(data);

            return data.token;

        } catch (error) {
            console.error('❌ Token refresh failed:', error);
            clearTokensAndLogout('Your session has expired. Please login again.');
            throw error;
        } finally {
            // Reset refresh state
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

// ==================== ENSURE VALID TOKEN ====================

async function ensureValidToken() {
    // If token is still valid, return it
    if (isTokenValid()) {
        console.log('✓ Token is valid, using existing token');
        return getToken();
    }

    // Token expired or missing, try to refresh
    console.log('⚠️ Token expired or missing, refreshing...');
    const newToken = await refreshAccessToken();

    if (!newToken) {
        throw new Error('Failed to get valid token');
    }

    return newToken;
}

// ==================== ENHANCED API CALL WITH AUTO TOKEN REFRESH ====================

async function apiCall(endpoint, options = {}) {
    try {
        // Ensure we have a valid token BEFORE making the request
        const token = await ensureValidToken();

        // Prepare request
        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
                'Authorization': `Bearer ${token}`
            }
        };

        // Make the API call
        let response = await fetch(url, config);

        // If still got 403 (edge case: token expired between check and request)
        if (response.status === 403 || response.status === 401) {
            console.log('⚠️ Got 403/401, attempting token refresh...');

            // Force refresh
            const newToken = await refreshAccessToken();

            if (!newToken) {
                throw new Error('Token refresh failed');
            }

            // Retry with new token
            config.headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(url, config);
        }

        // Check for other errors
        // Check for other errors
        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorMessage = response.statusText;

            try {
                const errorText = await response.text();

                // Try to parse as JSON first
                if (contentType && contentType.includes('application/json') && errorText) {
                    const errorJson = JSON.parse(errorText);
                    // Extract message from common error response formats
                    errorMessage = errorJson.message || errorJson.error || errorJson.details || errorText;
                } else if (errorText) {
                    errorMessage = errorText;
                }
            } catch (parseError) {
                // If parsing fails, use status text
                console.warn('Failed to parse error response:', parseError);
            }

            throw new Error(errorMessage);
        }

        // Handle response based on content
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');

        // Check if response is empty (204 No Content or content-length: 0)
        if (response.status === 204 || contentLength === '0') {
            console.log('Empty response (204 No Content or 0 length) - this is OK');
            return null;
        }

        // Try to get response text
        const text = await response.text();

        // If text is empty, return null
        if (!text || !text.trim()) {
            console.log('Empty response body - this is OK for DELETE/PUT/PATCH operations');
            return null;
        }

        // If we have text and content-type is JSON, parse it
        if (contentType && contentType.includes('application/json')) {
            try {
                return JSON.parse(text);
            } catch (parseError) {
                console.warn('Failed to parse JSON response, returning null:', parseError);
                return null;
            }
        }

        // Non-JSON response with content - return the text
        console.log('Non-JSON response received');
        return text;

    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// ==================== COPY TO CLIPBOARD HELPER ====================

function copyToClipboard(text, btn) {
    navigator.clipboard.writeText(text);
    const oldContent = btn.innerHTML;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>`;
    setTimeout(() => btn.innerHTML = oldContent, 900);
}

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

// ==================== CHECK AUTH ON PAGE LOAD ====================

function checkAuthentication() {
    const token = getToken();
    const currentPage = window.location.pathname;

    // If on login page and has token, redirect to main
    if (currentPage.includes('login') && token) {
        window.location.href = '/main/';  // ✅ NEW
        return false;
    }

    // If not on login page and no token, redirect to login
    if (!currentPage.includes('login') && !token) {
        window.location.href = '/login/';  // ✅ NEW
        return false;
    }

    return true;
}

// ==================== EXPORT FUNCTIONS ====================

window.getToken = getToken;
window.getRefreshToken = getRefreshToken;
window.isTokenValid = isTokenValid;
window.saveTokens = saveTokens;
window.clearTokensAndLogout = clearTokensAndLogout;
window.refreshAccessToken = refreshAccessToken;
window.ensureValidToken = ensureValidToken;
window.apiCall = apiCall;
window.copyToClipboard = copyToClipboard;
window.showToast = showToast;
window.checkAuthentication = checkAuthentication;

console.log('✅ Token refresh system loaded successfully');