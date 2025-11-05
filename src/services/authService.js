/**
 * Authentication Service
 *
 * Handles user authentication and authorization
 */

import apiClient from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

const authService = {
  /**
   * Login user
   *
   * @param {object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<{success: boolean, data?: {user: object, token: string}, error?: object}>}
   *
   * Example backend endpoint: POST /api/auth/login
   * Request body: { email, password }
   * Expected response: { user: {...}, token: "..." }
   */
  async login(credentials) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

    if (response.success && response.data) {
      // Store token and user data
      if (response.data.token) {
        apiClient.setAuthToken(response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
      }
    }

    return response;
  },

  /**
   * Register new user
   *
   * @param {object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.name - User full name
   * @returns {Promise<{success: boolean, data?: {user: object, token: string}, error?: object}>}
   *
   * Example backend endpoint: POST /api/auth/register
   * Request body: { email, password, name }
   * Expected response: { user: {...}, token: "..." }
   */
  async register(userData) {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);

    if (response.success && response.data) {
      // Store token and user data
      if (response.data.token) {
        apiClient.setAuthToken(response.data.token);
      }
      if (response.data.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
      }
    }

    return response;
  },

  /**
   * Logout user
   *
   * @returns {Promise<{success: boolean, error?: object}>}
   *
   * Example backend endpoint: POST /api/auth/logout
   * Expected response: { success: true }
   */
  async logout() {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);

    // Clear local storage regardless of API response
    apiClient.setAuthToken(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

    return response;
  },

  /**
   * Refresh authentication token
   *
   * @returns {Promise<{success: boolean, data?: {token: string}, error?: object}>}
   *
   * Example backend endpoint: POST /api/auth/refresh
   * Request body: { refresh_token: "..." }
   * Expected response: { token: "..." }
   */
  async refreshToken() {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!refreshToken) {
      return {
        success: false,
        error: {
          message: 'No refresh token available',
          code: 'NO_REFRESH_TOKEN',
        },
      };
    }

    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    });

    if (response.success && response.data?.token) {
      apiClient.setAuthToken(response.data.token);
    }

    return response;
  },

  /**
   * Get current user profile
   *
   * @returns {Promise<{success: boolean, data?: object, error?: object}>}
   *
   * Example backend endpoint: GET /api/auth/profile
   * Expected response: { id, email, name, avatar, ... }
   */
  async getProfile() {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);

    if (response.success && response.data) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
    }

    return response;
  },

  /**
   * Update user profile
   *
   * @param {object} data - Profile data to update
   * @returns {Promise<{success: boolean, data?: object, error?: object}>}
   *
   * Example backend endpoint: PATCH /api/auth/profile
   * Request body: { name?, avatar?, ... }
   * Expected response: { id, email, name, avatar, ... }
   */
  async updateProfile(data) {
    const response = await apiClient.patch(API_ENDPOINTS.AUTH.PROFILE, data);

    if (response.success && response.data) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
    }

    return response;
  },

  /**
   * Change password
   *
   * @param {object} data - Password change data
   * @param {string} data.currentPassword - Current password
   * @param {string} data.newPassword - New password
   * @returns {Promise<{success: boolean, error?: object}>}
   *
   * Example backend endpoint: POST /api/auth/change-password
   * Request body: { current_password, new_password }
   * Expected response: { success: true }
   */
  async changePassword(data) {
    return apiClient.post(`${API_ENDPOINTS.AUTH.PROFILE}/change-password`, {
      current_password: data.currentPassword,
      new_password: data.newPassword,
    });
  },

  /**
   * Request password reset
   *
   * @param {string} email - User email
   * @returns {Promise<{success: boolean, error?: object}>}
   *
   * Example backend endpoint: POST /api/auth/forgot-password
   * Request body: { email }
   * Expected response: { success: true, message: "Reset email sent" }
   */
  async forgotPassword(email) {
    return apiClient.post(`${API_ENDPOINTS.AUTH.PROFILE}/forgot-password`, {
      email,
    });
  },

  /**
   * Reset password with token
   *
   * @param {object} data - Reset data
   * @param {string} data.token - Reset token from email
   * @param {string} data.password - New password
   * @returns {Promise<{success: boolean, error?: object}>}
   *
   * Example backend endpoint: POST /api/auth/reset-password
   * Request body: { token, password }
   * Expected response: { success: true }
   */
  async resetPassword(data) {
    return apiClient.post(`${API_ENDPOINTS.AUTH.PROFILE}/reset-password`, data);
  },

  /**
   * Check if user is authenticated
   *
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!apiClient.getAuthToken();
  },

  /**
   * Get current user from localStorage
   *
   * @returns {object|null}
   */
  getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  },

  /**
   * Clear all authentication data
   */
  clearAuth() {
    apiClient.setAuthToken(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
};

export default authService;
