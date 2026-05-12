"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface NotificationContextType {
  showNotification: (message: string, type?: ToastType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showNotification = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 w-full max-w-[400px]">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              layout
              className={`flex items-center gap-4 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl ${
                toast.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                toast.type === "error" ? "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400" :
                toast.type === "warning" ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400" :
                "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400"
              }`}
            >
              <div className="shrink-0">
                {toast.type === "success" && <CheckCircle2 size={20} />}
                {toast.type === "error" && <XCircle size={20} />}
                {toast.type === "warning" && <AlertCircle size={20} />}
                {toast.type === "info" && <Info size={20} />}
              </div>
              <p className="text-xs font-black uppercase tracking-widest flex-1 leading-relaxed">
                {toast.message}
              </p>
              <button onClick={() => removeToast(toast.id)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
}
