"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  LogOut, 
  Phone, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Package, 
  CreditCard,
  ChevronRight,
  Camera,
  MessageCircle,
  Loader2,
  TrendingUp
} from "lucide-react";
import { CatLoader } from "@/components/CatLoader";
import { useNotification } from "@/components/NotificationProvider";

export default function ClientPortal() {
  const [session, setSession] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [phoneInput, setPhoneInput] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    const savedSession = localStorage.getItem("clientSession");
    if (savedSession) {
      setSession(savedSession);
      fetchDashboard(savedSession);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchDashboard(clientId: string) {
    try {
      const res = await fetch("/api/client-portal/dashboard", {
        headers: { "Authorization": clientId }
      });
      if (res.ok) {
        const dashboardData = await res.json();
        setData(dashboardData);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to load dashboard:", error);
      showNotification("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch(`/api/client-portal/auth?phone=${phoneInput}`);
      const result = await res.json();
      if (result.success) {
        localStorage.setItem("clientSession", result.clientId);
        setSession(result.clientId);
        fetchDashboard(result.clientId);
        showNotification("Welcome to your dashboard!", "success");
      } else {
        showNotification(result.error || "Login failed", "error");
      }
    } catch (error) {
      showNotification("Connection error. Please try again.", "error");
    } finally {
      setLoginLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("clientSession");
    setSession(null);
    setData(null);
    showNotification("Logged out successfully", "info");
  }

  if (loading) {
    return <CatLoader />;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-500 rounded-2xl mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/30">
              <GraduationCap size={32} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Scholar Portal</h1>
            <p className="text-zinc-500 text-sm mt-1">Track your academic orders with ease.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Phone Number</label>
              <input 
                type="tel" 
                placeholder="Enter your registered phone"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                required
              />
            </div>
            <button 
              disabled={loginLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access Portal"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-500">
            Need help? Contact <a href="https://wa.me/8801875191553" className="text-indigo-600 font-bold">Support</a>
          </p>
        </motion.div>
      </div>
    );
  }

  const { profile, tasks } = data || {};
  const totalPaid = tasks?.reduce((acc: number, t: any) => acc + (t.advancePaid || 0), 0) || 0;
  const totalValue = tasks?.reduce((acc: number, t: any) => acc + (t.totalValue || 0) + (t.bonus || 0), 0) || 0;
  const totalDue = totalValue - totalPaid;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-6 sm:p-8 rounded-[40px] border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4">
            <button onClick={logout} className="p-2 text-zinc-400 hover:text-rose-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>

          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 shadow-xl relative">
              <img 
                src={profile?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'C')}&background=6366f1&color=fff`} 
                className="w-full h-full object-cover"
                alt="Profile"
              />
            </div>
            <button className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all border-2 border-white dark:border-zinc-900">
              <Camera size={16} />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{profile?.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigator.clipboard.writeText(profile?.phone || "");
                  showNotification("Phone number copied!", "success");
                }}
                className="flex items-center gap-1.5 text-zinc-500 text-sm font-medium cursor-pointer hover:text-indigo-500 transition-colors"
              >
                <Phone size={14} className="text-indigo-500" />
                {profile?.phone}
              </motion.div>
              <div className="flex items-center gap-1.5 text-zinc-500 text-sm font-medium">
                <MapPin size={14} className="text-indigo-500" />
                {profile?.university || "Public University"}
              </div>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                {profile?.program || "Undergraduate"}
              </span>
              <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-zinc-200 dark:border-zinc-800">
                {profile?.subject || "Engineering"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Orders", value: tasks?.length || 0, icon: Package, color: "text-indigo-600 dark:text-indigo-400" },
            { label: "Paid Amount", value: `৳${totalPaid.toLocaleString()}`, icon: CreditCard, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Remaining Due", value: `৳${totalDue.toLocaleString()}`, icon: TrendingUp, color: totalDue > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 ${stat.color}`}>
                  <stat.icon size={18} />
                </div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[2px]">{stat.label}</p>
              </div>
              <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-[4px] ml-1">Your Orders</h3>
          <div className="grid grid-cols-1 gap-6">
            {tasks?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((tk: any) => {
              const statusMap: any = { 'pending': 1, 'in_progress': 2, 'review': 3, 'done': 4 };
              const step = statusMap[tk.status] || 1;
              const progress = (step / 4) * 100;
              const isDone = tk.status === 'done';
              const due = (tk.totalValue || 0) + (tk.bonus || 0) - (tk.advancePaid || 0);

              return (
                <motion.div 
                  key={tk._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-[#0f172a] rounded-[32px] p-6 sm:p-8 border border-zinc-100 dark:border-white/5 shadow-xl shadow-zinc-200/20 dark:shadow-none space-y-8"
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">{tk.workType || 'Task'}</span>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                          Order <span className="text-zinc-900 dark:text-white font-black tracking-tighter">#{tk.orderId}</span>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-zinc-900 dark:text-white">{tk.title}</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-zinc-100 overflow-hidden">
                          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(tk.assignedTo || 'W')}&background=random`} className="w-full h-full" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Coordinator</p>
                          <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300">{tk.assignedTo || "Assigning..."}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col justify-between items-end gap-4">
                      <div className={`px-4 py-1.5 rounded-full ${isDone ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'} text-[11px] font-black uppercase tracking-widest border`}>
                        {tk.status.replace('_', ' ')}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Due Amount</p>
                        <p className={`text-2xl font-black ${due > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>৳{due.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-5">
                    <div className="h-2 w-full bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      <span className={step >= 1 ? "text-indigo-500" : ""}>Briefing</span>
                      <span className={step >= 2 ? "text-indigo-500" : ""}>Drafting</span>
                      <span className={step >= 3 ? "text-indigo-500" : ""}>Refining</span>
                      <span className={step >= 4 ? "text-emerald-500" : ""}>Delivered</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-100 dark:border-white/5 flex flex-wrap gap-3">
                    <a href={`/track/${tk.orderId}`} className="px-6 py-3 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 transition-all">Track Order</a>
                    {tk.link && (
                      <a href={tk.link} target="_blank" className="px-6 py-3 rounded-2xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all">View Files</a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer Support */}
        <div className="text-center py-12">
          <p className="text-zinc-500 text-sm mb-4 font-medium">Have questions about your orders?</p>
          <a href="https://wa.me/8801875191553" className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20">
            <MessageCircle size={20} />
            Contact Coordinator
          </a>
        </div>
      </div>
    </div>
  );
}
