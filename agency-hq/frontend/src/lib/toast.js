// Simple event bus for toasts — no library needed
// Allows any part of the app to show notifications

const listeners = [];

export const toast = {
  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} type - Type: 'info', 'success', 'error', 'warning'
   */
  show: (message, type = 'info') => {
    const id = Date.now() + Math.random();
    listeners.forEach(fn => fn({ message, type, id }));
    return id;
  },

  success: (message) => toast.show(message, 'success'),
  error: (message) => toast.show(message, 'error'),
  warning: (message) => toast.show(message, 'warning'),
  info: (message) => toast.show(message, 'info'),

  /**
   * Subscribe to toast events
   * @param {function} fn - Callback function
   * @returns {function} Unsubscribe function
   */
  subscribe: (fn) => {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx > -1) listeners.splice(idx, 1);
    };
  },
};

export default toast;