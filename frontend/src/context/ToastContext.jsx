import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const lastToastRef = useRef({
    message: "",
    type: "",
    time: 0,
  });

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 3000) => {
      const now = Date.now();

      const isDuplicate =
        lastToastRef.current.message === message &&
        lastToastRef.current.type === type &&
        now - lastToastRef.current.time < 1200;

      if (isDuplicate) return;

      lastToastRef.current = {
        message,
        type,
        time: now,
      };

      const id = `${now}-${Math.random().toString(36).slice(2, 9)}`;

      const newToast = {
        id,
        message,
        type,
      };

      setToasts((prev) => [...prev, newToast]);

      window.setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast,
    }),
    [toasts, showToast, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}