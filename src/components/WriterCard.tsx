"use client";

import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { useTranslation } from "./LanguageProvider";

export function WriterCard({ 
  writer, 
  stats, 
  onEdit,
  onDelete
}: { 
  writer: any; 
  stats?: any; 
  onEdit?: (writer: any) => void;
  onDelete?: (id: string) => void;
}) {
  const { t } = useTranslation();
  
  // writer here might be the stats object or the full writer object depending on usage
  const img = writer.image || writer.imageLink || `https://ui-avatars.com/api/?name=${encodeURIComponent(writer.name || writer._id)}&background=random`;
  const name = writer.name || writer._id || "Unknown Writer";
  
  // Use stats from the prop if provided, otherwise assume they might be on the writer object itself
  const displayStats = stats || writer;

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card p-5 space-y-4 relative group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(99,102,241,0.1)] border-white/5 hover:border-indigo-500/30"
    >
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        {onEdit && (
          <motion.button 
            whileHover={{ scale: 1.2, rotate: 8 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(writer)}
            className="p-2 bg-white/10 hover:bg-indigo-500/20 rounded-xl text-zinc-400 hover:text-indigo-400 backdrop-blur-md transition-colors"
          >
            <Edit size={14} />
          </motion.button>
        )}
        {onDelete && writer._id && (
          <motion.button 
            whileHover={{ scale: 1.2, rotate: -8 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(writer._id)}
            className="p-2 bg-white/10 hover:bg-rose-500/20 rounded-xl text-zinc-400 hover:text-rose-400 backdrop-blur-md transition-colors"
          >
            <Trash2 size={14} />
          </motion.button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <img src={img} className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/20 shadow-lg shadow-indigo-500/10" alt={name} />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base text-zinc-900 dark:text-white line-clamp-1 tracking-tight">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg uppercase tracking-wider">
              {writer.writerId || "N/A"}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
          <p className="text-zinc-500 uppercase font-black tracking-widest text-[8px] mb-1">{t('workload')}</p>
          <p className="text-xl font-black text-indigo-500">{displayStats?.activeWorkload || 0}</p>
        </div>
        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
          <p className="text-zinc-500 uppercase font-black tracking-widest text-[8px] mb-1">{t('pending_pay')}</p>
          <div className="flex flex-col">
            <p className="text-xl font-black text-rose-500">৳{(displayStats?.pendingPayments || 0).toLocaleString()}</p>
            <p className="text-[9px] font-bold text-emerald-500 mt-0.5">
               ৳{(displayStats?.totalEarnings || 0).toLocaleString()} <span className="text-zinc-500 text-[8px] uppercase">Earned</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
