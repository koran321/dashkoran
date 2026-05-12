"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { useTranslation } from "./LanguageProvider";
import { CustomDropdown } from "./CustomDropdown";

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
    country: "",
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
        country: "",
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
            <CustomDropdown 
              options={[
                { value: "BSc", label: "BSc / Undergraduate" },
                { value: "MSc", label: "MSc / Graduate" },
                { value: "PhD", label: "PhD" },
                { value: "Diploma", label: "Diploma" },
                { value: "Other", label: "Other" }
              ]}
              value={formData.program || "BSc"}
              onChange={(val) => setFormData({...formData, program: val})}
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

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Country</label>
          <CustomDropdown 
            searchable={true}
            options={[
              { value: "Afghanistan", label: "Afghanistan" },
              { value: "Albania", label: "Albania" },
              { value: "Algeria", label: "Algeria" },
              { value: "Andorra", label: "Andorra" },
              { value: "Angola", label: "Angola" },
              { value: "Antigua and Barbuda", label: "Antigua and Barbuda" },
              { value: "Argentina", label: "Argentina" },
              { value: "Armenia", label: "Armenia" },
              { value: "Australia", label: "Australia" },
              { value: "Austria", label: "Austria" },
              { value: "Azerbaijan", label: "Azerbaijan" },
              { value: "Bahamas", label: "Bahamas" },
              { value: "Bahrain", label: "Bahrain" },
              { value: "Bangladesh", label: "Bangladesh" },
              { value: "Barbados", label: "Barbados" },
              { value: "Belarus", label: "Belarus" },
              { value: "Belgium", label: "Belgium" },
              { value: "Belize", label: "Belize" },
              { value: "Benin", label: "Benin" },
              { value: "Bhutan", label: "Bhutan" },
              { value: "Bolivia", label: "Bolivia" },
              { value: "Bosnia and Herzegovina", label: "Bosnia and Herzegovina" },
              { value: "Botswana", label: "Botswana" },
              { value: "Brazil", label: "Brazil" },
              { value: "Brunei", label: "Brunei" },
              { value: "Bulgaria", label: "Bulgaria" },
              { value: "Burkina Faso", label: "Burkina Faso" },
              { value: "Burundi", label: "Burundi" },
              { value: "Cabo Verde", label: "Cabo Verde" },
              { value: "Cambodia", label: "Cambodia" },
              { value: "Cameroon", label: "Cameroon" },
              { value: "Canada", label: "Canada" },
              { value: "Central African Republic", label: "Central African Republic" },
              { value: "Chad", label: "Chad" },
              { value: "Chile", label: "Chile" },
              { value: "China", label: "China" },
              { value: "Colombia", label: "Colombia" },
              { value: "Comoros", label: "Comoros" },
              { value: "Congo", label: "Congo" },
              { value: "Costa Rica", label: "Costa Rica" },
              { value: "Croatia", label: "Croatia" },
              { value: "Cuba", label: "Cuba" },
              { value: "Cyprus", label: "Cyprus" },
              { value: "Czech Republic", label: "Czech Republic" },
              { value: "Denmark", label: "Denmark" },
              { value: "Djibouti", label: "Djibouti" },
              { value: "Dominica", label: "Dominica" },
              { value: "Dominican Republic", label: "Dominican Republic" },
              { value: "Ecuador", label: "Ecuador" },
              { value: "Egypt", label: "Egypt" },
              { value: "El Salvador", label: "El Salvador" },
              { value: "Equatorial Guinea", label: "Equatorial Guinea" },
              { value: "Eritrea", label: "Eritrea" },
              { value: "Estonia", label: "Estonia" },
              { value: "Eswatini", label: "Eswatini" },
              { value: "Ethiopia", label: "Ethiopia" },
              { value: "Fiji", label: "Fiji" },
              { value: "Finland", label: "Finland" },
              { value: "France", label: "France" },
              { value: "Gabon", label: "Gabon" },
              { value: "Gambia", label: "Gambia" },
              { value: "Georgia", label: "Georgia" },
              { value: "Germany", label: "Germany" },
              { value: "Ghana", label: "Ghana" },
              { value: "Greece", label: "Greece" },
              { value: "Grenada", label: "Grenada" },
              { value: "Guatemala", label: "Guatemala" },
              { value: "Guinea", label: "Guinea" },
              { value: "Guinea-Bissau", label: "Guinea-Bissau" },
              { value: "Guyana", label: "Guyana" },
              { value: "Haiti", label: "Haiti" },
              { value: "Honduras", label: "Honduras" },
              { value: "Hungary", label: "Hungary" },
              { value: "Iceland", label: "Iceland" },
              { value: "India", label: "India" },
              { value: "Indonesia", label: "Indonesia" },
              { value: "Iran", label: "Iran" },
              { value: "Iraq", label: "Iraq" },
              { value: "Ireland", label: "Ireland" },
              { value: "Israel", label: "Israel" },
              { value: "Italy", label: "Italy" },
              { value: "Jamaica", label: "Jamaica" },
              { value: "Japan", label: "Japan" },
              { value: "Jordan", label: "Jordan" },
              { value: "Kazakhstan", label: "Kazakhstan" },
              { value: "Kenya", label: "Kenya" },
              { value: "Kiribati", label: "Kiribati" },
              { value: "Korea, North", label: "Korea, North" },
              { value: "Korea, South", label: "Korea, South" },
              { value: "Kosovo", label: "Kosovo" },
              { value: "Kuwait", label: "Kuwait" },
              { value: "Kyrgyzstan", label: "Kyrgyzstan" },
              { value: "Laos", label: "Laos" },
              { value: "Latvia", label: "Latvia" },
              { value: "Lebanon", label: "Lebanon" },
              { value: "Lesotho", label: "Lesotho" },
              { value: "Liberia", label: "Liberia" },
              { value: "Libya", label: "Libya" },
              { value: "Liechtenstein", label: "Liechtenstein" },
              { value: "Lithuania", label: "Lithuania" },
              { value: "Luxembourg", label: "Luxembourg" },
              { value: "Madagascar", label: "Madagascar" },
              { value: "Malawi", label: "Malawi" },
              { value: "Malaysia", label: "Malaysia" },
              { value: "Maldives", label: "Maldives" },
              { value: "Mali", label: "Mali" },
              { value: "Malta", label: "Malta" },
              { value: "Marshall Islands", label: "Marshall Islands" },
              { value: "Mauritania", label: "Mauritania" },
              { value: "Mauritius", label: "Mauritius" },
              { value: "Mexico", label: "Mexico" },
              { value: "Micronesia", label: "Micronesia" },
              { value: "Moldova", label: "Moldova" },
              { value: "Monaco", label: "Monaco" },
              { value: "Mongolia", label: "Mongolia" },
              { value: "Montenegro", label: "Montenegro" },
              { value: "Morocco", label: "Morocco" },
              { value: "Mozambique", label: "Mozambique" },
              { value: "Myanmar", label: "Myanmar" },
              { value: "Namibia", label: "Namibia" },
              { value: "Nauru", label: "Nauru" },
              { value: "Nepal", label: "Nepal" },
              { value: "Netherlands", label: "Netherlands" },
              { value: "New Zealand", label: "New Zealand" },
              { value: "Nicaragua", label: "Nicaragua" },
              { value: "Niger", label: "Niger" },
              { value: "Nigeria", label: "Nigeria" },
              { value: "North Macedonia", label: "North Macedonia" },
              { value: "Norway", label: "Norway" },
              { value: "Oman", label: "Oman" },
              { value: "Pakistan", label: "Pakistan" },
              { value: "Palau", label: "Palau" },
              { value: "Palestine", label: "Palestine" },
              { value: "Panama", label: "Panama" },
              { value: "Papua New Guinea", label: "Papua New Guinea" },
              { value: "Paraguay", label: "Paraguay" },
              { value: "Peru", label: "Peru" },
              { value: "Philippines", label: "Philippines" },
              { value: "Poland", label: "Poland" },
              { value: "Portugal", label: "Portugal" },
              { value: "Qatar", label: "Qatar" },
              { value: "Romania", label: "Romania" },
              { value: "Russia", label: "Russia" },
              { value: "Rwanda", label: "Rwanda" },
              { value: "Saint Kitts and Nevis", label: "Saint Kitts and Nevis" },
              { value: "Saint Lucia", label: "Saint Lucia" },
              { value: "Saint Vincent and the Grenadines", label: "Saint Vincent and the Grenadines" },
              { value: "Samoa", label: "Samoa" },
              { value: "San Marino", label: "San Marino" },
              { value: "Sao Tome and Principe", label: "Sao Tome and Principe" },
              { value: "Saudi Arabia", label: "Saudi Arabia" },
              { value: "Senegal", label: "Senegal" },
              { value: "Serbia", label: "Serbia" },
              { value: "Seychelles", label: "Seychelles" },
              { value: "Sierra Leone", label: "Sierra Leone" },
              { value: "Singapore", label: "Singapore" },
              { value: "Slovakia", label: "Slovakia" },
              { value: "Slovenia", label: "Slovenia" },
              { value: "Solomon Islands", label: "Solomon Islands" },
              { value: "Somalia", label: "Somalia" },
              { value: "South Africa", label: "South Africa" },
              { value: "South Sudan", label: "South Sudan" },
              { value: "Spain", label: "Spain" },
              { value: "Sri Lanka", label: "Sri Lanka" },
              { value: "Sudan", label: "Sudan" },
              { value: "Suriname", label: "Suriname" },
              { value: "Sweden", label: "Sweden" },
              { value: "Switzerland", label: "Switzerland" },
              { value: "Syria", label: "Syria" },
              { value: "Taiwan", label: "Taiwan" },
              { value: "Tajikistan", label: "Tajikistan" },
              { value: "Tanzania", label: "Tanzania" },
              { value: "Thailand", label: "Thailand" },
              { value: "Timor-Leste", label: "Timor-Leste" },
              { value: "Togo", label: "Togo" },
              { value: "Tonga", label: "Tonga" },
              { value: "Trinidad and Tobago", label: "Trinidad and Tobago" },
              { value: "Tunisia", label: "Tunisia" },
              { value: "Turkey", label: "Turkey" },
              { value: "Turkmenistan", label: "Turkmenistan" },
              { value: "Tuvalu", label: "Tuvalu" },
              { value: "Uganda", label: "Uganda" },
              { value: "Ukraine", label: "Ukraine" },
              { value: "United Arab Emirates", label: "United Arab Emirates" },
              { value: "United Kingdom", label: "United Kingdom" },
              { value: "United States", label: "United States" },
              { value: "Uruguay", label: "Uruguay" },
              { value: "Uzbekistan", label: "Uzbekistan" },
              { value: "Vanuatu", label: "Vanuatu" },
              { value: "Vatican City", label: "Vatican City" },
              { value: "Venezuela", label: "Venezuela" },
              { value: "Vietnam", label: "Vietnam" },
              { value: "Yemen", label: "Yemen" },
              { value: "Zambia", label: "Zambia" },
              { value: "Zimbabwe", label: "Zimbabwe" },
              { value: "Other", label: "Other" }
            ]}
            value={formData.country || "Bangladesh"}
            onChange={(val) => setFormData({...formData, country: val})}
          />
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
