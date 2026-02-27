'use client';

import { motion, AnimatePresence } from 'framer-motion';

export interface SettingsModalProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  model: string;
  setModel: (model: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  saveConfig: () => void;
}

export function SettingsModal({
  showSettings,
  setShowSettings,
  model,
  setModel,
  apiKey,
  setApiKey,
  saveConfig
}: SettingsModalProps) {
  return (
    <AnimatePresence>
      {showSettings && (
        <>
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
             onClick={() => setShowSettings(false)}
           />
           <motion.div 
             initial={{ opacity: 0, scale: 0.95, y: -20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.95, y: -20 }}
             className="fixed top-24 right-4 sm:right-8 w-[90%] sm:w-80 bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 z-50 transform origin-top-right"
           >
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">Configuración IA</h3>
             <p className="text-xs text-slate-500 mb-4 leading-relaxed">
               Si planeas usar tu propia clave, ponla abajo. De lo contrario, puedes usar el botón &quot;Ver Demo Gratis&quot;.
             </p>
             <div className="space-y-4">
               <div>
                 <label className="text-sm font-semibold text-slate-600 mb-1 block">Proveedor / Modelo</label>
                 <select 
                   value={model}
                   onChange={(e) => setModel(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                 >
                   <option value="gpt-4o-mini">OpenAI: GPT-4o-mini (Recomendado)</option>
                   <option value="gpt-4o">OpenAI: GPT-4o</option>
                   <option value="claude-3-5-sonnet-20240620">Anthropic: Claude 3.5 Sonnet</option>
                 </select>
               </div>
               <div>
                 <label className="text-sm font-semibold text-slate-600 mb-1 block">API Key Personal</label>
                 <input 
                   type="password"
                   value={apiKey}
                   onChange={(e) => setApiKey(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                   placeholder="sk-..."
                 />
               </div>
               <button 
                 onClick={saveConfig}
                 className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium py-2.5 rounded-xl transition-colors mt-2"
               >
                 Guardar Cambios
               </button>
             </div>
           </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
