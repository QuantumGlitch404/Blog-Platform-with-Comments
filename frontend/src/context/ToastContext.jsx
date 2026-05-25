import { createContext, useState, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[250px] toast-enter ${
                  toast.type === 'error'
                    ? 'bg-accent-danger text-bg-primary'
                    : toast.type === 'success'
                    ? 'bg-accent-success text-bg-primary'
                    : 'bg-bg-elevated text-text-primary border border-border-focus'
                }`}
              >
                <span>{toast.message}</span>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-4 opacity-70 hover:opacity-100"
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
