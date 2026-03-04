'use client';

import { Zap, Plus, Trash2, LayoutDashboard, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { Task } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export interface TasksConfigProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  loading: boolean;
  error: string;
  generateDemoPlan: () => void;
  generatePlan: () => void;
}

export function TasksConfig({ tasks, setTasks, loading, error, generateDemoPlan, generatePlan }: TasksConfigProps) {
  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1 flex flex-col min-h-[300px]">
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
            <Zap size={20} />
          </div>
          <h2 className="text-sm font-medium tracking-widest uppercase text-gray-400">Tareas Pendientes</h2>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              exit={{ opacity: 0, height: 0 }}
              key={task.id} 
              className="p-4 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl border border-slate-200 group transition-colors"
            >
              <div className="flex gap-3 items-end mb-4">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 block mb-1">Nombre de la tarea</label>
                  <input 
                    type="text" 
                    placeholder="¿Qué necesitas hacer?"
                    value={task.name}
                    onChange={e => {
                      const nt = [...tasks];
                      nt[index].name = e.target.value;
                      setTasks(nt);
                    }}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors duration-150 text-gray-700 placeholder:text-gray-400"
                  />
                </div>
                <button 
                  onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                  className="mb-[2px] text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="grid grid-cols-[90px_1fr] sm:grid-cols-2 gap-3 items-start text-sm">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-400 mb-1">Duración (min)</label>
                  <input 
                    type="number"
                    step="15" 
                    min="5"
                    value={task.durationMinutes}
                    onChange={e => {
                      const nt = [...tasks];
                      nt[index].durationMinutes = parseInt(e.target.value) || 0;
                      setTasks(nt);
                    }}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm text-gray-700 focus:border-indigo-500 transition-colors duration-150"
                  />
                </div>
                <div className="flex flex-col">
                   <label className="text-xs text-gray-400 mb-1">Prioridad</label>
                   <div className="flex flex-row gap-1 sm:gap-2 flex-nowrap w-full">
                     <button
                       onClick={() => {
                         const nt = [...tasks];
                         nt[index].priority = 'alta';
                         setTasks(nt);
                       }}
                       className={`flex-1 sm:flex-none justify-center border rounded-full px-1 sm:px-3 py-1 text-[11px] sm:text-xs font-medium transition-all duration-150 ${task.priority === 'alta' ? 'bg-red-100 text-red-600 border-red-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500'}`}
                     >
                       Alta
                     </button>
                     <button
                       onClick={() => {
                         const nt = [...tasks];
                         nt[index].priority = 'media';
                         setTasks(nt);
                       }}
                       className={`flex-1 sm:flex-none justify-center border rounded-full px-1 sm:px-3 py-1 text-[11px] sm:text-xs font-medium transition-all duration-150 ${task.priority === 'media' ? 'bg-amber-100 text-amber-600 border-amber-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-500'}`}
                     >
                       Media
                     </button>
                     <button
                       onClick={() => {
                         const nt = [...tasks];
                         nt[index].priority = 'baja';
                         setTasks(nt);
                       }}
                       className={`flex-1 sm:flex-none justify-center border rounded-full px-1 sm:px-3 py-1 text-[11px] sm:text-xs font-medium transition-all duration-150 ${task.priority === 'baja' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-500'}`}
                     >
                       Baja
                     </button>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
           <div className="flex flex-col items-center justify-center opacity-50 py-10">
              <LayoutDashboard size={48} className="text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium text-center">Añade tus tareas para organizarlas</p>
           </div>
        )}
        <button 
          onClick={() => setTasks([...tasks, { id: Math.random().toString(), name: '', durationMinutes: 60, priority: 'media' }])}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-400 hover:text-indigo-500 rounded-lg py-2 mt-2 text-sm transition-all duration-150"
        >
          <Plus size={16} /> Añadir tarea
        </button>
      </div>
      
      <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
         <button 
          onClick={generateDemoPlan}
          disabled={loading}
          className="w-full sm:w-1/3 border border-gray-200 hover:border-gray-400 bg-white text-gray-600 rounded-lg py-2.5 text-sm font-medium transition-colors duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
         >
          <Sparkles size={18} />
          Demo Gratis
         </button>

         <motion.button 
          whileTap={{ scale: 0.97 }}
          onClick={generatePlan}
          disabled={loading || tasks.length === 0}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
         >
          {loading ? <Loader2 className="animate-spin" /> : <Zap />}
          {loading ? 'Generando...' : 'Crear mi IA Agenda'}
         </motion.button>
      </div>
      
      {error && (
        <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="mt-4 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-100 font-medium flex gap-2 items-start">
          <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </motion.div>
      )}
    </section>
  );
}
