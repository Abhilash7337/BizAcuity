// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: `${API_BASE_URL}/login`,
    register: `${API_BASE_URL}/register`,
    verifyOtp: `${API_BASE_URL}/verify-otp`,
    logout: `${API_BASE_URL}/logout`
  },
  
  // Admin endpoints
  admin: {
    reports: `${API_BASE_URL}/admin/reports`,
    users: `${API_BASE_URL}/admin/users`,
    payments: `${API_BASE_URL}/admin/payments`,
    subscriptions: `${API_BASE_URL}/admin/subscriptions`,
    flaggedContent: `${API_BASE_URL}/admin/flagged-content`,
    sharedDrafts: `${API_BASE_URL}/admin/shared-drafts`
  },
  
  // User endpoints
  user: {
    profile: `${API_BASE_URL}/api/user/profile`,
    updateProfile: `${API_BASE_URL}/api/user/profile`
  },
  
  // Draft endpoints
  drafts: {
    list: `${API_BASE_URL}/drafts`,
    create: `${API_BASE_URL}/drafts`,
    update: (id) => `${API_BASE_URL}/drafts/${id}`,
    delete: (id) => `${API_BASE_URL}/drafts/${id}`
  }
};

export default API_ENDPOINTS;
