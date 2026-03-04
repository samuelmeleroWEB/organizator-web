import { Sun, Settings } from 'lucide-react';

export interface HeaderProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

export function Header({ showSettings, setShowSettings }: HeaderProps) {
  return (
    <header className="w-full flex justify-between items-center bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-white mb-6">
      <div className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-800">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
          <Sun size={24} />
        </div>
        <span>Organizator<span className="text-blue-500">.AI</span></span>
      </div>
      <button 
        onClick={() => setShowSettings(!showSettings)}
        className="border border-gray-200 hover:border-gray-400 bg-white text-gray-600 rounded-lg p-2 lg:px-4 lg:py-2 text-sm font-medium transition-colors duration-150 flex items-center gap-2"
      >
        <Settings size={18} />
        <span className="hidden lg:inline">Ajustes API</span>
      </button>
    </header>
  );
}
