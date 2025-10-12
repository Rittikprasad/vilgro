import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '../app/store';
import { authSlice } from '../features/auth/authSlice';
import { refreshToken } from '../features/auth/authThunks';

/**
 * Axios instance configuration
 * Sets up base URL and default headers
 */
const api: AxiosInstance = axios.create({
  baseURL: 'http://13.222.130.172/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

/**
 * Process failed requests queue
 * Retries all queued requests after token refresh
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * Request interceptor
 * Automatically attaches access token to outgoing requests
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState() as { auth: { accessToken: string | null } };
    const token = state.auth.accessToken;
    
    console.log('API Request Interceptor - Token:', token ? 'Present' : 'Missing');
    console.log('API Request URL:', config.url);
    
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      // Don't warn for login requests as they don't require tokens
      const isLoginRequest = config.url?.includes('/auth/login/');
      if (!isLoginRequest) {
        console.warn('No access token found for API request:', config.url);
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles token refresh on 401 errors and retries original requests
 */
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const resultAction = await store.dispatch(refreshToken() as any);
        
        if (refreshToken.fulfilled.match(resultAction)) {
          // Token refresh successful, process queued requests
          processQueue(null, resultAction.payload.accessToken);
          
          // Retry the original request with new token
          const state = store.getState() as { auth: { accessToken: string | null } };
          if (originalRequest.headers) {
            originalRequest.headers.set('Authorization', `Bearer ${state.auth.accessToken}`);
          }
          
          return api(originalRequest);
        } else {
          // Token refresh failed, logout user
          store.dispatch(authSlice.actions.logout());
          processQueue(error, null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Token refresh failed, logout user
        store.dispatch(authSlice.actions.logout());
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      store.dispatch(authSlice.actions.setError('You do not have permission to perform this action'));
    } else if ((error.response?.status ?? 0) >= 500) {
      // Server error
      store.dispatch(authSlice.actions.setError('Server error. Please try again later.'));
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      // Network error
      store.dispatch(authSlice.actions.setError('Network error. Please check your connection.'));
    }

    return Promise.reject(error);
  }
);

/**
 * Utility function to set auth token manually
 * Useful for initial app load or after successful login
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

/**
 * Utility function to clear auth token
 * Useful for logout
 */
export const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

/**
 * Utility function to check if user is authenticated
 * Based on token presence and validity
 */
export const isAuthenticated = (): boolean => {
  const state = store.getState() as { auth: { accessToken: string | null; isAuthenticated: boolean } };
  return !!(state.auth.accessToken && state.auth.isAuthenticated);
};

export default api;
