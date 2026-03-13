'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CustomTimeSelectProps {
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  className?: string;
  hasError?: boolean;
}

export function CustomTimeSelect({ value, onChange, icon, className = '', hasError = false }: CustomTimeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeOptionRef = useRef<HTMLButtonElement>(null);

  const timeOptions = useMemo(() => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        times.push(`${hh}:${mm}`);
      }
    }
    return times;
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        activeOptionRef.current?.scrollIntoView({ block: 'center' });
      }, 10);
    }
  }, [isOpen]);

  return (
    <div className={`relative group ${className}`} ref={containerRef}>
      {icon && (
        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-150 z-10 ${isOpen ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500'}`}>
          {icon}
        </div>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full py-2 bg-white border ${
          hasError ? 'border-red-400' : 'border-gray-200'
        } rounded-lg outline-none transition-colors duration-150 cursor-pointer text-left text-gray-700 relative flex items-center justify-between ${
          isOpen ? '!border-indigo-500' : hasError ? 'hover:border-red-500' : 'hover:border-gray-300'
        } ${
          icon ? 'pl-10 pr-3' : 'px-3'
        }`}
      >
        <span>{value}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className={`w-5 h-5 ml-2 flex-shrink-0 text-gray-400 transition-transform duration-200 transform ${isOpen ? 'rotate-180 text-indigo-500' : ''}`}>
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8l5 5 5-5"/>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-48 overflow-y-auto custom-scrollbar"
          >
            <div className="py-1">
              {timeOptions.map((time) => {
                const isActive = time === value;
                return (
                  <button
                    key={time}
                    ref={isActive ? activeOptionRef : null}
                    type="button"
                    onClick={() => {
                      onChange(time);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                      isActive 
                        ? 'bg-indigo-100 text-indigo-700 font-medium' 
                        : 'text-gray-700 hover:bg-indigo-50'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
