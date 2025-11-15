import React, { useState } from 'react';

interface VeryLikelyIconProps {
  defaultColor?: string;
  activeColor?: string;
  size?: number;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  onActiveChange?: (isActive: boolean) => void;
}

const VeryLikelyIcon: React.FC<VeryLikelyIconProps> = ({
  defaultColor = '#231F20',
  activeColor = '#46B753',
  size = 35,
  onClick,
  className = '',
  isActive: controlledIsActive,
  onActiveChange
}) => {
  const [internalIsActive, setInternalIsActive] = useState(false);
  
  // Use controlled state if provided, otherwise use internal state
  const isActive = controlledIsActive !== undefined ? controlledIsActive : internalIsActive;

  const handleClick = () => {
    const newActiveState = !isActive;
    
    if (controlledIsActive === undefined) {
      setInternalIsActive(newActiveState);
    }
    
    onActiveChange?.(newActiveState);
    onClick?.();
  };

  const currentColor = isActive ? activeColor : defaultColor;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      className={`cursor-pointer transition-colors duration-200 ${className}`}
      style={{ color: currentColor }}
    >
      <path
        d="M29.8743 5.12565C26.5691 1.82034 22.1744 0 17.5 0C12.8256 0 8.4309 1.82034 5.12565 5.12565C1.82027 8.4309 0 12.8256 0 17.5C0 22.1744 1.82027 26.5691 5.12565 29.8743C8.4309 33.1797 12.8256 35 17.5 35C22.1744 35 26.5691 33.1797 29.8743 29.8743C33.1797 26.5691 35 22.1744 35 17.5C35 12.8256 33.1797 8.4309 29.8743 5.12565ZM17.5 32.9167C8.99924 32.9167 2.08332 26.0008 2.08332 17.5C2.08332 8.99924 8.99924 2.08332 17.5 2.08332C26.0008 2.08332 32.9167 8.99924 32.9167 17.5C32.9167 26.0008 26.0008 32.9167 17.5 32.9167Z"
        fill={currentColor}
      />
      <path
        d="M13.7149 12.8785C12.0091 11.1726 9.23353 11.1727 7.52776 12.8785C7.12095 13.2852 7.12095 13.9448 7.52776 14.3516C7.93464 14.7584 8.59424 14.7584 9.00097 14.3516C9.89457 13.4581 11.3484 13.4582 12.2419 14.3516C12.4453 14.5551 12.7119 14.6568 12.9784 14.6568C13.2449 14.6568 13.5116 14.5551 13.7149 14.3516C14.1217 13.9448 14.1217 13.2853 13.7149 12.8785Z"
        fill={currentColor}
      />
      <path
        d="M27.4727 12.8785C25.7669 11.1727 22.9913 11.1726 21.2856 12.8785C20.8788 13.2852 20.8788 13.9448 21.2856 14.3516C21.6924 14.7584 22.352 14.7584 22.7588 14.3516C23.6522 13.4581 25.1061 13.4581 25.9997 14.3516C26.2031 14.5551 26.4697 14.6568 26.7362 14.6568C27.0027 14.6568 27.2694 14.5551 27.4727 14.3516C27.8795 13.9448 27.8795 13.2853 27.4727 12.8785Z"
        fill={currentColor}
      />
      <path
        d="M26.7365 18.2637H8.26432C7.689 18.2637 7.22266 18.7301 7.22266 19.3053C7.22266 24.9725 11.8333 29.5831 17.5004 29.5831C23.1676 29.5831 27.7782 24.9725 27.7782 19.3053C27.7782 18.73 27.3118 18.2637 26.7365 18.2637ZM17.5004 27.4998C13.3347 27.4998 9.88505 24.3755 9.37188 20.347H25.629C25.1158 24.3755 21.6661 27.4998 17.5004 27.4998Z"
        fill={currentColor}
      />
    </svg>
  );
};

export default VeryLikelyIcon;

