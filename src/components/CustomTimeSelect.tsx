'use client';

import { useMemo } from 'react';

export interface CustomTimeSelectProps {
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  className?: string;
}

export function CustomTimeSelect({ value, onChange, icon, className = '' }: CustomTimeSelectProps) {
  const timeOptions = useMemo(() => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        times.push(`${hh}:${mm}`);
      }
    }
    return times;
  }, []);

  return (
    <div className={`relative group ${className}`}>
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full py-2.5 bg-slate-50 border border-slate-200 rounded-xl appearance-none outline-none transition-all cursor-pointer text-slate-700 font-bold focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 ${
          icon ? 'pl-10 pr-8' : 'px-3 cursor-pointer'
        } ${className}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 8l5 5 5-5'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.25em 1.25em'
        }}
      >
        {timeOptions.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
}
