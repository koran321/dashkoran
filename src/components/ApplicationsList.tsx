"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageCircle, 
  Phone, 
  Mail, 
  Briefcase, 
  ExternalLink, 
  Archive as ArchiveIcon,
  RotateCcw,
  Trash2,
  Loader2,
  Filter,
  CheckCircle
} from "lucide-react";
import { useTranslation } from "@/components/LanguageProvider";
import { useNotification } from "@/components/NotificationProvider";

interface ApplicationsListProps {
  onAction: (fn: () => Promise<void>, message: string) => void;
}

export function ApplicationsList({ onAction }: ApplicationsListProps) {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [historyFilter, setHistoryFilter] = useState<"all" | "accepted" | "rejected">("all");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const statusParam = activeTab === "pending" ? "pending" : "accepted,rejected";
      const res = await fetch(`/api/applications?status=${statusParam}`);
      let data = await res.json();
      
      if (activeTab === "history" && historyFilter !== "all") {
        data = data.filter((app: any) => app.status === historyFilter);
      }
      
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [activeTab, historyFilter]);

  const handleStatusUpdate = (id: string, status: "accepted" | "rejected" | "pending") => {
    const message = status === "accepted" ? "Accept this application and create task?" : 
                    status === "rejected" ? "Reject this application and archive?" : "Move back to pending?";
    
    onAction(async () => {
      try {
        const res = await fetch(`/api/applications/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        });
        if (res.ok) {
          showNotification(status === "accepted" ? "Application accepted! Client & Task created." : "Application updated.");
          fetchApplications();
        }
      } catch (error) {
        showNotification("Failed to update application", "error");
      }
    }, message);
  };

  const handleDelete = (id: string) => {
    onAction(async () => {
      try {
        const res = await fetch(`/api/applications/${id}`, { method: "DELETE" });
        if (res.ok) {
          showNotification("Application permanently deleted", "warning");
          fetchApplications();
        }
      } catch (error) {
        showNotification("Deletion failed", "error");
      }
    }, "Delete this application permanently?");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-fit shadow-sm">
          <button 
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === "pending" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <Clock size={12} />
            {t("app_list_pending")}
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
              activeTab === "history" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
          >
            <ArchiveIcon size={12} />
            {t("app_list_history")}
          </button>
        </div>

        {activeTab === "history" && (
          <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
            {[
              { id: "all", label: t("app_filter_all"), icon: Filter },
              { id: "accepted", label: t("app_filter_accepted"), icon: CheckCircle },
              { id: "rejected", label: t("app_filter_rejected"), icon: XCircle }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setHistoryFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  historyFilter === f.id 
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                <f.icon size={10} />
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-zinc-500 animate-pulse">Loading Applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-950 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-100 dark:border-zinc-800">
            <ArchiveIcon className="text-zinc-300 dark:text-zinc-700" size={32} />
          </div>
          <p className="text-sm font-bold text-zinc-500">No applications found in {activeTab}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {applications.map((app) => (
              <motion.div 
                key={app._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-[2.5rem] shadow-sm relative group hover:shadow-xl transition-all duration-500"
              >
                <div className="absolute top-8 right-8 flex gap-2">
                  {app.status === "pending" ? (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(app._id, "accepted")}
                        className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
                        title="Accept Application"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(app._id, "rejected")}
                        className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
                        title="Reject Application"
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(app._id, "pending")}
                        className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
                        title="Restore to Pending"
                      >
                        <RotateCcw size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(app._id)}
                        className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm"
                        title="Delete Permanently"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-500/20">
                        {app.token}
                      </span>
                      {app.status !== "pending" && (
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          app.status === "accepted" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                            : "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                        }`}>
                          {app.status}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight">{app.name}</h3>
                    <div className="flex flex-wrap gap-4 pt-1">
                      <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                        <Phone size={14} className="text-indigo-500" />
                        {app.phone}
                      </div>
                      {app.email && (
                        <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-medium">
                          <Mail size={14} className="text-indigo-500" />
                          {app.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-zinc-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Project Type:</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-white">{app.workType}</span>
                    </div>
                    <div className="p-5 bg-zinc-50 dark:bg-zinc-950 rounded-3xl border border-zinc-100 dark:border-zinc-800 group-hover:border-indigo-100 dark:group-hover:border-indigo-500/10 transition-colors">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed italic line-clamp-3">
                        &quot;{app.details}&quot;
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                      <Clock size={12} />
                      {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                    <a 
                      href={`https://wa.me/${app.phone.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform group/wa"
                    >
                      Chat on WhatsApp
                      <ExternalLink size={12} className="group-hover/wa:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
