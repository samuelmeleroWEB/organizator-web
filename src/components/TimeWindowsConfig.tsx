'use client';

import { Clock, Sunrise, Moon } from 'lucide-react';
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
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 ml-1">Inicio de jornada</label>
             <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                 <Sunrise size={20} />
               </div>
               <input 
                 type="time" 
                 value={w.startTime} 
                 onChange={e => {
                   const nw = [...windows];
                   nw[index].startTime = e.target.value;
                   setWindows(nw);
                 }}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-3 py-3.5 text-slate-800 font-bold text-lg tracking-wide focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
               />
             </div>
          </div>
          <div className="flex-1">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 ml-1">Fin de jornada</label>
             <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                 <Moon size={20} />
               </div>
               <input 
                 type="time" 
                 value={w.endTime} 
                 onChange={e => {
                   const nw = [...windows];
                   nw[index].endTime = e.target.value;
                   setWindows(nw);
                 }}
                 className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-3 py-3.5 text-slate-800 font-bold text-lg tracking-wide focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
               />
             </div>
          </div>
        </div>
      ))}
    </section>
  );
}
