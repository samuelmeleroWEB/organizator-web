'use client';

import { useState, useEffect } from 'react';
import { Task, Block, AvailableWindow, PlanResponse } from '@/types';
import { Header } from '@/components/Header';
import { SettingsModal } from '@/components/SettingsModal';
import { TimeWindowsConfig } from '@/components/TimeWindowsConfig';
import { FixedBlocksConfig } from '@/components/FixedBlocksConfig';
import { TasksConfig } from '@/components/TasksConfig';
import { PlanResult } from '@/components/PlanResult';

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
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8 overflow-x-hidden relative selection:bg-blue-200">
      {/* Background soft energetic shapes */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber-400/20 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <main className="max-w-7xl mx-auto relative z-10 flex flex-col h-full lg:h-[calc(100vh-4rem)]">
        
        <Header showSettings={showSettings} setShowSettings={setShowSettings} />

        <SettingsModal 
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          model={model}
          setModel={setModel}
          apiKey={apiKey}
          setApiKey={setApiKey}
          saveConfig={saveConfig}
        />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 overflow-hidden min-h-0">
          
          {/* Left Panel: Inputs */}
          <div className="lg:col-span-5 flex flex-col gap-8 lg:overflow-y-auto lg:pr-2 custom-scrollbar pb-10">
            <TimeWindowsConfig windows={windows} setWindows={setWindows} />
            <FixedBlocksConfig blocks={blocks} setBlocks={setBlocks} />
            <TasksConfig 
              tasks={tasks}
              setTasks={setTasks}
              loading={loading}
              error={error}
              generateDemoPlan={generateDemoPlan}
              generatePlan={generatePlan}
            />
          </div>

          {/* Right Panel: Daily Plan / Canvas */}
          <div className="lg:col-span-7 h-full flex flex-col relative max-h-fit lg:overflow-hidden lg:max-h-full">
            <PlanResult plan={plan} loading={loading} />
          </div>
        </div>
      </main>
    </div>
  );
}
