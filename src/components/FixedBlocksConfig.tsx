'use client';

import { Calendar, Plus, Trash2, Clock } from 'lucide-react';
import { Block } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomTimeSelect } from './CustomTimeSelect';

export interface FixedBlocksConfigProps {
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
}

export function FixedBlocksConfig({ blocks, setBlocks }: FixedBlocksConfigProps) {
  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-shrink-0">
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
            <Calendar size={20} />
          </div>
          <h2 className="text-sm font-medium tracking-widest uppercase text-gray-400">Bloques Fijos</h2>
        </div>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              key={block.id} 
              className="bg-white border border-gray-100 rounded-xl p-3 mb-3 group"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-end gap-2">
                  <div className="grid grid-cols-1 gap-2 flex-1">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Nombre</label>
                      <input 
                        type="text" 
                        placeholder="Ej. Reunión..."
                        value={block.name}
                        onChange={e => {
                          const nb = [...blocks];
                          nb[index].name = e.target.value;
                          setBlocks(nb);
                        }}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 transition-colors duration-150 text-gray-700"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => setBlocks(blocks.filter(b => b.id !== block.id))}
                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Inicio</label>
                    <CustomTimeSelect
                      value={block.startTime}
                      onChange={val => {
                        const nb = [...blocks];
                        nb[index].startTime = val;
                        setBlocks(nb);
                      }}
                      icon={<Clock size={16} />}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Fin</label>
                    <CustomTimeSelect
                      value={block.endTime}
                      onChange={val => {
                        const nb = [...blocks];
                        nb[index].endTime = val;
                        setBlocks(nb);
                      }}
                      icon={<Clock size={16} />}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {blocks.length === 0 && (
          <div className="bg-slate-50 rounded-xl p-4 text-center border border-dashed border-slate-200">
             <p className="text-sm text-slate-400 font-medium">No hay eventos fijos hoy.</p>
          </div>
        )}
        <button 
          onClick={() => setBlocks([...blocks, { id: Math.random().toString(), name: '', startTime: '12:00', endTime: '13:00' }])}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-400 hover:text-indigo-500 rounded-lg py-2 mt-2 text-sm transition-all duration-150"
        >
          <Plus size={16} /> Añadir bloque
        </button>
      </div>
    </section>
  );
}
