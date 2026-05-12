"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { useTranslation } from "./LanguageProvider";

export function WriterModal({ 
  isOpen, 
  onClose, 
  writer, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  writer?: any; 
  onSave: (data: any) => void;
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<any>({
    name: "",
    phone: "",
    email: "",
    writerId: "",
    image: "",
    imageLink: "",
    dob: "",
    nid: ""
  });

  useEffect(() => {
    if (writer) {
      setFormData(writer);
    } else if (isOpen) {
      const newId = `WRT-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`;
      setFormData({
        name: "",
        phone: "",
        email: "",
        writerId: newId,
        image: "",
        imageLink: "",
        dob: "",
        nid: ""
      });
    }
  }, [writer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={writer ? t('modal_writer_edit') : t('modal_writer_add')}>
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_w_phone')}</label>
            <input 
              type="tel" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 outline-none"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Writer ID</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 outline-none"
              value={formData.writerId}
              onChange={(e) => setFormData({...formData, writerId: e.target.value})}
              placeholder="e.g. WRT-123"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_w_email')}</label>
          <input 
            type="email" 
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 outline-none"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t('lbl_w_image')}</label>
          <input 
            type="url" 
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 outline-none"
            value={formData.image || formData.imageLink}
            onChange={(e) => setFormData({...formData, imageLink: e.target.value, image: e.target.value})}
            placeholder="https://..."
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl shadow-zinc-500/10"
          >
            {writer ? t('btn_update') : t('btn_save_writer')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
