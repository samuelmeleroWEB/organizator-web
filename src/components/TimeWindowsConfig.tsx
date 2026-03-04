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
          className="border border-gray-200 hover:border-gray-400 bg-white text-gray-600 rounded-lg p-2 transition-colors duration-150"
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
             <label className="text-xs font-medium text-gray-500 block mb-1">Inicio de jornada</label>
             <CustomTimeSelect
                 value={w.startTime}
                 onChange={val => {
                   const nw = [...windows];
                   nw[index].startTime = val;
                   setWindows(nw);
                 }}
                 icon={<Sunrise size={18} />}
               />
          </div>
          <div className="flex-1">
             <label className="text-xs font-medium text-gray-500 block mb-1">Fin de jornada</label>
             <CustomTimeSelect
                 value={w.endTime}
                 onChange={val => {
                   const nw = [...windows];
                   nw[index].endTime = val;
                   setWindows(nw);
                 }}
                 icon={<Moon size={18} />}
               />
          </div>
          {windows.length > 1 && (
            <button 
              onClick={() => setWindows(windows.filter(win => win.id !== w.id))}
              className="mb-1 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0"
              title="Eliminar turno"
            >
              <Trash2 size={20} />
            </button>
          )}
        </motion.div>
      ))}
      </AnimatePresence>
      </div>
    </section>
  );
}
