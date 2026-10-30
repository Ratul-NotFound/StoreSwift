"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (options: { title: string; description?: string; type?: ToastType }) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({
      title,
      description,
      type = "info"
    }: {
      title: string;
      description?: string;
      type?: ToastType;
    }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const success = useCallback((title: string, description?: string) => toast({ title, description, type: "success" }), [toast]);
  const error = useCallback((title: string, description?: string) => toast({ title, description, type: "error" }), [toast]);
  const info = useCallback((title: string, description?: string) => toast({ title, description, type: "info" }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 35 }}
              className="pointer-events-auto bg-white/95 backdrop-blur-md border border-zinc-200/90 rounded-2xl shadow-float p-3.5 flex items-start space-x-3 text-zinc-900"
            >
              <div className="flex-shrink-0 mt-0.5">
                {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {t.type === "error" && <AlertCircle className="w-4 h-4 text-rose-600" />}
                {t.type === "info" && <Info className="w-4 h-4 text-blue-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold tracking-tight text-zinc-900">{t.title}</p>
                {t.description && <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">{t.description}</p>}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg transition"
                aria-label="Close notification"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
