import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-close after duration
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Match animation duration
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: '✓',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: '✕',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: '⚠',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700',
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'ℹ',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: 'ℹ',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-700',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm w-full mx-auto',
        'transform transition-all duration-300 ease-in-out',
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      )}
    >
      <div
        className={cn(
          'rounded-lg shadow-lg border p-4',
          styles.bg,
          styles.border
        )}
      >
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div
            className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
              styles.iconBg,
              styles.iconColor
            )}
          >
            {styles.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={cn('text-sm font-semibold mb-1', styles.titleColor)}>
              {title}
            </h4>
            <p className={cn('text-sm', styles.messageColor)}>
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className={cn(
              'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center',
              'hover:bg-black hover:bg-opacity-10 transition-colors',
              styles.iconColor
            )}
          >
            <span className="text-xs font-bold">×</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
