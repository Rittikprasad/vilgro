import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardSvg from '../../../assets/svg/DashboardSvg.svg';
import SPOsSvg from '../../../assets/svg/SPOsSvg.png';
import QuestionsSvg from '../../../assets/svg/QuestionsSvg.png';
import BanksSvg from '../../../assets/svg/BanksSvg.png';
import ReviewsSvg from '../../../assets/svg/ReviewsSvg.png';
import AdminsSvg from '../../../assets/svg/AdminsSvg.png';
import ActivitySvg from '../../../assets/svg/ActivitySvg.png';
import LogoutSvg from '../../../assets/svg/LogoutSvg.png';
import ConfirmationModal from '../../../components/ui/ConfirmationModal';
import { useAppDispatch } from '../../../app/hooks';
import { logoutUser } from '../../../features/auth/authThunks';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  isLogout?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardSvg, path: '/admin/dashboard' },
    { id: 'spos', label: 'SPOs', icon: SPOsSvg, path: '/admin/spos' },
    { id: 'questions', label: 'Questions', icon: QuestionsSvg, path: '/admin/questions' },
    { id: 'banks', label: 'Banks', icon: BanksSvg, path: '/admin/banks' },
    { id: 'reviews', label: 'Reviews', icon: ReviewsSvg, path: '/admin/reviews' },
    { id: 'admins', label: 'Admins', icon: AdminsSvg, path: '/admin/admins' },
    { id: 'activity', label: 'Activity Log', icon: ActivitySvg, path: '/admin/activity' },
    { id: 'logout', label: 'Logout', icon: LogoutSvg, path: '/logout', isLogout: true },
  ];

  const handleNavigation = (item: NavItem) => {
    if (item.isLogout) {
      setIsLogoutModalOpen(true);
      return;
    }
    navigate(item.path);
  };

  const handleConfirmLogout = async () => {
    setIsLogoutModalOpen(false);
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <aside className={`w-55 min-h-screen rounded-2xl ${className}`} style={{
        boxShadow: '0px 0px 15px 0px #00000026',
        backdropFilter: 'blur(66.30000305175781px)'
      }}>
        {/* Navigation Items */}
        <nav className="p-4">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center space-x-3 px-4 py-3 transition-all duration-200 ${
                  active
                    ? 'bg-white text-[#46B753]'
                    : 'text-gray-700'
                } ${item.isLogout ? 'mt-8' : ''}`}
                style={{
                  borderRadius: active ? '40px' : '8px',
                  boxShadow: active ? '0px 0px 11px 0px #00000026' : 'none'
                }}
              >
                <img 
                  src={item.icon} 
                  alt={item.label}
                  className={`w-5 h-5`}
                />
                <span 
                  className="font-normal"
                  style={{
                    fontFamily: 'Golos Text',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '14px'
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

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

export default Sidebar;
