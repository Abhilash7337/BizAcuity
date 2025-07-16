/*
 * SECURITY NOTE: 
 * This auth utility implements secure data storage practices:
 * 
 * STORED IN LOCALHOST (Safe, non-sensitive):
 * - name: User's display name
 * - isLoggedIn: Authentication status
 * - userType: User role (regular, admin, etc.)
 * - plan: User's subscription plan
 * 
 * NOT STORED IN LOCALHOST (Sensitive data):
 * - id: User database ID
 * - email: User email address  
 * - profilePhoto: User avatar/photo
 * - Any other PII (Personally Identifiable Information)
 * 
 * Sensitive data is fetched from server when needed using fetchUserProfile()
 */

// Store token in localStorage
export const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Get token from localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

// Remove token from localStorage
export const removeToken = () => {
    localStorage.removeItem('token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

// Get authenticated user data (only safe, non-sensitive info)
export const getAuthUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Set authenticated user data (filter out sensitive information)
export const setAuthUser = (user) => {
    // Only store non-sensitive information
    const safeUserData = {
        name: user.name,
        isLoggedIn: user.isLoggedIn || true,
        userType: user.userType || 'regular',
        plan: user.plan || 'regular'
        // Intentionally exclude: id, email, profilePhoto and other sensitive data
    };
    localStorage.setItem('user', JSON.stringify(safeUserData));
};

// Remove authenticated user data
export const removeAuthUser = () => {
    localStorage.removeItem('user');
};

// Logout user
export const logout = () => {
    clearAuthData();
};

// Create authenticated fetch function
export const authFetch = async (url, options = {}) => {
    const token = getToken();
    // Add base URL for backend API
    const baseURL = 'http://localhost:5001';
    const fullURL = url.startsWith('http') ? url : `${baseURL}${url}`;
    
    if (token) {
        options.headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
    }
    return fetch(fullURL, options);
};

// Fetch sensitive user data from server when needed (instead of storing in localStorage)
export const fetchUserProfile = async () => {
    try {
        const response = await authFetch('/api/user/profile');
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        return null;
    }
};

// Get user ID securely (fetch from server when needed)
export const getUserId = async () => {
    const profile = await fetchUserProfile();
    return profile?.id || null;
};

// Get user email securely (fetch from server when needed)  
export const getUserEmail = async () => {
    const profile = await fetchUserProfile();
    return profile?.email || null;
};

// Clear all authentication data (enhanced security)
export const clearAuthData = () => {
    removeToken();
    removeAuthUser();
    // Clear any cached sensitive data
    if (window.userProfileCache) {
        delete window.userProfileCache;
    }
};

// Redirect functionality for shared links
export const setIntendedDestination = (path) => {
    if (path && path !== '/login' && path !== '/register') {
        console.log('Setting intended destination:', path);
        localStorage.setItem('intendedDestination', path);
    }
};

export const getIntendedDestination = () => {
    const destination = localStorage.getItem('intendedDestination');
    console.log('Getting intended destination:', destination);
    return destination;
};

export const clearIntendedDestination = () => {
    console.log('Clearing intended destination');
    localStorage.removeItem('intendedDestination');
};

export const getPostAuthRedirect = () => {
    const intended = getIntendedDestination();
    console.log('getPostAuthRedirect - intended destination:', intended);
    if (intended) {
        clearIntendedDestination();
        console.log('getPostAuthRedirect - using intended destination:', intended);
        return intended;
    }
    console.log('getPostAuthRedirect - no intended destination, returning /dashboard');
    return '/dashboard';
};