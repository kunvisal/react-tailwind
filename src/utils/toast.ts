import toast from "react-hot-toast";

/**
 * Show success toast notification
 */
export function showSuccess(message: string, duration: number = 3000) {
  toast.success(message, {
    duration,
    position: "top-right",
    style: {
      background: "#10b981",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#10b981",
    },
  });
}

/**
 * Show error toast notification
 */
export function showError(message: string, duration: number = 4000) {
  toast.error(message, {
    duration,
    position: "top-right",
    style: {
      background: "#ef4444",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#ef4444",
    },
  });
}

/**
 * Show info toast notification
 */
export function showInfo(message: string, duration: number = 3000) {
  toast(message, {
    duration,
    position: "top-right",
    icon: "ℹ️",
    style: {
      background: "#3b82f6",
      color: "#fff",
    },
  });
}

/**
 * Show warning toast notification
 */
export function showWarning(message: string, duration: number = 3500) {
  toast(message, {
    duration,
    position: "top-right",
    icon: "⚠️",
    style: {
      background: "#f59e0b",
      color: "#fff",
    },
  });
}

/**
 * Show loading toast notification
 */
export function showLoading(message: string) {
  return toast.loading(message, {
    position: "top-right",
  });
}

/**
 * Dismiss a specific toast
 */
export function dismissToast(toastId: string) {
  toast.dismiss(toastId);
}

/**
 * Dismiss all toasts
 */
export function dismissAllToasts() {
  toast.dismiss();
}

/**
 * Show promise toast (loading, success, error states)
 */
export function showPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) {
  return toast.promise(
    promise,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      position: "top-right",
    }
  );
}

