import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import SearchIcon from '../../../assets/svg/SearchIcon.svg';
import ProfileIcon from '../../../assets/svg/ProfileIcon.svg';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const navigate = useNavigate();

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
        {/* <button className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200">
          <img src={SearchIcon} alt="Search" className="w-8 h-8" />
        </button> */}

        {/* Profile Icon */}
        <button
          className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
          onClick={() => navigate('/admin/profile')}
        >
          <img src={ProfileIcon} alt="Profile" className="w-8 h-8" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
