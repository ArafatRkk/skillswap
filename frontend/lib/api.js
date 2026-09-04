const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Retrieve JWT token from localStorage
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('skillswap_token');
  }
  return null;
};

// Store JWT token in localStorage
export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('skillswap_token', token);
  }
};

// Clear JWT token on logout
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('skillswap_token');
  }
};

// Core fetch wrapper that appends Auth headers and formats errors
async function request(endpoint, options = {}) {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

// Authentication API helpers
export const login = (email, password) => 
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (name, email, password, confirmPassword) => 
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });

export const getMe = () => request('/auth/me');

// Predefined Skills list API
export const getSkills = () => request('/skills');

// Users & Profiles API helpers
export const getExploreList = (search = '', teach = '', learn = '') => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (teach) params.append('teach', teach);
  if (learn) params.append('learn', learn);
  const queryStr = params.toString();
  return request(`/users${queryStr ? `?${queryStr}` : ''}`);
};

export const getProfile = (id) => request(`/users/${id}`);

export const updateProfile = (id, profileData) => 
  request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });

// Matches API helper
export const getMatches = () => request('/matches');

// Dashboard API helper
export const getDashboard = () => request('/users/me/dashboard');

// Connection Requests API helpers
export const sendRequest = (receiverId) => 
  request('/requests', {
    method: 'POST',
    body: JSON.stringify({ receiverId }),
  });

export const getRequestsList = () => request('/requests');

export const respondToRequest = (requestId, status) => 
  request(`/requests/${requestId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }), // 'accepted' or 'rejected'
  });

export const cancelRequest = (requestId) => 
  request(`/requests/${requestId}`, {
    method: 'DELETE',
  });
