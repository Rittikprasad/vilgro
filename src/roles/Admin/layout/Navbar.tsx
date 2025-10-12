import React from 'react';
import logo from '../../../assets/logo.png';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  return (
    <nav className={`bg-[#F8F6F0] px-6 py-4 flex items-center justify-between ${className}`}>
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <img 
          src={logo} 
          alt="villgro possible." 
          className="h-10 w-auto"
        />
      </div>

      {/* Right Section - Search and Profile */}
      <div className="flex items-center space-x-4">
        {/* Search Icon */}
        <button className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200">
          <svg 
            className="w-5 h-5 text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </button>

        {/* Profile Icon */}
        <button className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200">
          <svg 
            className="w-5 h-5 text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
