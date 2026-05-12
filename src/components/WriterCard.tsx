"use client";

import { motion } from "framer-motion";
import { Edit } from "lucide-react";
import { useTranslation } from "./LanguageProvider";

export function WriterCard({ 
  writer, 
  stats, 
  onEdit 
}: { 
  writer: any; 
  stats?: any; 
  onEdit?: (writer: any) => void;
}) {
  const { t } = useTranslation();
  
  // writer here might be the stats object or the full writer object depending on usage
  const img = writer.image || writer.imageLink || `https://ui-avatars.com/api/?name=${encodeURIComponent(writer.name || writer._id)}&background=random`;
  const name = writer.name || writer._id || "Unknown Writer";
  
  // Use stats from the prop if provided, otherwise assume they might be on the writer object itself
  const displayStats = stats || writer;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl shadow-sm space-y-4 relative group transition-all hover:shadow-md border-b-4 border-b-transparent hover:border-b-indigo-500"
    >
      {onEdit && (
        <button 
          onClick={() => onEdit(writer)}
          className="absolute top-2 right-2 p-1.5 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-zinc-400 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all"
        >
          <Edit size={14} />
        </button>
      )}

      <div className="flex items-center gap-3">
        <img src={img} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/20" alt={name} />
        <div className="flex-1">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-1">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded">
              {writer.writerId || "N/A"}
            </p>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded">
              ৳{(displayStats?.totalEarnings || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-xl text-center">
          <p className="text-zinc-500 uppercase font-bold tracking-tighter">{t('workload')}</p>
          <p className="text-lg font-black text-indigo-600">{displayStats?.activeWorkload || 0}</p>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-xl text-center">
          <p className="text-zinc-500 uppercase font-bold tracking-tighter">{t('pending_pay')}</p>
          <p className="text-lg font-black text-rose-500">৳{(displayStats?.pendingPayments || 0).toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  );
}
