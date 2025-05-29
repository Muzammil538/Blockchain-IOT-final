import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  return response.json();
};

const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  const config = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) })
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    toast.error(error.message || 'API request failed');
    throw error;
  }
};

export const registerUser = (userData) => apiRequest('/register', 'POST', userData);
export const loginUser = (credentials) => apiRequest('/login', 'POST', credentials);
export const getUserProfile = (userId, token) => apiRequest(`/users/${userId}`, 'GET', null, token);
export const updateUserProfile = (userId, updates, token) => apiRequest(`/users/${userId}`, 'PATCH', updates, token);

export const getBlockchain = () => apiRequest('/blockchain');
export const getBlockDetails = (blockHash) => apiRequest(`/blocks/${blockHash}`);
export const verifyData = (dataHash) => apiRequest(`/verify?hash=${dataHash}`);

export const getUserUploads = (userId, token) => apiRequest(`/users/${userId}/uploads`, 'GET', null, token);
export const getUploadMetadata = (dataHash, token) => apiRequest(`/uploads/${dataHash}`, 'GET', null, token);

export const adminGetAllUsers = (token) => apiRequest('/admin/users', 'GET', null, token);
export const adminUpdateUser = (userId, updates, token) => apiRequest(`/admin/users/${userId}`, 'PATCH', updates, token);
export const adminGetAllUploads = (token) => apiRequest('/admin/uploads', 'GET', null, token);