import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login } from '../../features/auth/authThunks';
import { clearError } from '../../features/auth/authSlice';

/**
 * Login form component
 * Demonstrates how to use the authentication system with Redux Toolkit
 */
const LoginForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  /**
   * Handles form input changes
   * Updates form state when user types
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles form submission
   * Dispatches login thunk with form data
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any existing errors
    dispatch(clearError());
    
    // Dispatch login thunk
    const result = await dispatch(login(formData));
    
    if (login.fulfilled.match(result)) {
      // Login successful - redirect or show success message
      console.log('Login successful:', result.payload);
    } else {
      // Login failed - error is already handled by the thunk
      console.error('Login failed:', result.payload);
    }
  };

  // If user is already authenticated, show different content
  if (isAuthenticated) {
    return (
      <div className="p-6 bg-green-100 border border-green-400 rounded-lg">
        <h2 className="text-xl font-semibold text-green-800 mb-2">
          Already Logged In
        </h2>
        <p className="text-green-700">
          You are already authenticated. Welcome back!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          } text-white transition-colors`}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
