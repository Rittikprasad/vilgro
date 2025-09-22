import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/login/Login';
import SignupFlow from './components/signup/SignupFlow';
import SignupStep1 from './components/signup/SignupStep1';
import EnterCode from './components/forgot-password/EnterCode';
import CreateNewPassword from './components/forgot-password/CreateNewPassword';

/**
 * Main App component with routing configuration
 * Sets up React Router for navigation between different pages
 * Routes:
 * - "/" - Home/Landing page
 * - "/login" - User login page
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupFlow />} />
        <Route path="/signup-step1" element={<SignupStep1 />} />
        <Route path="/forgot-password" element={<EnterCode />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
