"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Edit, 
  GraduationCap, 
  Clock, 
  GripVertical 
} from "lucide-react";
import { useTranslation } from "./LanguageProvider";
import { useNotification } from "./NotificationProvider";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from "@hello-pangea/dnd";
import { useState, useEffect } from "react";

interface Task {
  _id: string;
  orderId: string;
  title: string;
  workType: string;
  deadline: string;
  status: string;
  assignedTo: string;
  totalValue: number;
}

export function KanbanBoard({ 
  tasks, 
  onUpdateStatus, 
  onEdit 
}: { 
  tasks: Task[], 
  onUpdateStatus: (id: string, status: string) => void,
  onEdit: (task: Task) => void
}) {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const columns = [
    { id: "pending", label: t('status_pending'), color: "from-amber-500/20 to-amber-500/5", dot: "bg-amber-500", text: "text-amber-500" },
    { id: "in_progress", label: t('status_in_progress'), color: "from-indigo-500/20 to-indigo-500/5", dot: "bg-indigo-500", text: "text-indigo-500" },
    { id: "review", label: t('status_review'), color: "from-rose-500/20 to-rose-500/5", dot: "bg-rose-500", text: "text-rose-500" }
  ];

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId;
    
    // Update locally for instant feedback
    const updatedTasks = localTasks.map(t => 
      t._id === draggableId ? { ...t, status: newStatus } : t
    );
    setLocalTasks(updatedTasks);

    // Update in DB
    onUpdateStatus(draggableId, newStatus);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showNotification(`Order ID ${text} copied!`, "success");
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {columns.map((col) => (
          <Droppable key={col.id} droppableId={col.id}>
            {(provided, snapshot) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`flex flex-col gap-6 p-6 rounded-[2.5rem] min-h-[700px] border transition-all duration-500 relative overflow-hidden ${
                  snapshot.isDraggingOver 
                    ? "bg-white/10 border-white/20 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] scale-[1.01]" 
                    : "bg-white/5 border-white/5 backdrop-blur-3xl"
                }`}
              >
                {/* Background Glow Accent */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 bg-gradient-to-br ${col.color}`} />
                
                <div className="flex items-center justify-between px-2 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_12px_rgba(0,0,0,0.2)] ${col.dot} animate-pulse`} />
                    <h3 className={`text-[11px] font-black uppercase tracking-[0.3em] ${col.text}`}>{col.label}</h3>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/5 text-[10px] font-black text-zinc-400">
                    {localTasks.filter(t => t.status === col.id).length}
                  </div>
                </div>

                <div className="flex-1 space-y-5 relative z-10">
                  {localTasks
                    .filter((t) => t.status === col.id)
                    .map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`outline-none transition-all duration-300 ${snapshot.isDragging ? "z-[100]" : "z-10"}`}
                          >
                            <motion.div 
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className={`group glass-card p-6 border-2 shadow-2xl relative overflow-hidden ${
                                snapshot.isDragging 
                                  ? "border-indigo-500/40 bg-indigo-500/20 shadow-indigo-500/30 scale-[1.08] rotate-2" 
                                  : "border-white/5 hover:border-white/20 bg-white/5"
                              } space-y-5 transition-all duration-300 rounded-[2rem]`}
                            >
                               {/* Noise Texture Overlay */}
                               <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

                              <div className="flex justify-between items-start relative z-10">
                                <div className="flex items-center gap-3">
                                  <div className="p-1.5 rounded-lg bg-black/20 border border-white/5">
                                    <GripVertical size={14} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                                  </div>
                                  <motion.span 
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(99,102,241,0.2)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(task.orderId);
                                    }}
                                    className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 cursor-pointer transition-all"
                                  >
                                    #{task.orderId}
                                  </motion.span>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                                  <motion.button 
                                    whileHover={{ scale: 1.2, rotate: 8 }}
                                    whileTap={{ scale: 0.9 }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => { e.stopPropagation(); onEdit(task); }} 
                                    className="p-2 bg-black/20 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white border border-white/5 transition-all"
                                  >
                                    <Edit size={14} />
                                  </motion.button>
                                  <motion.button 
                                    whileHover={{ scale: 1.2, rotate: -8 }}
                                    whileTap={{ scale: 0.9 }}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => { e.stopPropagation(); onUpdateStatus(task._id, "done"); }} 
                                    className="p-2 bg-black/20 hover:bg-emerald-500/20 rounded-xl text-zinc-400 hover:text-emerald-400 border border-white/5 transition-all"
                                  >
                                    <CheckCircle2 size={14} />
                                  </motion.button>
                                </div>
                              </div>
                              
                              <div onPointerDown={(e) => e.stopPropagation()} className="relative z-10">
                                <h4 className="text-[15px] font-bold leading-tight text-white group-hover:text-indigo-200 transition-colors tracking-tight font-clash">{task.title}</h4>
                                <div className="flex items-center gap-5 mt-5">
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                      <GraduationCap size={12} className="text-indigo-400" />
                                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{task.workType}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-rose-500/5 px-3 py-1.5 rounded-full border border-rose-500/10">
                                      <Clock size={12} className="text-rose-400" />
                                      <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest">
                                        {new Date(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                      </span>
                                    </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-5 border-t border-white/10 relative z-10" onPointerDown={(e) => e.stopPropagation()}>
                                <div className="flex items-center gap-3">
                                   <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
                                      <div className="w-full h-full rounded-[14px] bg-zinc-950 flex items-center justify-center overflow-hidden">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedTo || 'W')}&background=random`} alt="avatar" className="w-full h-full object-cover opacity-80" />
                                      </div>
                                   </div>
                                   <div className="flex flex-col">
                                     <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Assignee</span>
                                     <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tighter">{task.assignedTo || "Unassigned"}</span>
                                   </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Budget</p>
                                  <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                    <p className="text-xs font-black text-emerald-400 tracking-tight">৳{task.totalValue?.toLocaleString()}</p>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  
                  {localTasks.filter(t => t.status === col.id).length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-white/5 rounded-[2rem] opacity-30">
                       <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-3">
                          <Clock size={20} className="text-zinc-500" />
                       </div>
                       <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">No tasks here</p>
                    </div>
                  )}

                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
