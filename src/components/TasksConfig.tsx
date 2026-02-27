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
          <h2 className="text-lg font-bold text-slate-800">Tareas Pendientes</h2>
        </div>
        <button 
          onClick={() => setTasks([...tasks, { id: Math.random().toString(), name: '', durationMinutes: 60, priority: 'media' }])}
          className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-xl text-sm font-bold flex gap-1 items-center transition-colors"
        >
          <Plus size={16} /> Tarea
        </button>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              key={task.id} 
              className="p-4 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl border border-slate-200 group transition-colors"
            >
              <div className="flex gap-3 items-start mb-3">
                <input 
                  type="text" 
                  placeholder="¿Qué necesitas hacer?"
                  value={task.name}
                  onChange={e => {
                    const nt = [...tasks];
                    nt[index].name = e.target.value;
                    setTasks(nt);
                  }}
                  className="flex-1 bg-transparent border-none px-1 py-1 text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:ring-0"
                />
                <button 
                  onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                  className="text-slate-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-4 items-center text-sm border-t border-slate-200/60 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">Minutos:</span>
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
                    className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none text-center font-semibold text-slate-700 focus:border-emerald-400"
                  />
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">Importancia:</span>
                   <select 
                    value={task.priority}
                    onChange={e => {
                      const nt = [...tasks];
                      nt[index].priority = e.target.value as 'alta' | 'media' | 'baja' | '';
                      setTasks(nt);
                    }}
                    className="bg-white border border-slate-200 rounded-lg px-3 py-1 outline-none text-xs font-semibold text-slate-700 focus:border-emerald-400 cursor-pointer"
                   >
                     <option value="alta">Alta (Prioridad)</option>
                     <option value="media">Media</option>
                     <option value="baja">Baja (Mecánica)</option>
                     <option value="">IA decide</option>
                   </select>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
           <div className="h-full w-full flex flex-col items-center justify-center opacity-50 py-10">
              <LayoutDashboard size={48} className="text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium text-center">Añade tus tareas para organizarlas</p>
           </div>
        )}
      </div>
      
      <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
         <button 
          onClick={generateDemoPlan}
          disabled={loading}
          className="w-full sm:w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 border border-slate-200"
         >
          <Sparkles size={18} />
          Demo Gratis
         </button>

         <button 
          onClick={generatePlan}
          disabled={loading || tasks.length === 0}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 text-white font-bold py-3.5 rounded-xl transition transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
         >
          {loading ? <Loader2 className="animate-spin" /> : <Zap />}
          {loading ? 'Generando...' : 'Crear mi IA Agenda'}
         </button>
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
