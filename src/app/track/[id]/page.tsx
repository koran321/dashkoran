"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Search, Loader2, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function TrackingPage() {
  const params = useParams();
  const [orderId, setOrderId] = useState(params.id as string || "");
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTask = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/track/${id.trim().toUpperCase()}`);
      if (!res.ok) {
        throw new Error(res.status === 404 ? "Order not found. Please check your Order ID." : "Server error. Please try again.");
      }
      const data = await res.json();
      if (data.error) throw new Error(data.error);
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
    { id: "pending", label: "Pending", status: "pending" },
    { id: "in_progress", label: "Working", status: "in_progress" },
    { id: "review", label: "Review", status: "review" },
    { id: "done", label: "Done", status: "done" },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === task?.status);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8 flex flex-col items-center">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl text-center mb-12"
      >
        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">Assignment Koran</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-medium tracking-wide uppercase text-[10px]">Order Tracking Portal</p>
      </motion.div>

      <motion.div 
        layout
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 rounded-3xl shadow-xl space-y-8"
      >
        {!task && !loading && (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold">Track Your Order</h2>
            <form onSubmit={handleSearch} className="relative group">
              <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Order ID (e.g. AK-7X9Z)" 
                className="w-full px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center text-sm font-bold tracking-widest focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
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
            <p className="text-sm font-medium text-zinc-500 animate-pulse">Fetching order details...</p>
          </div>
        )}

        {task && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                {task.title}
              </h2>
              <p className="text-sm text-zinc-500 font-medium">
                Order for <span className="text-indigo-600 dark:text-indigo-400 font-bold">{task.clientName}</span>
              </p>
            </div>

            {/* Progress Bar */}
            <div className="relative pt-10 pb-4">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="absolute top-0 left-0 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              />
              
              <div className="flex justify-between mt-[-12px] relative">
                {steps.map((step, i) => (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div className={`w-6 h-6 rounded-full border-4 border-white dark:border-zinc-900 z-10 transition-colors duration-500 ${
                      i <= currentStepIndex ? "bg-indigo-500" : "bg-zinc-200 dark:bg-zinc-800"
                    }`} />
                    <span className={`text-[9px] font-bold uppercase tracking-wider ${
                      i <= currentStepIndex ? "text-indigo-500" : "text-zinc-400"
                    }`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Expected Delivery</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Clock size={14} className="text-indigo-500" />
                  {new Date(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                task.status === 'done' 
                  ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
              }`}>
                {task.status.replace('_', ' ')}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {task && (
        <button 
          onClick={() => setTask(null)}
          className="mt-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-indigo-500 transition-colors"
        >
          Track another order
        </button>
      )}
    </div>
  );
}
