'use client';

import { Calendar, AlertTriangle, CheckCircle, Coffee, Zap, Sun, ArrowRight } from 'lucide-react';
import { PlanResponse } from '@/types';
import { motion } from 'framer-motion';

export interface PlanResultProps {
  plan: PlanResponse | null;
  loading: boolean;
}

export function PlanResult({ plan, loading }: PlanResultProps) {
  if (!plan && !loading) {
    return (
      <div className="text-center w-full h-full bg-white/40 backdrop-blur-md rounded-3xl border border-white border-dashed flex flex-col items-center justify-center p-12 shadow-sm min-h-[400px]">
        <div className="bg-blue-100 p-6 rounded-full text-blue-500 mb-6 shadow-innner border-8 border-white">
          <Calendar size={64} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Tu lienzo en blanco</h3>
        <p className="text-slate-500 text-lg max-w-sm">
          Configura tus horas e introduce tus tareas. La Inteligencia Artificial estructurará el día perfecto para ti.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full bg-white/60 backdrop-blur-md rounded-3xl border border-white flex flex-col items-center justify-center shadow-lg min-h-[400px]">
         <div className="relative">
           <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
           <motion.div
              animate={{ rotate: 360 }}
              transition={{ ease: "linear", repeat: Infinity, duration: 4 }}
              className="w-24 h-24 border-4 border-slate-200 border-t-blue-500 rounded-full"
           />
         </div>
         <p className="mt-8 text-slate-800 font-bold text-xl animate-pulse">Optimizando tu tiempo...</p>
         <p className="mt-2 text-slate-500 font-medium text-sm">Organizando picos de productividad y descansos</p>
      </div>
    );
  }

  if (plan && !loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full h-full bg-white border border-slate-100 rounded-3xl shadow-xl flex flex-col lg:overflow-hidden min-h-[500px]"
      >
        {/* Header Resultado */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-br from-white to-blue-50">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Tu Plan Maestro</h2>
          <p className="text-slate-600 mt-3 text-base leading-relaxed font-medium">✨ {plan.resumen}</p>
        </div>

        {!plan.viable && (
          <div className="mx-6 md:mx-8 mt-6 bg-red-50 border border-red-100 rounded-2xl p-5">
            <h4 className="flex gap-2 items-center text-red-600 font-bold mb-3 text-lg">
              <AlertTriangle size={22} />
              Plan sobrecargado
            </h4>
            <ul className="text-red-700 text-sm list-disc pl-5 space-y-2 font-medium">
              {plan.advertencias?.map((adv, i) => <li key={i}>{adv}</li>)}
            </ul>
          </div>
        )}

        {/* Timeline Container */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 custom-scrollbar">
          <div className="relative border-l-[3px] border-slate-100 ml-4 lg:ml-6 pb-4">
            {plan.plan.map((item, i) => {
               let dotColor = "bg-slate-300 ring-4 ring-white";
               let bgColor = "bg-white hover:bg-slate-50";
               let borderColor = "border-slate-200";
               let accentBar = "bg-slate-300";
               let icon = <CheckCircle size={20} className="text-slate-400" />;
               let titleColor = "text-slate-800";

               if (item.tipo === 'ocupado') {
                 dotColor = "bg-amber-500 ring-4 ring-amber-50";
                 bgColor = "bg-amber-50/50 hover:bg-amber-50";
                 borderColor = "border-amber-200";
                 accentBar = "bg-amber-400";
                 icon = <Calendar size={20} className="text-amber-500" />;
                 titleColor = "text-amber-900";
               } else if (item.tipo === 'descanso') {
                 dotColor = "bg-blue-400 ring-4 ring-blue-50";
                 bgColor = "bg-blue-50/50 hover:bg-blue-50";
                 borderColor = "border-blue-200";
                 accentBar = "bg-blue-400";
                 icon = <Coffee size={20} className="text-blue-500" />;
                 titleColor = "text-blue-900";
               } else {
                 // Tareas
                 if (item.prioridad === 'alta') {
                   dotColor = "bg-emerald-500 ring-4 ring-emerald-50";
                   bgColor = "bg-emerald-50/50 hover:bg-emerald-50";
                   borderColor = "border-emerald-200";
                   accentBar = "bg-emerald-500";
                   icon = <Zap size={20} className="text-emerald-500" />;
                   titleColor = "text-emerald-900";
                 } else if (item.prioridad === 'media') {
                   dotColor = "bg-indigo-400 ring-4 ring-indigo-50";
                   bgColor = "bg-indigo-50/40 hover:bg-indigo-50/80";
                   borderColor = "border-indigo-100";
                   accentBar = "bg-indigo-400";
                   icon = <Sun size={20} className="text-indigo-500" />;
                 }
               }

               return (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
                  key={i} 
                  className="mb-8 relative pl-8 lg:pl-10"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[10px] top-6 w-[18px] h-[18px] rounded-full ${dotColor} shadow-sm z-10`}></div>
                  
                  <div className={`rounded-2xl border ${bgColor} ${borderColor} transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden relative group`}>
                    {/* Color Bar */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${accentBar}`}></div>
                    
                    <div className="p-5 pl-7">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5">
                        <div className="flex items-center sm:items-start gap-3 flex-shrink-0">
                           <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 flex-shrink-0">
                             {icon}
                           </div>
                           <div className="sm:mt-1 font-mono text-sm font-bold text-slate-500 flex sm:flex-col items-center sm:items-start gap-1">
                             <span>{item.hora_inicio}</span>
                             <ArrowRight size={12} className="sm:hidden text-slate-300" />
                             <span className="hidden sm:inline text-slate-300 text-xs">|</span>
                             <span className="text-slate-400 font-medium">{item.hora_fin}</span>
                           </div>
                        </div>
                        
                        <div className="mt-1 sm:mt-0">
                          <h4 className={`text-lg font-bold mb-1 ${titleColor}`}>{item.nombre}</h4>
                          {item.notas && (
                            <p className="text-slate-500 text-sm font-medium pr-4 leading-relaxed bg-white/50 inline-block px-3 py-1.5 rounded-lg border border-slate-100 mt-2">
                              {item.notas}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
          
          {/* End of plan indicator */}
          <div className="flex justify-center mt-6 mb-4">
            <div className="bg-slate-100 text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              Fin de la jornada
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}
