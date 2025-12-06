// src/lib/toast.js

// Dispatch a custom event to show a toast
export const toast = {
  success: (message) => {
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { type: 'success', message },
      }),
    );
  },
  error: (message) => {
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { type: 'error', message },
      }),
    );
  },
};
