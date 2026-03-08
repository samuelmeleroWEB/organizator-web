import { Sun } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full flex justify-between items-center bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-white mb-6">
      <div className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-800">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
          <Sun size={24} />
        </div>
        <span>Organizator<span className="text-blue-500">.AI</span></span>
      </div>
    </header>
  );
}
