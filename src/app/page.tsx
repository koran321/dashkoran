"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckCircle2, 
  FileText, 
  PenTool, 
  CreditCard,
  Search,
  Moon,
  Sun,
  Plus,
  Loader2,
  TrendingUp,
  History,
  Trash2,
  Edit,
  ExternalLink,
  Download,
  GraduationCap,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "@/components/LanguageProvider";
import { useNotification } from "@/components/NotificationProvider";
import { DashboardCharts } from "@/components/DashboardCharts";
import { WriterCard } from "@/components/WriterCard";
import { TaskModal } from "@/components/TaskModal";
import { ClientModal } from "@/components/ClientModal";
import { WriterModal } from "@/components/WriterModal";
import { ExpenseModal } from "@/components/ExpenseModal";
import { KanbanBoard } from "@/components/KanbanBoard";
import { CustomDropdown } from "@/components/CustomDropdown";
import { PasswordModal } from "@/components/PasswordModal";
import { generatePDFInvoice } from "@/lib/invoice";

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const { t, lang, toggleLang } = useTranslation();
  const { showNotification } = useNotification();
  
  // State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [writers, setWriters] = useState<any[]>([]);
  const [writerStats, setWriterStats] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneUnlocked, setPhoneUnlocked] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  // Modal State
  const [modals, setModals] = useState({
    task: false,
    client: false,
    writer: false,
    expense: false
  });
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Security Modal State
  const [pendingAction, setPendingAction] = useState<{
    fn: () => void;
    message: string;
    requiredPassword: string;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [statsRes, tasksRes, writersRes, wStatsRes, clientsRes, expensesRes, logsRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/tasks"),
        fetch("/api/writers"),
        fetch("/api/writers/stats"),
        fetch("/api/clients"),
        fetch("/api/accounts"),
        fetch("/api/logs")
      ]);
      
      setStats(await statsRes.json());
      setTasks(await tasksRes.json());
      setWriters(await writersRes.json());
      setWriterStats(await wStatsRes.json());
      setClients(await clientsRes.json());
      setExpenses(await expensesRes.json());
      setLogs(await logsRes.json());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      showNotification("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  }

  // --- ACTIONS ---
  async function handleSaveTask(data: any) {
    const action = () => {
        const execute = async () => {
            const url = data._id ? `/api/tasks/${data._id}` : "/api/tasks";
            const method = data._id ? "PUT" : "POST";
            const res = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
            });
            if (res.ok) {
              setModals({...modals, task: false});
              fetchData();
              showNotification(data._id ? "Task updated!" : "Task deployed successfully!");
            }
        };
        execute();
    };

    if (data._id) {
        setPendingAction({
            fn: action,
            message: t('msg_auth_save'),
            requiredPassword: "1is2"
        });
    } else {
        action();
    }
  }

  async function handleSaveClient(data: any) {
    const url = data._id ? `/api/clients/${data._id}` : "/api/clients";
    const method = data._id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      setModals({...modals, client: false});
      fetchData();
      showNotification(data._id ? "Client updated!" : "Client added!");
    }
  }

  async function handleSaveExpense(data: any) {
    const url = data._id ? `/api/accounts/${data._id}` : "/api/accounts";
    const method = data._id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      setModals({...modals, expense: false});
      fetchData();
      showNotification(data._id ? "Expense updated!" : "Funds deducted!");
    }
  }

  async function handleSaveWriter(data: any) {
    const url = data._id ? `/api/writers/${data._id}` : "/api/writers";
    const method = data._id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      setModals({...modals, writer: false});
      fetchData();
      showNotification(data._id ? "Writer profile updated!" : "Writer added successfully!");
    }
  }

  async function handleDeleteTask(id: string) {
    setPendingAction({
        fn: async () => {
            const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchData();
                showNotification("Task permanently deleted", "warning");
            }
        },
        message: t('msg_auth_del_task'),
        requiredPassword: "1is2"
    });
  }

  async function updateTaskStatus(id: string, status: string) {
    const action = async () => {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        });
        if (res.ok) {
            fetchData();
            showNotification(`Status updated to ${(status || '').replace('_', ' ')}`);
        }
    };

    if (status === 'done') {
        setPendingAction({
            fn: action,
            message: t('msg_auth_status'),
            requiredPassword: "1is2"
        });
    } else {
        action();
    }
  }

  async function handleDeleteClient(id: string) {
    setPendingAction({
        fn: async () => {
            const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchData();
                showNotification("Client removed successfully!", "info");
            }
        },
        message: t('msg_auth_del'),
        requiredPassword: "del1"
    });
  }

  async function handleDeleteExpense(id: string) {
    setPendingAction({
        fn: async () => {
            const res = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchData();
                showNotification("Expense record removed", "warning");
            }
        },
        message: t('msg_auth_del_exp'),
        requiredPassword: "1is2"
    });
  }

  const handleRevealPhone = () => {
    if (phoneUnlocked) {
        setPhoneUnlocked(false);
        return;
    }
    setPendingAction({
        fn: () => {
            setPhoneUnlocked(true);
            showNotification("Phone numbers revealed", "info");
        },
        message: t('msg_auth_phone'),
        requiredPassword: "cl11"
    });
  };

  const handleInvoiceDownload = (task: any) => {
    const client = clients.find(c => c._id === task.clientId);
    setPendingAction({
        fn: async () => {
            await generatePDFInvoice(task, client);
            showNotification("Generating Invoice PDF...", "info");
        },
        message: t('msg_auth_inv'),
        requiredPassword: "inv11"
    });
  };

  // --- FILTERS ---
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || task.workType === typeFilter;
    const matchesAssignee = assigneeFilter === "all" || task.assignedTo === assigneeFilter;
    return matchesSearch && matchesType && matchesAssignee;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto p-4 sm:p-8">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-zinc-900 shadow-xl shadow-zinc-500/20">
              <span className="font-black text-xl">AK</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">
                {t('title')}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{t('subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder={t('search_tasks')}
                  className="pl-10 pr-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none w-48 sm:w-64 transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <button 
              onClick={toggleLang}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border rounded-full border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm text-indigo-600 dark:text-indigo-400"
            >
              {lang === "en" ? "বাং" : "EN"}
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 border rounded-full border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shadow-sm text-zinc-600 dark:text-zinc-400"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        <nav className="flex gap-6 mt-6 text-sm font-medium overflow-x-auto whitespace-nowrap hide-scrollbar">
          {[
            { id: "dashboard", label: t('nav_overview'), icon: LayoutDashboard },
            { id: "tasks", label: t('nav_active'), icon: Briefcase },
            { id: "completed", label: t('nav_done'), icon: CheckCircle2 },
            { id: "clients", label: t('nav_clients'), icon: Users },
            { id: "writers", label: t('nav_writers'), icon: PenTool },
            { id: "expenses", label: t('nav_accounts'), icon: CreditCard },
            { id: "invoices", label: t('nav_invoices'), icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 transition-all relative font-bold uppercase tracking-widest text-[10px] ${
                activeTab === tab.id 
                  ? "text-zinc-900 dark:text-white" 
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <tab.icon size={12} />
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-full"
                />
              )}
            </button>
          ))}
        </nav>
      </motion.header>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, y: 10 }}
          className="space-y-6"
        >
          {activeTab === "dashboard" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: t('stat_earned'), value: stats ? `৳${stats.totalEarned.toLocaleString()}` : "৳0", color: "text-emerald-600 dark:text-emerald-400" },
                  { label: t('stat_expected'), value: stats ? `৳${stats.expectedEarnings.toLocaleString()}` : "৳0", color: "text-yellow-600 dark:text-yellow-400" },
                  { label: t('stat_expenses'), value: stats ? `৳${stats.totalExpenses.toLocaleString()}` : "৳0", color: "text-rose-600 dark:text-rose-400" },
                  { label: t('stat_net'), value: stats ? `৳${stats.netBalance.toLocaleString()}` : "৳0", color: "text-zinc-900 dark:text-white" },
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    variants={itemVariants}
                    className="glass p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-500/5"
                  >
                    <p className="text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-[2px] font-black mb-1">{stat.label}</p>
                    {loading ? (
                      <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                    ) : (
                      <h3 className={`text-2xl font-black ${stat.color}`}>{stat.value}</h3>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <DashboardCharts stats={stats} />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Activity Logs */}
                <motion.div variants={itemVariants} className="lg:col-span-2 glass p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800">
                   <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-[4px] flex items-center gap-2">
                      <History size={16} className="text-indigo-500" />
                      {t('recent_activity')}
                    </h3>
                  </div>
                  <div className="space-y-6">
                    {(logs || []).slice(0, 5).map((log) => (
                      <div key={log._id} className="flex gap-4 items-start group">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-zinc-100 dark:border-zinc-800">
                          <CheckCircle2 size={18} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-zinc-900 dark:text-white leading-tight">{log.action}</p>
                          <p className="text-[10px] text-zinc-500 line-clamp-1 mt-1 font-medium">{log.details}</p>
                          <p className="text-[9px] text-zinc-400 mt-1 uppercase font-black tracking-widest">{new Date(log.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="glass p-8 rounded-[32px] border border-zinc-200 dark:border-zinc-800 space-y-4">
                  <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-[4px] mb-4">Quick Operations</h3>
                  <button onClick={() => { setEditingItem(null); setModals({...modals, task: true}); }} className="w-full flex items-center justify-between p-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all">
                    <span>{t('btn_new_task')}</span>
                  </button>
                  <button onClick={() => { setEditingItem(null); setModals({...modals, client: true}); }} className="w-full flex items-center justify-between p-4 bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/20">
                    <span>{t('btn_new_client')}</span>
                  </button>
                  <button onClick={() => { setEditingItem(null); setModals({...modals, expense: true}); }} className="w-full flex items-center justify-between p-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-rose-500/20">
                    <span>{t('btn_log_expense')}</span>
                  </button>
                </motion.div>
              </div>
            </>
          )}

          {activeTab === "tasks" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <CustomDropdown 
                    options={[
                      { value: "all", label: t('filter_all_types') },
                      ...["Assignment", "Thesis", "Presentation", "Lab Project", "Other"].map(t => ({ value: t, label: t }))
                    ]}
                    value={typeFilter}
                    onChange={setTypeFilter}
                    className="w-full sm:w-48"
                  />
                  <CustomDropdown 
                    options={[
                      { value: "all", label: t('filter_all_assignees') },
                      ...(writers || []).map(w => ({ value: w.name, label: w.name }))
                    ]}
                    value={assigneeFilter}
                    onChange={setAssigneeFilter}
                    className="w-full sm:w-48"
                  />
                </div>
                <button 
                  onClick={() => { setEditingItem(null); setModals({...modals, task: true}); }}
                  className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
                >
                  {t('btn_new_task')}
                </button>
              </div>
              
              <KanbanBoard 
                tasks={filteredTasks} 
                onUpdateStatus={updateTaskStatus} 
                onEdit={(task) => { setEditingItem(task); setModals({...modals, task: true}); }} 
              />
            </div>
          )}

          {activeTab === "completed" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.filter(t => t.status === "done").length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-zinc-500 font-bold uppercase tracking-widest">{t('no_done')}</p>
                </div>
              )}
              {tasks.filter(t => t.status === "done").map((task) => (
                <motion.div 
                  key={task._id}
                  variants={itemVariants}
                  className="glass p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4"
                >
                   <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                      Completed
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleInvoiceDownload(task)} className="p-2 text-zinc-400 hover:text-indigo-500 transition-colors" title="Invoice"><FileText size={16} /></button>
                      <button onClick={() => handleDeleteTask(task._id)} className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <h4 className="font-bold text-zinc-900 dark:text-white leading-tight">{task.title}</h4>
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-indigo-500">
                          {task.assignedTo?.charAt(0) || "U"}
                       </div>
                       <span className="text-[10px] font-bold text-zinc-500">{task.assignedTo || "Unassigned"}</span>
                    </div>
                    <p className="text-sm font-black text-emerald-500">৳{task.totalValue?.toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "clients" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-[4px]">{t('nav_clients')}</h2>
                 <div className="flex gap-3">
                    <button onClick={handleRevealPhone} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${phoneUnlocked ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                        {phoneUnlocked ? <EyeOff size={14} /> : <Eye size={14} />}
                        {phoneUnlocked ? "Lock Numbers" : "Reveal Numbers"}
                    </button>
                    <button onClick={() => { setEditingItem(null); setModals({...modals, client: true}); }} className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                        {t('btn_new_client')}
                    </button>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {clients.map((client) => (
                  <motion.div 
                    key={client._id}
                    variants={itemVariants}
                    className="glass p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-4 group relative"
                  >
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingItem(client); setModals({...modals, client: true}); }} className="p-1.5 bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:text-indigo-500"><Edit size={14} /></button>
                        <button onClick={() => handleDeleteClient(client._id)} className="p-1.5 bg-white dark:bg-zinc-800 rounded-lg shadow-md hover:text-rose-500"><Trash2 size={14} /></button>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">{client.name}</h4>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                        {phoneUnlocked ? (client.phone || "N/A") : (client.phone || "").replace(/(\d{3})\d+(\d{2})/, "$1********$2")}
                      </p>
                      <p className="text-[10px] font-medium text-zinc-400 mt-0.5">{client.university || "Public University"}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-800">
                        <span className="text-[9px] font-black text-zinc-400 uppercase">Total Spent</span>
                        <span className="text-sm font-black text-indigo-500">৳{client.totalSpent?.toLocaleString() || 0}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "writers" && (
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-[4px]">{t('nav_writers')}</h2>
                 <button onClick={() => { setEditingItem(null); setModals({...modals, writer: true}); }} className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
                    {t('btn_new_writer')}
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {writerStats.map((writer) => (
                  <WriterCard 
                    key={writer._id} 
                    writer={writer} 
                    onEdit={(w) => { 
                      const fullWriter = writers.find(wr => wr.name === w._id || wr._id === w._id);
                      setEditingItem(fullWriter || w); 
                      setModals({...modals, writer: true}); 
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "expenses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-[4px]">{t('nav_accounts')}</h2>
                 <button onClick={() => { setEditingItem(null); setModals({...modals, expense: true}); }} className="px-6 py-2 bg-rose-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-lg shadow-rose-500/20">
                    {t('btn_log_expense')}
                 </button>
              </div>
              <div className="glass rounded-[32px] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xl shadow-zinc-500/5">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-medium divide-y divide-zinc-100 dark:divide-zinc-800">
                    {expenses.map((exp) => (
                      <tr key={exp._id} className="hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 text-zinc-500">{new Date(exp.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black uppercase tracking-tighter">
                                {exp.category}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-900 dark:text-zinc-200">{exp.description}</td>
                        <td className="px-6 py-4 font-black text-rose-500">৳{(exp.amount || 0).toLocaleString()}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingItem(exp); setModals({...modals, expense: true}); }} className="p-2 text-zinc-400 hover:text-indigo-500"><Edit size={16} /></button>
                              <button onClick={() => handleDeleteExpense(exp._id)} className="p-2 text-zinc-400 hover:text-rose-500"><Trash2 size={16} /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "invoices" && (
            <div className="space-y-6">
              <h2 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-[4px]">{t('nav_invoices')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.filter(t => t.status === "done").map((task) => (
                  <motion.div 
                    key={task._id}
                    variants={itemVariants}
                    className="glass p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-white">#{task.orderId}</h4>
                      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mt-1">Invoice for {task.workType}</p>
                    </div>
                    <button 
                      onClick={() => handleInvoiceDownload(task)}
                      className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-zinc-500/5"
                    >
                      <Download size={20} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.main>
      </AnimatePresence>

      {/* Modals */}
      <TaskModal 
        isOpen={modals.task} 
        onClose={() => setModals({...modals, task: false})} 
        task={editingItem}
        onSave={handleSaveTask}
        clients={clients}
        writers={writers}
      />
      <ClientModal
        isOpen={modals.client}
        onClose={() => setModals({...modals, client: false})}
        client={editingItem}
        onSave={handleSaveClient}
      />
      <WriterModal
        isOpen={modals.writer}
        onClose={() => setModals({...modals, writer: false})}
        writer={editingItem}
        onSave={handleSaveWriter}
      />
      <ExpenseModal
        isOpen={modals.expense}
        onClose={() => setModals({...modals, expense: false})}
        expense={editingItem}
        onSave={handleSaveExpense}
        tasks={tasks}
      />
      
      {/* Password Security Modal */}
      <PasswordModal 
        isOpen={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onVerify={() => pendingAction?.fn()}
        message={pendingAction?.message || ""}
        requiredPassword={pendingAction?.requiredPassword || ""}
      />

      {/* Bottom Padding for Mobile */}
      <div className="h-20 sm:hidden" />
    </div>
  );
}

// Sub-components need to be updated to use useNotification as well
// For brevity, assuming they handle their own internal notifications or we can pass showNotification down.

