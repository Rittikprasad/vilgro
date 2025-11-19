import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import ProfileIcon from '../../../assets/svg/ProfileIcon.svg'
import { useAppDispatch } from '../../../app/hooks';
import { logoutUser } from '../../../features/auth/authThunks';
import { Button } from '../../../components/ui/Button';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleProfileClick = () => {
    navigate('/banking/profile');
  };

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/signin/banking');
    } catch (error) {
      console.error("Failed to logout banking user", error);
    }
  };

  return (
    <>
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

        {/* Profile Icon */}
        <button
          onClick={handleProfileClick}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
          aria-label="Go to profile"
        >
          <img src={ProfileIcon} alt="Profile" className="w-8 h-8" />
        </button>
        <Button
          variant="gradient"
          onClick={() => setIsLogoutModalOpen(true)}
        >
          Logout
        </Button>
      </div>
    </nav>
    <ConfirmationModal
      isOpen={isLogoutModalOpen}
      title="Logout"
      message="Are you sure you want to logout?"
      confirmText="Logout"
      cancelText="Cancel"
      onConfirm={handleConfirmLogout}
      onCancel={() => setIsLogoutModalOpen(false)}
    />
    </>
  );
};

export default Navbar;
