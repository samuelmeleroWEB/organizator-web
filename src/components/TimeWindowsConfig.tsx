'use client';

import { Clock } from 'lucide-react';
import { AvailableWindow } from '@/types';

export interface TimeWindowsConfigProps {
  windows: AvailableWindow[];
  setWindows: (windows: AvailableWindow[]) => void;
}

export function TimeWindowsConfig({ windows, setWindows }: TimeWindowsConfigProps) {
  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-shrink-0">
      <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-3">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
          <Clock size={20} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Horario de Trabajo</h2>
      </div>
      {windows.map((w, index) => (
        <div key={w.id} className="flex gap-4 items-center">
          <div className="flex-1">
             <label className="text-xs font-semibold text-slate-400 block mb-1">Inicio</label>
             <input 
               type="time" 
               value={w.startTime} 
               onChange={e => {
                 const nw = [...windows];
                 nw[index].startTime = e.target.value;
                 setWindows(nw);
               }}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
             />
          </div>
          <div className="flex-1">
             <label className="text-xs font-semibold text-slate-400 block mb-1">Fin</label>
             <input 
               type="time" 
               value={w.endTime} 
               onChange={e => {
                 const nw = [...windows];
                 nw[index].endTime = e.target.value;
                 setWindows(nw);
               }}
               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
             />
          </div>
        </div>
      ))}
    </section>
  );
}
