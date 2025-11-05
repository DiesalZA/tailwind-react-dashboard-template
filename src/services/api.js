/**
 * Base API Client
 *
 * Provides a centralized HTTP client with:
 * - Request/Response interceptors
 * - Authentication token management
 * - Error handling
 * - Request timeout
 */

import { API_BASE_URL, STORAGE_KEYS } from '../utils/constants';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Get authentication token from localStorage
   */
  getAuthToken() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Set authentication token in localStorage
   */
  setAuthToken(token) {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }

  /**
   * Get default headers for requests
   */
  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Build full URL from endpoint
   */
  buildUrl(endpoint, params = {}) {
    // Replace path parameters (e.g., :id)
    let url = endpoint;
    Object.keys(params).forEach(key => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, params[key]);
        delete params[key];
      }
    });

    // Add query parameters
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    const fullUrl = `${this.baseURL}${url}${queryString ? `?${queryString}` : ''}`;

    return fullUrl;
  }

  /**
   * Handle API errors
   */
  handleError(error, response) {
    // Network error
    if (!response) {
      return {
        success: false,
        error: {
          message: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
          details: error.message,
        },
      };
    }

    // HTTP error
    const errorData = {
      success: false,
      error: {
        message: 'An error occurred',
        code: `HTTP_${response.status}`,
        status: response.status,
      },
    };

    // Try to parse error response
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json().then(data => ({
          success: false,
          error: {
            message: data.message || data.error || 'An error occurred',
            code: data.code || `HTTP_${response.status}`,
            status: response.status,
            details: data.details || data,
          },
        }));
      }
    } catch (e) {
      // Failed to parse JSON error
    }

    // Specific status code messages
    switch (response.status) {
      case 401:
        errorData.error.message = 'Unauthorized. Please log in.';
        this.setAuthToken(null); // Clear invalid token
        break;
      case 403:
        errorData.error.message = 'Access forbidden.';
        break;
      case 404:
        errorData.error.message = 'Resource not found.';
        break;
      case 422:
        errorData.error.message = 'Validation error.';
        break;
      case 500:
        errorData.error.message = 'Server error. Please try again later.';
        break;
      case 503:
        errorData.error.message = 'Service unavailable. Please try again later.';
        break;
    }

    return Promise.resolve(errorData);
  }

  /**
   * Make HTTP request
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      params = {},
      data = null,
      headers = {},
      timeout = this.timeout,
    } = options;

    const url = this.buildUrl(endpoint, params);
    const config = {
      method,
      headers: this.getHeaders(headers),
    };

    // Add body for POST/PUT/PATCH
    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      config.body = JSON.stringify(data);
    }

    // Timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      // Handle non-OK responses
      if (!response.ok) {
        return this.handleError(null, response);
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      return {
        success: true,
        data: responseData,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      // Timeout error
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: {
            message: 'Request timeout. Please try again.',
            code: 'TIMEOUT_ERROR',
          },
        };
      }

      return this.handleError(error, null);
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}, options = {}) {
    return this.request(endpoint, {
      method: 'GET',
      params,
      ...options,
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      data,
      ...options,
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      data,
      ...options,
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      data,
      ...options,
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, params = {}, options = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      params,
      ...options,
    });
  }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient;
