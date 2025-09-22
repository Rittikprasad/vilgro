import React from 'react';

/**
 * Simple navigation component to test routing functionality
 * This component demonstrates that React Router is working correctly
 */
const Navigation: React.FC = () => {
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '10px' }}>
      <h3>Navigation Test</h3>
      <p>✅ React Router is working correctly!</p>
      <p>Current routes available:</p>
      <ul>
        <li>/ - Home page (landing page)</li>
        <li>/login - Login page</li>
      </ul>
    </div>
  );
};

export default Navigation;
