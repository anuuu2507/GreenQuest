import React from 'react';
import {
  Compass,
  ArrowRight,
  PhoneOff,
  Sun,
  Wind,
  Sparkles,
  TreePine,
  Clock,
  MapPin,
} from 'lucide-react';
import type { HealthResponse } from '../types';

interface LandingPageProps {
  onStartPlanning: () => void;
  onSelectPreset?: (preset: {
    location: string;
    duration: number;
    activity: string;
    fitness_level: string;
    interests: string[];
  }) => void;
  health: HealthResponse | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onSelectPreset,
  health,
}) => {
  const presets = [
    {
      title: '30-Min Micro-Walk & Nature Reset',
      location: 'Local Neighborhood or Park',
      duration: 30,
      activity: 'Walking',
      fitness_level: 'Beginner',
      interests: ['Tree spotting', 'Sensory breathwork'],
      badge: 'Quick Refresh',
    },
    {
      title: '60-Min Canopy & Birdwatching Quest',
      location: 'Botanical Gardens / Forest Trail',
      duration: 60,
      activity: 'Birdwatching',
      fitness_level: 'Beginner',
      interests: ['Native bird species', 'Quiet canopy observation'],
      badge: 'Deep Immersion',
    },
    {
      title: '45-Min Trail Run & Horizon Strides',
      location: 'Community Park Loop',
      duration: 45,
      activity: 'Running',
      fitness_level: 'Intermediate',
      interests: ['Pacing', 'Oxygen recharge'],
      badge: 'Active Flow',
    },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-xs">
            <TreePine className="w-4 h-4 text-emerald-400" />
            <span>Hacktoberfest 2026 Week 1 • "Touch Grass"</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Stop staring at pixels.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
              Touch grass.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-emerald-100/90 leading-relaxed font-normal">
            GreenQuest uses the open-weight <strong className="text-white font-semibold">Google Gemma</strong> model to generate
            custom, time-boxed outdoor micro-adventures. Once your plan is ready, we ask you to do the radical thing:{' '}
            <span className="text-amber-200 font-semibold underline decoration-amber-400/50 underline-offset-4">
              put your phone away and go outside.
            </span>
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={onStartPlanning}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Compass className="w-5 h-5 text-slate-950" />
              <span>Plan My Adventure</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {health && (
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Model Engine: <strong>{health.model_name}</strong></span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* The Touch Grass Philosophy */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            Why GreenQuest Exists
          </h2>
          <p className="text-slate-600">
            Most AI apps fight for your endless screen time. GreenQuest is built with the opposite philosophy:
            use open-weight AI to kickstart real-world action, then respectfully get out of your way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <PhoneOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Phone Down. Adventure On.</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              No continuous chat threads, no social feeds. Once your plan is generated, the app prompts you to
              pocket your phone and step into nature.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Gemma Open-Weight AI</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Built on Google Gemma open-weight models. Run locally or via compatible inference without vendor lock-in or closed API dependence.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wind className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Sensory Immersion</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Each plan includes mindfulness prompts to engage your senses: feeling the breeze, smelling soil, spotting local birds, and touching real bark.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Inspiration Presets */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Instant Inspiration
            </h2>
            <p className="text-sm text-slate-500">
              Select a quick prompt or customize your own from scratch.
            </p>
          </div>
          <button
            onClick={onStartPlanning}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group self-start sm:self-auto cursor-pointer"
          >
            <span>Custom planner</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {presets.map((preset, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700">
                  {preset.badge}
                </span>
                <h3 className="text-lg font-bold text-slate-800 leading-snug">
                  {preset.title}
                </h3>
                <div className="space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{preset.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{preset.location}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onSelectPreset) {
                    onSelectPreset(preset);
                  } else {
                    onStartPlanning();
                  }
                }}
                className="mt-6 w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-700 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Select & Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Touch Grass Manifesto Banner */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-200 rounded-3xl p-8 sm:p-10 text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-600 text-white shadow-md">
            <Sun className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-950">
            The GreenQuest Promise
          </h3>
          <p className="text-emerald-800 max-w-xl mx-auto leading-relaxed">
            Your notifications will wait. Your emails will still be there. Your physical health, mental clarity, and connection to the living planet come first.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartPlanning}
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-md transition-all cursor-pointer"
            >
              Get Your Plan & Step Outside
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
