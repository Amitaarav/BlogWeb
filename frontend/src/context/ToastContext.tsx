import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

type ToastKind = "success" | "error";

interface ToastMessage {
  id: number;
  kind: ToastKind;
  message: string;
}

type ShowToast = (kind: ToastKind, message: string) => void;

const ToastContext = createContext<ShowToast | null>(null);

export function useToast(): ShowToast {
  const showToast = useContext(ToastContext);
  if (!showToast) throw new Error("useToast must be used within ToastProvider");
  return showToast;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;

    const responseText = error.response?.data;
    if (typeof responseText === "string" && responseText.trim()) {
      return responseText;
    }
  }

  return fallback;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, number>());

  const dismissToast = useCallback((id: number) => {
    window.clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback<ShowToast>((kind, message) => {
    const id = ++nextId.current;
    setToasts((current) => [...current, { id, kind, message }]);
    timers.current.set(id, window.setTimeout(() => dismissToast(id), 5000));
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        className="fixed right-4 top-4 z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
        aria-label="Notifications"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const isError = toast.kind === "error";

          return (
            <div
              key={toast.id}
              role={isError ? "alert" : "status"}
              className="flex items-start gap-3 rounded border px-4 py-3 font-mono text-sm shadow-lg"
              style={{
                color: "var(--text)",
                backgroundColor: "var(--bg-card)",
                borderColor: isError ? "var(--accent)" : "var(--syn-string)",
              }}
            >
              <span
                aria-hidden="true"
                className="font-bold"
                style={{ color: isError ? "var(--accent)" : "var(--syn-string)" }}
              >
                {isError ? "!" : "✓"}
              </span>
              <p className="min-w-0 flex-1 break-words">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="-mr-1 -mt-1 px-1 text-lg leading-none opacity-70 hover:opacity-100"
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}