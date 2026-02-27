'use client';

import { useState, useEffect } from 'react';
import { Task, Block, AvailableWindow, PlanResponse } from '@/types';
import { Settings, Plus, Trash2, Clock, Calendar, Zap, AlertTriangle, Loader2, ArrowRight, Sun, Coffee, CheckCircle, Sparkles, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [showSettings, setShowSettings] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [windows, setWindows] = useState<AvailableWindow[]>([
    { id: '1', startTime: '09:00', endTime: '18:00' }
  ]);

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [error, setError] = useState('');

  // Auto-load config from localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('organizator_api_key');
    const savedModel = localStorage.getItem('organizator_model');
    if (savedKey) setApiKey(savedKey);
    if (savedModel) setModel(savedModel);
  }, []);

  const saveConfig = () => {
    localStorage.setItem('organizator_api_key', apiKey);
    localStorage.setItem('organizator_model', model);
    setShowSettings(false);
  };

  const generateDemoPlan = () => {
    setLoading(true);
    setTimeout(() => {
      setPlan({
        viable: true,
        advertencias: [],
        plan: [
          {
            hora_inicio: "09:00",
            hora_fin: "10:30",
            tipo: "tarea",
            nombre: "Trabajo Profundo (Alta Concentración)",
            prioridad: "alta",
            notas: "Aprovechamos tu pico de energía matutino."
          },
          {
            hora_inicio: "10:30",
            hora_fin: "10:45",
            tipo: "descanso",
            nombre: "Pausa activa",
            prioridad: "media",
            notas: "Ideal para estirar las piernas y beber agua."
          },
          {
             hora_inicio: "10:45",
             hora_fin: "12:00",
             tipo: "tarea",
             nombre: "Gestión de correos y tareas administrativas",
             prioridad: "media",
             notas: "Agrupadas para no interrumpir el estado de flujo."
          },
          {
             hora_inicio: "12:00",
             hora_fin: "13:00",
             tipo: "ocupado",
             nombre: "Reunión de Equipo diaria",
             prioridad: "media",
             notas: "Bloque fijo que has indicado."
          },
          {
             hora_inicio: "13:00",
             hora_fin: "14:00",
             tipo: "tarea",
             nombre: "Revisión de métricas y lectura ligera",
             prioridad: "baja",
             notas: "Tarea más relajada antes de terminar la mañana."
          }
        ],
        resumen:"¡Oye, tienes un día fantástico por delante! Hemos organizado lo más exigente al principio y respetado tus reuniones fijas. ¡A por todas!"
      });
      setLoading(false);
    }, 1500);
  }

  const generatePlan = async () => {
    if (!apiKey) {
      alert("Por favor, configura tu API Key primero en los Ajustes (icono engranaje).");
      setShowSettings(true);
      return;
    }

    setLoading(true);
    setError('');
    setPlan(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          model,
          data: { tasks, occupiedBlocks: blocks, availableWindows: windows }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Error al generar el plan');
      }

      setPlan(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 lg:p-8 overflow-x-hidden relative selection:bg-blue-200">
      {/* Background soft energetic shapes */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber-400/20 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <main className="max-w-7xl mx-auto relative z-10 flex flex-col h-full lg:h-[calc(100vh-4rem)]">
        
        {/* Header */}
        <header className="w-full flex justify-between items-center bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-white mb-6">
          <div className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-800">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
              <Sun size={24} />
            </div>
            <span>Organizator<span className="text-blue-500">.AI</span></span>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 lg:px-4 lg:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors flex items-center gap-2"
          >
            <Settings size={18} />
            <span className="hidden lg:inline">Ajustes API</span>
          </button>
        </header>

        {/* Settings Modal (Overlay) */}
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

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 overflow-hidden min-h-0">
          
          {/* Left Panel: Inputs */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:overflow-y-auto lg:pr-2 custom-scrollbar pb-10">
            
            {/* Windows Entry */}
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

            {/* Occupied Blocks Entry */}
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
                      <input 
                        type="time" 
                        value={block.startTime}
                        onChange={e => {
                          const nb = [...blocks];
                          nb[index].startTime = e.target.value;
                          setBlocks(nb);
                        }}
                        className="w-[85px] bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-sm outline-none focus:border-amber-400 font-medium text-slate-600"
                      />
                      <input 
                        type="time" 
                        value={block.endTime}
                        onChange={e => {
                          const nb = [...blocks];
                          nb[index].endTime = e.target.value;
                          setBlocks(nb);
                        }}
                        className="w-[85px] bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 text-sm outline-none focus:border-amber-400 font-medium text-slate-600"
                      />
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

            {/* Tasks Entry */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1 flex flex-col min-h-[300px]">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    <Zap size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Tareas Pendientes</h2>
                </div>
                <button 
                  onClick={() => setTasks([...tasks, { id: Math.random().toString(), name: '', durationMinutes: 60, priority: 'media' }])}
                  className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-xl text-sm font-bold flex gap-1 items-center transition-colors"
                >
                  <Plus size={16} /> Tarea
                </button>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                <AnimatePresence>
                  {tasks.map((task, index) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      key={task.id} 
                      className="p-4 bg-slate-50 hover:bg-emerald-50/30 rounded-2xl border border-slate-200 group transition-colors"
                    >
                      <div className="flex gap-3 items-start mb-3">
                        <input 
                          type="text" 
                          placeholder="¿Qué necesitas hacer?"
                          value={task.name}
                          onChange={e => {
                            const nt = [...tasks];
                            nt[index].name = e.target.value;
                            setTasks(nt);
                          }}
                          className="flex-1 bg-transparent border-none px-1 py-1 text-base font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:ring-0"
                        />
                        <button 
                          onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                          className="text-slate-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 items-center text-sm border-t border-slate-200/60 pt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">Minutos:</span>
                          <input 
                            type="number"
                            step="15" 
                            min="5"
                            value={task.durationMinutes}
                            onChange={e => {
                              const nt = [...tasks];
                              nt[index].durationMinutes = parseInt(e.target.value) || 0;
                              setTasks(nt);
                            }}
                            className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none text-center font-semibold text-slate-700 focus:border-emerald-400"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                           <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">Importancia:</span>
                           <select 
                            value={task.priority}
                            onChange={e => {
                              const nt = [...tasks];
                              nt[index].priority = e.target.value as 'alta' | 'media' | 'baja' | '';
                              setTasks(nt);
                            }}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-1 outline-none text-xs font-semibold text-slate-700 focus:border-emerald-400 cursor-pointer"
                           >
                             <option value="alta">Alta (Prioridad)</option>
                             <option value="media">Media</option>
                             <option value="baja">Baja (Mecánica)</option>
                             <option value="">IA decide</option>
                           </select>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {tasks.length === 0 && (
                   <div className="h-full w-full flex flex-col items-center justify-center opacity-50 py-10">
                      <LayoutDashboard size={48} className="text-slate-300 mb-3" />
                      <p className="text-slate-500 font-medium text-center">Añade tus tareas para organizarlas</p>
                   </div>
                )}
              </div>
              
              <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                 <button 
                  onClick={generateDemoPlan}
                  disabled={loading}
                  className="w-full sm:w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 border border-slate-200"
                 >
                  <Sparkles size={18} />
                  Demo Gratis
                 </button>

                 <button 
                  onClick={generatePlan}
                  disabled={loading || tasks.length === 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 text-white font-bold py-3.5 rounded-xl transition transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                 >
                  {loading ? <Loader2 className="animate-spin" /> : <Zap />}
                  {loading ? 'Generando...' : 'Crear mi IA Agenda'}
                 </button>
              </div>
              
              {error && (
                <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="mt-4 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-100 font-medium flex gap-2 items-start">
                  <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </motion.div>
              )}
            </section>

          </div>

          {/* Right Panel: Daily Plan / Canvas */}
          <div className="lg:col-span-7 h-full flex flex-col relative max-h-fit lg:overflow-hidden lg:max-h-full">
            
            {!plan && !loading && (
              <div className="text-center w-full h-full bg-white/40 backdrop-blur-md rounded-3xl border border-white border-dashed flex flex-col items-center justify-center p-12 shadow-sm min-h-[400px]">
                <div className="bg-blue-100 p-6 rounded-full text-blue-500 mb-6 shadow-innner border-8 border-white">
                  <Calendar size={64} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Tu lienzo en blanco</h3>
                <p className="text-slate-500 text-lg max-w-sm">
                  Configura tus horas e introduce tus tareas. La Inteligencia Artificial estructurará el día perfecto para ti.
                </p>
              </div>
            )}

            {loading && (
              <div className="w-full h-full bg-white/60 backdrop-blur-md rounded-3xl border border-white flex flex-col items-center justify-center shadow-lg min-h-[400px]">
                 <div className="relative">
                   <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                   <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ ease: "linear", repeat: Infinity, duration: 4 }}
                      className="w-24 h-24 border-4 border-slate-200 border-t-blue-500 rounded-full"
                   />
                 </div>
                 <p className="mt-8 text-slate-800 font-bold text-xl animate-pulse">Optimizando tu tiempo...</p>
                 <p className="mt-2 text-slate-500 font-medium text-sm">Organizando picos de productividad y descansos</p>
              </div>
            )}

            {plan && !loading && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full h-full bg-white border border-slate-100 rounded-3xl shadow-xl flex flex-col lg:overflow-hidden min-h-[500px]"
              >
                {/* Header Resultado */}
                <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-br from-white to-blue-50">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Tu Plan Maestro</h2>
                  <p className="text-slate-600 mt-3 text-base leading-relaxed font-medium">✨ {plan.resumen}</p>
                </div>

                {!plan.viable && (
                  <div className="mx-6 md:mx-8 mt-6 bg-red-50 border border-red-100 rounded-2xl p-5">
                    <h4 className="flex gap-2 items-center text-red-600 font-bold mb-3 text-lg">
                      <AlertTriangle size={22} />
                      Plan sobrecargado
                    </h4>
                    <ul className="text-red-700 text-sm list-disc pl-5 space-y-2 font-medium">
                      {plan.advertencias?.map((adv, i) => <li key={i}>{adv}</li>)}
                    </ul>
                  </div>
                )}

                {/* Timeline Container */}
                <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 custom-scrollbar">
                  <div className="relative border-l-[3px] border-slate-100 ml-4 lg:ml-6 pb-4">
                    {plan.plan.map((item, i) => {
                       let dotColor = "bg-slate-300 ring-4 ring-white";
                       let bgColor = "bg-white hover:bg-slate-50";
                       let borderColor = "border-slate-200";
                       let accentBar = "bg-slate-300";
                       let icon = <CheckCircle size={20} className="text-slate-400" />;
                       let titleColor = "text-slate-800";

                       if (item.tipo === 'ocupado') {
                         dotColor = "bg-amber-500 ring-4 ring-amber-50";
                         bgColor = "bg-amber-50/50 hover:bg-amber-50";
                         borderColor = "border-amber-200";
                         accentBar = "bg-amber-400";
                         icon = <Calendar size={20} className="text-amber-500" />;
                         titleColor = "text-amber-900";
                       } else if (item.tipo === 'descanso') {
                         dotColor = "bg-blue-400 ring-4 ring-blue-50";
                         bgColor = "bg-blue-50/50 hover:bg-blue-50";
                         borderColor = "border-blue-200";
                         accentBar = "bg-blue-400";
                         icon = <Coffee size={20} className="text-blue-500" />;
                         titleColor = "text-blue-900";
                       } else {
                         // Tareas
                         if (item.prioridad === 'alta') {
                           dotColor = "bg-emerald-500 ring-4 ring-emerald-50";
                           bgColor = "bg-emerald-50/50 hover:bg-emerald-50";
                           borderColor = "border-emerald-200";
                           accentBar = "bg-emerald-500";
                           icon = <Zap size={20} className="text-emerald-500" />;
                           titleColor = "text-emerald-900";
                         } else if (item.prioridad === 'media') {
                           dotColor = "bg-indigo-400 ring-4 ring-indigo-50";
                           bgColor = "bg-indigo-50/40 hover:bg-indigo-50/80";
                           borderColor = "border-indigo-100";
                           accentBar = "bg-indigo-400";
                           icon = <Sun size={20} className="text-indigo-500" />;
                         }
                       }

                       return (
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
                          key={i} 
                          className="mb-8 relative pl-8 lg:pl-10"
                        >
                          {/* Timeline Dot */}
                          <div className={`absolute -left-[10px] top-6 w-[18px] h-[18px] rounded-full ${dotColor} shadow-sm z-10`}></div>
                          
                          <div className={`rounded-2xl border ${bgColor} ${borderColor} transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden relative group`}>
                            {/* Color Bar */}
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${accentBar}`}></div>
                            
                            <div className="p-5 pl-7">
                              <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-5">
                                <div className="flex items-center sm:items-start gap-3 flex-shrink-0">
                                   <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 flex-shrink-0">
                                     {icon}
                                   </div>
                                   <div className="sm:mt-1 font-mono text-sm font-bold text-slate-500 flex sm:flex-col items-center sm:items-start gap-1">
                                     <span>{item.hora_inicio}</span>
                                     <ArrowRight size={12} className="sm:hidden text-slate-300" />
                                     <span className="hidden sm:inline text-slate-300 text-xs">|</span>
                                     <span className="text-slate-400 font-medium">{item.hora_fin}</span>
                                   </div>
                                </div>
                                
                                <div className="mt-1 sm:mt-0">
                                  <h4 className={`text-lg font-bold mb-1 ${titleColor}`}>{item.nombre}</h4>
                                  {item.notas && (
                                    <p className="text-slate-500 text-sm font-medium pr-4 leading-relaxed bg-white/50 inline-block px-3 py-1.5 rounded-lg border border-slate-100 mt-2">
                                      {item.notas}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                  
                  {/* End of plan indicator */}
                  <div className="flex justify-center mt-6 mb-4">
                    <div className="bg-slate-100 text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      Fin de la jornada
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
