import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  ShieldCheck,
  Package,
  Play,
  Printer,
  PhoneOff,
  Sparkles,
  ArrowLeft,
  CheckSquare,
  Square,
} from 'lucide-react';
import type { AdventurePlan } from '../types';

interface PlanDetailPageProps {
  plan: AdventurePlan;
  onStartAdventure: () => void;
  onBackToPlanner: () => void;
}

export const PlanDetailPage: React.FC<PlanDetailPageProps> = ({
  plan,
  onStartAdventure,
  onBackToPlanner,
}) => {
  const [packedItems, setPackedItems] = useState<Record<number, boolean>>({});

  const togglePacked = (idx: number) => {
    setPackedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
      {/* Top Navigation & Back */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onBackToPlanner}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Modify Parameters</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Offline Sheet</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            {plan.activity}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
            {plan.difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {plan.duration} mins total
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/60 flex items-center gap-1 ml-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            {plan.model_used}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {plan.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>{plan.location}</span>
        </div>

        {/* Motto Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <PhoneOff className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-100 uppercase tracking-wider">
                Touch Grass Motto
              </p>
              <p className="font-bold text-sm sm:text-base tracking-tight">
                &ldquo;{plan.touch_grass_motto}&rdquo;
              </p>
            </div>
          </div>
          <button
            onClick={onStartAdventure}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-emerald-800" />
            <span>Start Adventure</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Steps Timeline + Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Timeline (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Step-by-Step Outdoor Timeline
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Designed for paced progression and sensory engagement.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {plan.steps.length} Steps
              </span>
            </div>

            <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200">
              {plan.steps.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Step Node Dot */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                    <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <span>{step.activity}</span>
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold">
                        {step.duration} min
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {step.description}
                    </p>

                    {step.mindfulness_prompt && (
                      <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-100/80 text-xs text-emerald-900 flex items-start gap-2.5">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-semibold text-emerald-950">Sensory Focus: </strong>
                          <span>{step.mindfulness_prompt}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pack Checklist & Safety Tips */}
        <div className="space-y-6">
          {/* Things to Bring */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Pack Checklist</span>
            </h2>
            <div className="space-y-2">
              {plan.things_to_bring.map((item, idx) => {
                const isPacked = !!packedItems[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => togglePacked(idx)}
                    className={`flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors cursor-pointer select-none ${
                      isPacked ? 'bg-emerald-50 text-emerald-800 line-through' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {isPacked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Offline Tip */}
          <div className="bg-amber-50/90 rounded-3xl p-6 border border-amber-200/80 shadow-xs space-y-2.5 text-amber-900">
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-800">
              <PhoneOff className="w-4 h-4 text-amber-700" />
              <span>Screen-Free Protocol</span>
            </div>
            <p className="text-xs leading-relaxed font-medium">
              {plan.offline_tip}
            </p>
          </div>

          {/* Safety Tips */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Safety Reminders</span>
            </h2>
            <ul className="space-y-2">
              {plan.safety_tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0"></span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Start CTA */}
          <div className="no-print pt-2">
            <button
              onClick={onStartAdventure}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-700/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Adventure Mode</span>
            </button>
            <p className="text-center text-xs text-slate-400 mt-2">
              Switches into ultra-minimal timer mode so you can pocket your phone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
