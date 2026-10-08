import React from 'react';
import { Sparkles, Trees, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-emerald-100 py-8 text-slate-600 text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center">
              <Trees className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-800">GreenQuest</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 text-xs">
              Hacktoberfest 2026 Week 1 Challenge: <strong className="text-emerald-700">Touch Grass</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Powered by Google Gemma Open-Weight AI
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Zero closed-source AI lock-in
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>
            &ldquo;Phone down. Adventure on. The real physical world is waiting right outside your door.&rdquo;
          </p>
          <p>
            Open Source & Free • Built for Human Wellbeing
          </p>
        </div>
      </div>
    </footer>
  );
};
