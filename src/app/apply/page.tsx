"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  CheckCircle2, 
  Download, 
  ArrowRight, 
  MessageCircle, 
  Facebook, 
  Phone,
  ClipboardList,
  Sparkles,
  ChevronDown,
  Clock,
  ShieldCheck,
  Languages,
  Moon,
  Sun,
  Loader2
} from "lucide-react";
import { useTranslation } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ApplyPage() {
  const { lang, toggleLang, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    workType: "Assignment",
    details: "",
    savePdf: true
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [appToken, setAppToken] = useState("");

  const workTypes = ["Thesis", "Presentation", "Lab Project", "Assignment", "Others"];

  const generatePDF = (token: string, data: typeof formData) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(79, 70, 229); // Indigo-600
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("ASSIGNMENT KORAN", 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text("APPLICATION RECEIPT", 105, 30, { align: 'center' });

    // Content
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(12);
    
    const tableData = [
      ["Token ID", token],
      ["Applicant Name", data.name],
      ["Phone (WhatsApp)", data.phone],
      ["Email", data.email || "N/A"],
      ["Work Type", data.workType],
      ["Date Applied", new Date().toLocaleDateString()],
      ["Status", "Pending Review"]
    ];

    autoTable(doc, {
      startY: 50,
      head: [['Field', 'Information']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });

    // Details Section
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Work Details:", 14, finalY);
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(data.details, 180);
    doc.text(splitText, 14, finalY + 7);

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const pageHeight = doc.internal.pageSize.height;
    doc.text("Contact us: +8801875191553 | fb.com/assignmentkoran", 105, pageHeight - 20, { align: 'center' });
    doc.text("Our coordinator will contact you shortly.", 105, pageHeight - 15, { align: 'center' });

    doc.save(`AK-APP-${token}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        setAppToken(data.token);
        if (formData.savePdf) {
          generatePDF(data.token, formData);
        }
        setSuccess(true);
      }
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-8 flex flex-col items-center font-satoshi transition-colors duration-300">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Header & Controls */}
      <div className="w-full max-w-2xl flex flex-col items-center mb-12 relative z-10">
        <div className="w-full flex justify-end gap-2 mb-8">
          <button 
            onClick={toggleLang}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 transition-colors shadow-sm"
          >
            <Languages size={18} />
          </button>
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 transition-colors shadow-sm"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-4">
            <Sparkles size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase">{t("app_title")}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase leading-none mb-2">
            Assignment Koran
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium tracking-wide uppercase text-[10px]">
            Academic Excellence Service
          </p>
        </motion.div>
      </div>

      <motion.div 
        layout
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight">
                  {t("apply_form_title")}
                </h2>
                <p className="text-sm text-zinc-500 font-medium">
                  {t("apply_form_desc")}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{t("lbl_full_name")} *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe"
                      className="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{t("lbl_whatsapp")} *</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+8801XXXXXXXXX"
                      className="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{t("lbl_email_opt")}</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@example.com"
                      className="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{t("lbl_work_type")} *</label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.workType}
                        onChange={(e) => setFormData({...formData, workType: e.target.value})}
                        className="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all text-zinc-900 dark:text-white"
                      >
                        {workTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">{t("lbl_work_details")} *</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                    placeholder={t("plc_work_details")}
                    className="w-full px-5 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-zinc-900 dark:text-white resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 px-1">
                  <input 
                    type="checkbox" 
                    id="savePdf"
                    checked={formData.savePdf}
                    onChange={(e) => setFormData({...formData, savePdf: e.target.checked})}
                    className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="savePdf" className="text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
                    {t("lbl_save_pdf")}
                  </label>
                </div>

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      {t("btn_submit_app")}
                      <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 py-4"
            >
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
                  {t("msg_app_received")}
                </h2>
                <p className="text-sm text-zinc-500 font-medium max-w-xs mx-auto">
                  {t("msg_app_desc")}
                </p>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2rem] space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{t("lbl_unique_token")}</p>
                <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-widest uppercase">
                  {appToken}
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{t("lbl_quick_contact")}</p>
                <div className="flex justify-center gap-4">
                  <a 
                    href="https://wa.me/8801875191553" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20 font-bold text-sm"
                  >
                    <MessageCircle size={18} />
                    WhatsApp
                  </a>
                  <a 
                    href="https://facebook.com/assignmentkoran" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/20 font-bold text-sm"
                  >
                    <Facebook size={18} />
                    Facebook
                  </a>
                </div>
              </div>

              <button 
                onClick={() => setSuccess(false)}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-indigo-500 transition-colors"
              >
                {t("btn_submit_another")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer Info */}
      <div className="mt-12 flex flex-col items-center gap-6 text-center">
        <div className="flex gap-8">
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
              <Phone size={18} />
            </div>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">+8801875191553</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
              <ShieldCheck size={18} />
            </div>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">{t("lbl_verified_service")}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400">
              <Clock size={18} />
            </div>
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">{t("lbl_support_247")}</span>
          </div>
        </div>
        <p className="text-[10px] font-medium text-zinc-400 max-w-xs">
          {t("lbl_terms_msg")}
        </p>
      </div>

      <style jsx global>{`
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap');
        .font-satoshi { font-family: 'Satoshi', sans-serif; }
      `}</style>
    </div>
  );
}
