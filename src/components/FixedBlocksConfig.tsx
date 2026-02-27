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
          <h2 className="text-lg font-bold text-slate-800">Bloques Fijos</h2>
        </div>
        <button 
          onClick={() => setBlocks([...blocks, { id: Math.random().toString(), name: '', startTime: '12:00', endTime: '13:00' }])}
          className="bg-amber-50 text-amber-600 hover:bg-amber-100 p-2 rounded-xl transition-colors"
          title="Añadir bloqueo"
        >
          <Plus size={20} />
        </button>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence>
          {blocks.map((block, index) => (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              key={block.id} 
              className="flex gap-3 items-center group"
            >
              <input 
                type="text" 
                placeholder="Ej. Reunión..."
                value={block.name}
                onChange={e => {
                  const nb = [...blocks];
                  nb[index].name = e.target.value;
                  setBlocks(nb);
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 transition-all font-medium text-slate-700 w-full"
              />
              <div className="w-[110px] flex-shrink-0">
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

              <div className="w-[110px] flex-shrink-0">
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
              <button 
                onClick={() => setBlocks(blocks.filter(b => b.id !== block.id))}
                className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {blocks.length === 0 && (
          <div className="bg-slate-50 rounded-xl p-4 text-center border border-dashed border-slate-200">
             <p className="text-sm text-slate-400 font-medium">No hay eventos fijos hoy.</p>
          </div>
        )}
      </div>
    </section>
  );
}
