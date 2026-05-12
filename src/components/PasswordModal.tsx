"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { Lock, Loader2 } from "lucide-react";
import { useTranslation } from "./LanguageProvider";

export function PasswordModal({ 
  isOpen, 
  onClose, 
  onVerify, 
  message,
  requiredPassword
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onVerify: () => void;
  message: string;
  requiredPassword: string;
}) {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Artificial delay for premium feel
    setTimeout(() => {
      if (password === requiredPassword) {
        setPassword("");
        setError(false);
        onVerify();
        onClose();
      } else {
        setError(true);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modal_auth_title')}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-zinc-500 dark:text-zinc-400">
            <Lock size={24} />
          </div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-4">{message}</p>
        </div>

        <div className="space-y-2">
          <input 
            type="password" 
            placeholder="••••••••"
            className={`w-full px-4 py-4 rounded-2xl border ${error ? 'border-rose-500 bg-rose-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950'} focus:ring-2 focus:ring-indigo-500 outline-none text-center text-xl tracking-[10px] transition-all`}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            autoFocus
            required
          />
          {error && (
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center">Incorrect Password. Try Again.</p>
          )}
        </div>

        <button 
          disabled={loading}
          className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 py-4 rounded-2xl font-black uppercase tracking-[4px] hover:opacity-90 transition-all shadow-xl shadow-zinc-500/10 flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
        </button>
      </form>
    </Modal>
  );
}
