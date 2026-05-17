"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { useTranslation } from "./LanguageProvider";
import { CustomDropdown } from "./CustomDropdown";

export function TaskModal({ 
  isOpen, 
  onClose, 
  task, 
  onSave, 
  clients, 
  writers 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  task?: any; 
  onSave: (data: any) => void;
  clients: any[];
  writers: any[];
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<any>({
    title: "",
    details: "",
    workType: "Assignment",
    deadline: "",
    clientId: "",
    totalValue: 0,
    advancePaid: 0,
    bonus: 0,
    assignedTo: "Unassigned",
    link: "",
    revisions: 0,
    status: "pending"
  });

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ""
      });
    } else {
      setFormData({
        title: "",
        details: "",
        workType: "Assignment",
        deadline: "",
        clientId: "",
        totalValue: 0,
        advancePaid: 0,
        bonus: 0,
        assignedTo: "Unassigned",
        link: "",
        status: "pending"
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? t('modal_task_edit') : t('modal_task_title')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_desc')}</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_details')}</label>
          <textarea 
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
            value={formData.details}
            onChange={(e) => setFormData({...formData, details: e.target.value})}
            placeholder={t('plc_details')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_type')}</label>
            <CustomDropdown 
                options={["Assignment", "Thesis", "Presentation", "Lab Project", "Other"].map(type => ({ value: type, label: type }))}
                value={formData.workType}
                onChange={(val) => setFormData({...formData, workType: val})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_deadline')}</label>
            <div className="relative">
              <input 
                type="date" 
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 outline-none color-scheme-light dark:color-scheme-dark"
                value={formData.deadline}
                onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_client')}</label>
          <CustomDropdown 
            options={clients.map(c => ({ value: c._id, label: `${c.name} (${c.phone})` }))}
            value={formData.clientId}
            onChange={(val) => setFormData({...formData, clientId: val})}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_total')}</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 outline-none"
              value={formData.totalValue}
              onChange={(e) => setFormData({...formData, totalValue: Number(e.target.value)})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_advance')}</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 outline-none"
              value={formData.advancePaid}
              onChange={(e) => setFormData({...formData, advancePaid: Number(e.target.value)})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_bonus')}</label>
            <input 
              type="number" 
              className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 outline-none"
              value={formData.bonus}
              onChange={(e) => setFormData({...formData, bonus: Number(e.target.value)})}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_assign')}</label>
          <CustomDropdown 
            options={[
              { value: "Unassigned", label: "Unassigned" },
              ...writers.map(w => ({ value: w.name, label: w.name }))
            ]}
            value={formData.assignedTo}
            onChange={(val) => setFormData({...formData, assignedTo: val})}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_revisions')}</label>
          <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-2 rounded-xl w-fit">
            <button 
              type="button"
              onClick={() => setFormData({...formData, revisions: Math.max(0, (formData.revisions || 0) - 1)})}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-rose-500 transition-colors shadow-sm"
            >
              -
            </button>
            <span className="text-xl font-bold w-12 text-center text-zinc-900 dark:text-white tabular-nums">
              {formData.revisions || 0}
            </span>
            <button 
              type="button"
              onClick={() => setFormData({...formData, revisions: (formData.revisions || 0) + 1})}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 transition-colors shadow-sm"
            >
              +
            </button>
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl shadow-zinc-500/10"
          >
            {task ? t('btn_update') : t('btn_deploy')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
