// Notification service to avoid circular imports
// This will be used by the API response handler

let notificationCallback: ((notification: any) => void) | null = null;

export const setNotificationCallback = (callback: (notification: any) => void) => {
  notificationCallback = callback;
};

export const showNotification = (notification: {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}) => {
  if (notificationCallback) {
    notificationCallback(notification);
  } else {
    console.warn('Notification callback not set. Notification:', notification);
  }
};
