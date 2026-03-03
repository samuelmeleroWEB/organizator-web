'use client';

import { Clock, Sunrise, Moon, Plus, Trash2 } from 'lucide-react';
import { AvailableWindow } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomTimeSelect } from './CustomTimeSelect';

export interface TimeWindowsConfigProps {
  windows: AvailableWindow[];
  setWindows: (windows: AvailableWindow[]) => void;
}

export function TimeWindowsConfig({ windows, setWindows }: TimeWindowsConfigProps) {
  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-shrink-0">
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <Clock size={20} />
          </div>
          <h2 className="text-sm font-medium tracking-widest uppercase text-gray-400">Horario de Trabajo</h2>
        </div>
        <button 
          onClick={() => setWindows([...windows, { id: Math.random().toString(), startTime: '16:00', endTime: '19:00' }])}
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-xl transition-colors"
          title="Añadir turno"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="space-y-4">
        <AnimatePresence>
      {windows.map((w, index) => (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          key={w.id} 
          className="flex gap-4 items-end group"
        >
          <div className="flex-1">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 ml-1">Inicio de jornada</label>
             <CustomTimeSelect
                 value={w.startTime}
                 onChange={val => {
                   const nw = [...windows];
                   nw[index].startTime = val;
                   setWindows(nw);
                 }}
                 icon={<Sunrise size={20} />}
                 className="text-lg py-3 tracking-wide"
               />
          </div>
          <div className="flex-1">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 ml-1">Fin de jornada</label>
             <CustomTimeSelect
                 value={w.endTime}
                 onChange={val => {
                   const nw = [...windows];
                   nw[index].endTime = val;
                   setWindows(nw);
                 }}
                 icon={<Moon size={20} />}
                 className="text-lg py-3 tracking-wide"
               />
          </div>
          {windows.length > 1 && (
            <button 
              onClick={() => setWindows(windows.filter(win => win.id !== w.id))}
              className="mb-1 text-slate-300 hover:text-red-500 hover:bg-red-50 p-3.5 rounded-xl transition-colors flex-shrink-0"
              title="Eliminar turno"
            >
              <Trash2 size={24} />
            </button>
          )}
        </motion.div>
      ))}
      </AnimatePresence>
      </div>
    </section>
  );
}
