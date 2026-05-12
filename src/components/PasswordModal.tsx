"use client";

import { useState } from "react";

import { Modal } from "./Modal";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Loader2, ShieldCheck } from "lucide-react";
import { useTranslation } from "./LanguageProvider";
import { shakeVariants } from "@/lib/animations";

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
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      if (password === requiredPassword) {
        setSuccess(true);
        setTimeout(() => {
          setPassword("");
          setError(false);
          setSuccess(false);
          onVerify();
          onClose();
        }, 800);
      } else {
        setError(true);
      }
      setLoading(false);
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modal_auth_title')}>
      <motion.form 
        onSubmit={handleSubmit} 
        animate={error ? "shake" : ""}
        variants={shakeVariants}
        className="space-y-6"
      >
        <div className="text-center space-y-4">
          <motion.div 
            animate={success ? { scale: [1, 1.2, 1], backgroundColor: ["rgba(255,255,255,0.05)", "#10b981", "#10b981"] } : {}}
            className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-zinc-400 border border-white/10"
          >
            {success ? <ShieldCheck size={32} className="text-white" /> : <Lock size={32} />}
          </motion.div>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[4px] px-4 leading-relaxed">{message}</p>
        </div>

        <div className="space-y-3">
          <input 
            type="password" 
            placeholder="••••••••"
            className={`w-full px-4 py-5 rounded-3xl border-2 ${error ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 bg-white/5 focus:border-indigo-500'} outline-none text-center text-2xl tracking-[12px] transition-all text-white font-clash`}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            autoFocus
            required
          />
          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[10px] font-black text-rose-500 uppercase tracking-[3px] text-center"
              >
                Access Denied. Try Again.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading || success}
          className={`w-full py-5 rounded-3xl font-black uppercase tracking-[6px] transition-all flex items-center justify-center gap-3 shadow-2xl ${
            success ? 'bg-emerald-500 text-white' : 'bg-white text-zinc-950 hover:bg-zinc-200'
          }`}
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : success ? "Authorized" : "Verify Access"}
        </motion.button>
      </motion.form>
    </Modal>
  );
}
