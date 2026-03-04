'use client';

import { Calendar, AlertTriangle } from 'lucide-react';
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
          <div className="space-y-3">
            {plan.plan.map((item, i) => {
               const isOccupied = item.tipo === 'ocupado';
               const borderClass = isOccupied ? 'border-gray-200' : 'border-indigo-200';
               const textClass = isOccupied ? 'text-gray-400' : 'text-gray-800';

               return (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
                  key={i} 
                  className={`flex items-start border-l-2 ${borderClass} pl-4`}
                >
                  <div className="text-xs text-gray-400 w-16 pt-0.5 shrink-0">
                    {item.hora_inicio}
                  </div>
                  <div>
                    <div className={`font-medium ${textClass}`}>{item.nombre}</div>
                    {item.notas && (
                      <div className="text-xs text-gray-400 mt-0.5">{item.notas}</div>
                    )}
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
