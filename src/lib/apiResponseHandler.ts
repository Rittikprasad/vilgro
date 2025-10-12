import { showNotification } from '../services/notificationService';

export interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: any;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface ApiError {
  response?: {
    data?: any;
    status?: number;
  };
  message?: string;
}

/**
 * Centralized API response handler
 * Automatically shows notifications based on API responses
 */
export class ApiResponseHandler {
  /**
   * Handle successful API responses
   */
  static handleSuccess(response: ApiResponse, defaultMessage?: string) {
    const message = response.message || defaultMessage || 'Operation completed successfully';
    
    showNotification({
      type: 'success',
      title: 'Success',
      message: message,
      duration: 4000,
    });
  }

  /**
   * Handle API errors (400, 401, 403, 404, 500, etc.)
   */
  static handleError(error: ApiError, defaultMessage?: string) {
    const errorData = error.response?.data || {};
    const status = error.response?.status || 500;
    
    // Handle different error scenarios
    if (status === 400) {
      this.handle400Error(errorData);
    } else if (status === 401) {
      this.handle401Error(errorData);
    } else if (status === 403) {
      this.handle403Error(errorData);
    } else if (status === 404) {
      this.handle404Error(errorData);
    } else if (status >= 500) {
      this.handle500Error(errorData);
    } else {
      this.handleGenericError(errorData, defaultMessage);
    }
  }

  /**
   * Handle 400 Bad Request errors
   */
  private static handle400Error(errorData: any) {
    // Check for field-specific errors
    if (errorData.email && Array.isArray(errorData.email)) {
      const emailError = errorData.email[0];
      if (emailError.includes("An account with this email already exists.")) {
        showNotification({
          type: 'error',
          title: 'Email Already Exists',
          message: 'An account with this email already exists. Please try logging in or use a different email.',
          duration: 6000,
        });
        return;
      } else {
        showNotification({
          type: 'error',
          title: 'Email Error',
          message: emailError,
          duration: 5000,
        });
        return;
      }
    }

    if (errorData.password && Array.isArray(errorData.password)) {
      showNotification({
        type: 'error',
        title: 'Password Error',
        message: errorData.password[0],
        duration: 5000,
      });
      return;
    }

    if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
      showNotification({
        type: 'error',
        title: 'Validation Error',
        message: errorData.non_field_errors[0],
        duration: 5000,
      });
      return;
    }

    // Generic 400 error
    showNotification({
      type: 'error',
      title: 'Invalid Request',
      message: errorData.message || 'Please check your input and try again.',
      duration: 5000,
    });
  }

  /**
   * Handle 401 Unauthorized errors
   */
  private static handle401Error(errorData: any) {
    if (errorData.message?.includes("Invalid credentials") || errorData.message?.includes("Invalid email or password")) {
      showNotification({
        type: 'error',
        title: 'Login Failed',
        message: 'Invalid email or password. Please check your credentials and try again.',
        duration: 5000,
      });
    } else if (errorData.message?.includes("Account not found")) {
      showNotification({
        type: 'error',
        title: 'Account Not Found',
        message: 'No account found with this email. Please sign up first.',
        duration: 5000,
      });
    } else {
      showNotification({
        type: 'error',
        title: 'Unauthorized',
        message: errorData.message || 'Please log in to continue.',
        duration: 5000,
      });
    }
  }

  /**
   * Handle 403 Forbidden errors
   */
  private static handle403Error(errorData: any) {
    showNotification({
      type: 'error',
      title: 'Access Denied',
      message: errorData.message || 'You do not have permission to perform this action.',
      duration: 5000,
    });
  }

  /**
   * Handle 404 Not Found errors
   */
  private static handle404Error(errorData: any) {
    showNotification({
      type: 'error',
      title: 'Not Found',
      message: errorData.message || 'The requested resource was not found.',
      duration: 5000,
    });
  }

  /**
   * Handle 500+ Server errors
   */
  private static handle500Error(_errorData: any) {
    showNotification({
      type: 'error',
      title: 'Server Error',
      message: 'Something went wrong on our end. Please try again later.',
      duration: 5000,
    });
  }

  /**
   * Handle generic errors
   */
  private static handleGenericError(errorData: any, defaultMessage?: string) {
    showNotification({
      type: 'error',
      title: 'Error',
      message: errorData.message || defaultMessage || 'Something went wrong. Please try again.',
      duration: 5000,
    });
  }

  /**
   * Handle network errors (no response)
   */
  static handleNetworkError() {
    showNotification({
      type: 'error',
      title: 'Network Error',
      message: 'Unable to connect to the server. Please check your internet connection and try again.',
      duration: 5000,
    });
  }
}

/**
 * Hook for handling API responses in components
 */
export const useApiResponseHandler = () => {
  return {
    handleSuccess: ApiResponseHandler.handleSuccess,
    handleError: ApiResponseHandler.handleError,
    handleNetworkError: ApiResponseHandler.handleNetworkError,
  };
};
