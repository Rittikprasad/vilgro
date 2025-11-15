import React, { useState } from 'react';

interface SomewhatLikelyIconProps {
  defaultColor?: string;
  activeColor?: string;
  size?: number;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  onActiveChange?: (isActive: boolean) => void;
}

const SomewhatLikelyIcon: React.FC<SomewhatLikelyIconProps> = ({
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
        d="M17.5 0C7.85051 0 0 7.85051 0 17.5C0 27.1495 7.85051 35 17.5 35C27.1495 35 35 27.1495 35 17.5C35 7.85051 27.1496 0 17.5 0ZM17.5 33.1081C13.2128 33.1081 9.3242 31.3704 6.50051 28.5628C5.37293 27.4416 4.41574 26.1494 3.67044 24.7293C2.53541 22.5667 1.89192 20.1072 1.89192 17.5C1.89192 8.89367 8.89367 1.89192 17.5 1.89192C21.5822 1.89192 25.3026 3.46788 28.0868 6.04255C29.5303 7.3773 30.7224 8.98022 31.5819 10.7719C32.5598 12.8103 33.1081 15.0923 33.1081 17.5C33.1081 26.1063 26.1063 33.1081 17.5 33.1081Z"
        fill={currentColor}
      />
      <path
        d="M11.5184 13.5272C12.5353 13.5272 13.3627 14.3072 13.3627 15.3714H15.2546C15.2546 13.243 13.5786 11.6353 11.5184 11.6353C9.45823 11.6353 7.78223 13.243 7.78223 15.3714H9.67414C9.67414 14.3072 10.5016 13.5272 11.5184 13.5272Z"
        fill={currentColor}
      />
      <path
        d="M23.4813 13.5272C24.4982 13.5272 25.3256 14.3072 25.3256 15.3714H27.2175C27.2175 13.243 25.5415 11.6353 23.4813 11.6353C21.4211 11.6353 19.7451 13.243 19.7451 15.3714H21.637C21.637 14.3072 22.4644 13.5272 23.4813 13.5272Z"
        fill={currentColor}
      />
      <path
        d="M17.4668 27.1959C21.1269 27.1959 24.6347 25.3241 26.643 22.2163L25.0539 21.1895C23.2098 24.0433 19.8353 25.6361 16.4584 25.2462C13.826 24.9427 11.3917 23.4261 9.9464 21.1895L8.35742 22.2163C10.1063 24.9228 13.0536 26.758 16.2415 27.1256C16.6508 27.1729 17.0594 27.1959 17.4668 27.1959Z"
        fill={currentColor}
      />
    </svg>
  );
};

export default SomewhatLikelyIcon;

