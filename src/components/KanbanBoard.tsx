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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {columns.map((col) => (
          <Droppable key={col.id} droppableId={col.id}>
            {(provided, snapshot) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`flex flex-col gap-4 p-4 rounded-[40px] min-h-[600px] border transition-colors ${
                  snapshot.isDraggingOver 
                    ? "bg-zinc-200/50 dark:bg-zinc-800/50 border-indigo-500/30" 
                    : "bg-zinc-100/30 dark:bg-zinc-900/30 border-zinc-200/50 dark:border-zinc-800/50"
                }`}
              >
                <div className="flex items-center justify-between px-2 mb-2">
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[4px]">{col.label}</h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-500">
                    {localTasks.filter(t => t.status === col.id).length}
                  </span>
                </div>

                <AnimatePresence>
                  {localTasks
                    .filter((t) => t.status === col.id)
                    .map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`group relative ${snapshot.isDragging ? "z-50" : ""}`}
                          >
                            <motion.div 
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`bg-white dark:bg-[#0f172a] p-5 rounded-3xl shadow-xl border-l-4 ${col.color} ${
                                snapshot.isDragging 
                                  ? "shadow-2xl shadow-indigo-500/20 scale-105 border-indigo-500" 
                                  : "border-transparent shadow-zinc-200/20 dark:shadow-none border-zinc-100 dark:border-white/5"
                              } space-y-4 transition-all`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                  <GripVertical size={14} className="text-zinc-300 group-hover:text-zinc-500 transition-colors cursor-grab active:cursor-grabbing" />
                                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg">
                                    #{task.orderId}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => onEdit(task)} className="p-1.5 text-zinc-400 hover:text-indigo-500 transition-colors"><Edit size={14} /></button>
                                  <button onClick={() => onUpdateStatus(task._id, "done")} className="p-1.5 text-zinc-400 hover:text-emerald-500 transition-colors"><CheckCircle2 size={14} /></button>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-bold leading-tight text-zinc-900 dark:text-zinc-100">{task.title}</h4>
                                <div className="flex items-center gap-3 mt-3">
                                    <p className="text-[9px] font-bold text-zinc-400 flex items-center gap-1 uppercase">
                                      <GraduationCap size={10} className="text-indigo-500" />
                                      {task.workType}
                                    </p>
                                    <p className="text-[9px] font-bold text-zinc-400 flex items-center gap-1 uppercase">
                                      <Clock size={10} className="text-rose-500" />
                                      {new Date(task.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-white/5">
                                <div className="flex items-center gap-2">
                                   <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-black text-indigo-500 border-2 border-white dark:border-zinc-900 overflow-hidden shadow-sm">
                                      <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedTo || 'W')}&background=random`} />
                                   </div>
                                   <span className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-tighter">{task.assignedTo || "Unassigned"}</span>
                                </div>
                                <p className="text-[10px] font-black text-emerald-500">৳{task.totalValue?.toLocaleString()}</p>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
