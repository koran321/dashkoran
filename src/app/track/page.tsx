"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Search, Loader2, Clock, CheckCircle2, AlertCircle, History, Moon, Sun, Languages } from "lucide-react";
import { useTranslation } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";

export default function TrackingPage() {
  const params = useParams();
  const [orderId, setOrderId] = useState(params.id as string || "");
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { lang, toggleLang, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  const fetchTask = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/tasks?orderId=${id.trim().toUpperCase()}`);
      let data: any = {};
      try { data = await res.json(); } catch {}
      if (!res.ok) {
        throw new Error(data?.error || (res.status === 404 ? "Order not found." : `Error ${res.status}`));
      }
      setTask(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setTask(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchTask(params.id as string);
    }
  }, [params.id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTask(orderId);
  };

  const steps = [
    { id: "pending", label: t("lbl_pending"), status: "pending", color: "bg-amber-500", glow: "shadow-amber-500/50" },
    { id: "in_progress", label: t("lbl_working"), status: "in_progress", color: "bg-blue-500", glow: "shadow-blue-500/50" },
    { id: "review", label: t("lbl_review"), status: "review", color: "bg-purple-500", glow: "shadow-purple-500/50" },
    { id: "done", label: t("lbl_done"), status: "done", color: "bg-emerald-500", glow: "shadow-emerald-500/50" },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === task?.status);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const activeStep = steps[currentStepIndex];
  const activeColor = activeStep?.color || "bg-indigo-500";
  const activeGlow = activeStep?.glow || "shadow-indigo-500/50";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8 flex flex-col items-center font-satoshi">
      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.2); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite ease-in-out;
        }
      `}</style>

      {/* Header & Controls */}
      <div className="w-full max-w-2xl flex flex-col items-center mb-12">
        <div className="w-full flex justify-end gap-2 mb-8">
          <button 
            onClick={toggleLang}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 transition-colors shadow-sm"
            title="Toggle Language"
          >
            <Languages size={18} />
          </button>
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 transition-colors shadow-sm"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">{t("app_title")}</h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium tracking-wide uppercase text-[10px]">{t("app_subtitle")}</p>
        </motion.div>
      </div>

      <motion.div 
        layout
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 rounded-3xl shadow-xl space-y-8"
      >
        {!task && !loading && (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("track_order_title")}</h2>
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder={t("order_id_placeholder")}
                className="w-full px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center text-sm font-bold tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-zinc-900 dark:text-white"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
              >
                <Search size={18} />
              </button>
            </form>
            {error && <p className="text-rose-500 text-xs font-medium">{error}</p>}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
            <p className="text-sm font-medium text-zinc-500 animate-pulse uppercase tracking-widest">{t("fetching_order")}</p>
          </div>
        )}

        {task && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                  {task.title}
                </h2>
                <p className="text-sm text-zinc-500 font-medium">
                  Order for <span className="text-indigo-600 dark:text-indigo-400 font-bold">{task.clientName && task.clientName !== 'N/A' ? task.clientName : t("val_client")}</span>
                </p>
              </div>
              
              {/* Revision Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 w-fit h-fit shadow-sm">
                <History size={14} className="text-zinc-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{t("lbl_rev")}</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">{task.revisions || 0}</span>
              </div>
            </div>

            {/* Progress Bar with Shimmer Animation */}
            <div className="relative pt-10 pb-4">
              <div className="absolute top-0 left-0 w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={`absolute top-0 left-0 h-2.5 rounded-full transition-all duration-1000 ${activeColor} shadow-[0_0_15px_rgba(0,0,0,0.1)] shadow-inner overflow-hidden ${task.status !== 'done' ? 'animate-pulse-glow shadow-lg ' + activeGlow : ''}`}
              >
                {task.status !== 'done' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ width: '200%' }} />
                )}
              </motion.div>
              
              <div className="flex justify-between mt-[-15px] relative">
                {steps.map((step, i) => (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full border-4 border-white dark:border-zinc-900 z-10 transition-all duration-500 flex items-center justify-center shadow-sm ${
                      i <= currentStepIndex ? step.color + ' text-white ' + (i === currentStepIndex && task.status !== 'done' ? ' ring-4 ring-white/20 dark:ring-white/5 animate-pulse' : '') : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                    }`}>
                      {i < currentStepIndex ? <CheckCircle2 size={14} /> : (i === currentStepIndex && task.status !== 'done' ? <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" /> : <span className="text-[10px] font-bold">{i + 1}</span>)}
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${
                      i <= currentStepIndex ? "text-zinc-900 dark:text-white" : "text-zinc-400"
                    }`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center shadow-sm">
                  <Clock size={20} className="text-indigo-500" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1.5">{t("lbl_delivery")}</p>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">
                    {new Date(task.deadline).toLocaleDateString(lang === 'en' ? 'en-GB' : 'bn-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border transition-all ${
                  task.status === 'done' 
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                    : "bg-zinc-50 text-zinc-600 border-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 " + (task.status !== 'done' ? 'animate-pulse' : '')
                }`}>
                  {t(`lbl_${task.status}`)}
                </div>
                {task.status === 'done' && (
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 size={20} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {task && (
        <button 
          onClick={() => setTask(null)}
          className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-indigo-500 transition-colors"
        >
          <Search size={14} />
          {t("track_another")}
        </button>
      )}

      <style jsx global>{`
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap');
        .font-satoshi { font-family: 'Satoshi', sans-serif; }
      `}</style>
    </div>
  );
}
