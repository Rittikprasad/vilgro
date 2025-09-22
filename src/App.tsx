import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/login/Login';

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
      </Routes>
    </Router>
  );
};

export default App;
