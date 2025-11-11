import React from 'react';
import logo from '../../../assets/logo.png';
import ProfileIcon from '../../../assets/svg/ProfileIcon.svg'
import SearchIcon from '../../../assets/svg/SearchIcon.svg'

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  return (
    <nav className={`bg-[#F8F6F0] px-16 py-4 flex items-center justify-between ${className}`}>
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
          <img src={SearchIcon} alt="Search" className="w-8 h-8" />
        </button>

        {/* Profile Icon */}
        <button className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200">
          <img src={ProfileIcon} alt="Profile" className="w-8 h-8" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
