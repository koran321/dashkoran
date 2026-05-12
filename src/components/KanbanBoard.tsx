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
    { id: "pending", label: t('status_pending'), color: "border-amber-500" },
    { id: "in_progress", label: t('status_in_progress'), color: "border-indigo-500" },
    { id: "review", label: t('status_review'), color: "border-rose-500" }
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
    showNotification(`Order ID ${text} copied to clipboard!`, "success");
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {columns.map((col) => (
          <Droppable key={col.id} droppableId={col.id}>
            {(provided, snapshot) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`flex flex-col gap-5 p-5 rounded-[2.5rem] min-h-[650px] border-2 transition-all duration-300 ${
                  snapshot.isDraggingOver 
                    ? "bg-indigo-500/5 border-indigo-500/20 shadow-[0_30px_60px_-15px_rgba(99,102,241,0.1)]" 
                    : "bg-white/5 border-white/5 backdrop-blur-xl"
                }`}
              >
                <div className="flex items-center justify-between px-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${col.color.replace('border-', 'bg-')}`} />
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[4px]">{col.label}</h3>
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 rounded-xl bg-white/5 text-zinc-500 border border-white/5">
                    {localTasks.filter(t => t.status === col.id).length}
                  </span>
                </div>

                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {localTasks
                      .filter((t) => t.status === col.id)
                      .map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`group relative outline-none ${snapshot.isDragging ? "z-50" : ""}`}
                              style={{
                                ...provided.draggableProps.style,
                                cursor: snapshot.isDragging ? 'grabbing' : 'grab'
                              }}
                            >
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className={`glass-card p-5 border shadow-2xl ${
                                  snapshot.isDragging 
                                    ? "border-indigo-500/50 bg-indigo-500/10 scale-[1.02] rotate-[1deg]" 
                                    : "border-white/5 hover:border-white/20"
                                } space-y-4 transition-all duration-200`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-3">
                                    <GripVertical size={14} className="text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                                    <motion.span 
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyToClipboard(task.orderId);
                                      }}
                                      className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 cursor-pointer active:bg-indigo-500/30 transition-colors"
                                    >
                                      #{task.orderId}
                                    </motion.span>
                                  </div>
                                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <motion.button 
                                      whileHover={{ scale: 1.2, rotate: 8 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={(e) => { e.stopPropagation(); onEdit(task); }} 
                                      className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                    >
                                      <Edit size={14} />
                                    </motion.button>
                                    <motion.button 
                                      whileHover={{ scale: 1.2, rotate: -8 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={(e) => { e.stopPropagation(); onUpdateStatus(task._id, "done"); }} 
                                      className="p-1.5 bg-white/10 hover:bg-emerald-500/20 rounded-lg text-zinc-400 hover:text-emerald-400 transition-colors"
                                    >
                                      <CheckCircle2 size={14} />
                                    </motion.button>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-bold leading-tight text-zinc-100 group-hover:text-indigo-300 transition-colors tracking-tight">{task.title}</h4>
                                  <div className="flex items-center gap-4 mt-4">
                                      <p className="text-[10px] font-black text-zinc-500 flex items-center gap-1.5 uppercase tracking-wider">
                                        <GraduationCap size={12} className="text-indigo-500" />
                                        {task.workType}
                                      </p>
                                      <p className="text-[10px] font-black text-zinc-500 flex items-center gap-1.5 uppercase tracking-wider">
                                        <Clock size={12} className="text-rose-500" />
                                        {new Date(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                      </p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-white/5 overflow-hidden shadow-inner">
                                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedTo || 'W')}&background=random`} alt="avatar" />
                                     </div>
                                     <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">{task.assignedTo || "Unassigned"}</span>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Budget</p>
                                    <p className="text-xs font-black text-emerald-400">৳{task.totalValue?.toLocaleString()}</p>
                                  </div>
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                  </AnimatePresence>
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
