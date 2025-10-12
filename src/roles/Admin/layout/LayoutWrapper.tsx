import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`min-h-screen bg-[#F8F6F0] flex flex-col ${className}`}>
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex flex-1 p-6">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 pl-6 pr-6 overflow-auto">
          {children}
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LayoutWrapper;
