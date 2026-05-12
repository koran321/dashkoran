"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { useTranslation } from "./LanguageProvider";
import { CustomDropdown } from "./CustomDropdown";

export function ExpenseModal({ 
  isOpen, 
  onClose, 
  expense, 
  onSave,
  tasks
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  expense?: any; 
  onSave: (data: any) => void;
  tasks: any[];
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<any>({
    category: "Others",
    description: "",
    amount: 0,
    taskId: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        ...expense,
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        category: "Others",
        description: "",
        amount: 0,
        taskId: "",
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [expense, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={expense ? t('modal_exp_edit') : t('modal_exp_title')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_exp_cat')}</label>
          <CustomDropdown 
            options={["Facebook Ads", "Supplements", "Withdraws", "Others"].map(cat => ({ value: cat, label: cat }))}
            value={formData.category}
            onChange={(val) => setFormData({...formData, category: val})}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_exp_desc')}</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_exp_amount')}</label>
          <input 
            type="number" 
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_rel_task')}</label>
          <CustomDropdown 
            options={[
                { value: "", label: t('opt_no_task') },
                ...tasks.map(tk => ({ value: tk._id, label: `#${tk.orderId} - ${tk.title}` }))
            ]}
            value={formData.taskId}
            onChange={(val) => setFormData({...formData, taskId: val})}
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl shadow-zinc-500/10"
          >
            {expense ? t('btn_update') : t('btn_deduct')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
