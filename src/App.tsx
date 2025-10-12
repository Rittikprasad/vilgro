import React from 'react';
import AppRouter from './components/AppRouter';
import { NotificationProvider } from './components/ui/NotificationContext';

/**
 * Main App component
 * Uses AppRouter for all routing and authentication logic
 */
const App: React.FC = () => {
  return (
    <NotificationProvider>
      <AppRouter />
    </NotificationProvider>
  );
};

export default App;
