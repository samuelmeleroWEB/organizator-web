'use client';

import { Clock, Sunrise, Moon } from 'lucide-react';
import { AvailableWindow } from '@/types';
import { CustomTimeSelect } from './CustomTimeSelect';

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
        </div>
      ))}
    </section>
  );
}
