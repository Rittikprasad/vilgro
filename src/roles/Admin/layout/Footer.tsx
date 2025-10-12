import React from 'react';
import logo from '../../../assets/logo.png';
import convergenceLogo from '../../../assets/convergence.png';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-[#FFFFFF] px-6 py-8 flex items-center gap-8 justify-end ${className}`}>
      {/* Left Section - Developed by */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-600 text-sm">developed by</span>
        <div className="flex items-center space-x-1">
          <img 
            src={logo} 
            alt="villgro possible." 
            className="h-12 w-auto"
          />
        </div>
      </div>

      {/* Right Section - Supported by */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-600 text-sm">supported by</span>
        <img 
          src={convergenceLogo} 
          alt="CONVERGENCE BLENDING GLOBAL FINANCE" 
          className="h-12 w-auto"
        />
      </div>
    </footer>
  );
};

export default Footer;
