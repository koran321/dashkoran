"use client";

import { motion } from "framer-motion";
import { useTranslation } from "./LanguageProvider";

export function WriterCard({ writer, stats }: { writer: any, stats: any }) {
  const { t } = useTranslation();
  
  const img = writer.image || writer.imageLink || `https://ui-avatars.com/api/?name=${encodeURIComponent(writer.name)}&background=random`;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm space-y-4 relative group transition-all hover:shadow-md border-b-4 border-b-transparent hover:border-b-indigo-500"
    >
      <div className="flex items-center gap-3">
        <img src={img} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/20" alt={writer.name} />
        <div className="flex-1">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-1">{writer.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded">
              {writer.writerId || "N/A"}
            </p>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
              ৳{(stats?.totalEarnings || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-xl text-center">
          <p className="text-zinc-500 uppercase font-bold tracking-tighter">{t('workload')}</p>
          <p className="text-lg font-black text-indigo-600">{stats?.activeWorkload || 0}</p>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-xl text-center">
          <p className="text-zinc-500 uppercase font-bold tracking-tighter">{t('pending_pay')}</p>
          <p className="text-lg font-black text-rose-500">৳{(stats?.pendingPayments || 0).toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  );
}
