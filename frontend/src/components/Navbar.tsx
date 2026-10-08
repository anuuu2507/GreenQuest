import React from 'react';
import { Sparkles, History, PlusCircle, Trees } from 'lucide-react';
import type { HealthResponse } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  health: HealthResponse | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, health }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Trees className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xl tracking-tight text-slate-800">GreenQuest</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Touch Grass
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                AI Outdoor Activity Planner
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setCurrentTab('landing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'landing'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentTab('planner')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'planner'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Plan Quest</span>
            </button>
            <button
              onClick={() => setCurrentTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'history'
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">Adventures & Stats</span>
              <span className="sm:hidden">History</span>
            </button>
          </nav>

          {/* AI Model Badge */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold">{health?.model_name || 'Gemma Open-Weight'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
