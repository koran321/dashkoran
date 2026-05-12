"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { useTranslation } from "./LanguageProvider";

export function ClientModal({ 
  isOpen, 
  onClose, 
  client, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  client?: any; 
  onSave: (data: any) => void;
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<any>({
    name: "",
    phone: "",
    email: "",
    university: "",
    program: "",
    subject: "",
    image: ""
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData({
        name: "",
        phone: "",
        email: "",
        university: "",
        program: "",
        subject: "",
        image: ""
      });
    }
  }, [client, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={client ? t('modal_client_edit') : t('modal_client_add')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_w_name')}</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_w_phone')}</label>
          <input 
            type="tel" 
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_university')}</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 outline-none"
            value={formData.university}
            onChange={(e) => setFormData({...formData, university: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_program')}</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 outline-none"
              value={formData.program}
              onChange={(e) => setFormData({...formData, program: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_subject')}</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 outline-none"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl shadow-zinc-500/10"
          >
            {client ? t('btn_update') : t('btn_save_client')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
