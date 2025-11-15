import React, { useState } from 'react';

interface NotAtAllLikelyIconProps {
  defaultColor?: string;
  activeColor?: string;
  size?: number;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  onActiveChange?: (isActive: boolean) => void;
}

const NotAtAllLikelyIcon: React.FC<NotAtAllLikelyIconProps> = ({
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
        d="M17.5 0C7.85051 0 0 7.85051 0 17.5C0 27.1495 7.85051 35 17.5 35C27.1495 35 35 27.1495 35 17.5C35 7.85051 27.1495 0 17.5 0ZM17.5 33.1081C13.2128 33.1081 9.3242 31.3704 6.50051 28.5628C5.37293 27.4416 4.41574 26.1494 3.67044 24.7293C2.53541 22.5667 1.89192 20.1072 1.89192 17.5C1.89192 8.89367 8.89367 1.89192 17.5 1.89192C21.5822 1.89192 25.3026 3.46788 28.0868 6.04255C29.5303 7.3773 30.7224 8.98022 31.5819 10.7719C32.5598 12.8103 33.1081 15.0923 33.1081 17.5C33.1081 26.1063 26.1063 33.1081 17.5 33.1081Z"
        fill={currentColor}
      />
      <path
        d="M19.3497 22.1835C21.4253 22.6176 23.2898 23.7845 24.5997 25.4694L26.0933 24.3083C24.5086 22.2697 22.251 20.8574 19.7369 20.3316C15.6935 19.4866 11.4425 21.0472 8.90723 24.3083L10.401 25.4694C12.4958 22.7747 16.0085 21.4847 19.3497 22.1835Z"
        fill={currentColor}
      />
      <path
        d="M11.6663 15.4899C12.7112 15.4899 13.5582 14.6428 13.5582 13.598C13.5582 12.5531 12.7112 11.7061 11.6663 11.7061C10.6215 11.7061 9.77441 12.5531 9.77441 13.598C9.77441 14.6428 10.6215 15.4899 11.6663 15.4899Z"
        fill={currentColor}
      />
      <path
        d="M23.3734 15.4899C24.4182 15.4899 25.2653 14.6428 25.2653 13.598C25.2653 12.5531 24.4182 11.7061 23.3734 11.7061C22.3285 11.7061 21.4814 12.5531 21.4814 13.598C21.4814 14.6428 22.3285 15.4899 23.3734 15.4899Z"
        fill={currentColor}
      />
    </svg>
  );
};

export default NotAtAllLikelyIcon;

