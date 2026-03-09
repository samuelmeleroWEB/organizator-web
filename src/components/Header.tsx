import { Sun } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs';

export function Header() {
  return (
    <header className="w-full flex justify-between items-center bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl shadow-sm border border-white mb-6">
      <div className="flex items-center gap-3 text-2xl font-black tracking-tight text-slate-800">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
          <Sun size={24} />
        </div>
        <span>Organizator<span className="text-blue-500">.AI</span></span>
      </div>
      <div className="flex items-center gap-4">
        <Show when="signed-out">
          <SignInButton>
            <button className="border border-gray-200 hover:border-gray-400 bg-white text-gray-600 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150">
              Iniciar sesión
            </button>
          </SignInButton>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
