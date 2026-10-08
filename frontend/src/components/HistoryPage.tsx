import React from 'react';
import {
  Compass,
  Clock,
  MapPin,
  CheckCircle2,
  Star,
  Trees,
  Award,
  PhoneOff,
  ArrowRight,
} from 'lucide-react';
import type { AdventurePlan, StatsResponse } from '../types';

interface HistoryPageProps {
  plans: AdventurePlan[];
  stats: StatsResponse | null;
  onSelectPlan: (plan: AdventurePlan) => void;
  onNewPlan: () => void;
  isLoading?: boolean;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  plans,
  stats,
  onSelectPlan,
  onNewPlan,
}) => {
  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Adventures & Impact Log
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Real time spent outside in the physical world instead of behind glowing screens.
          </p>
        </div>
        <button
          onClick={onNewPlan}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Plan New Quest</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Outside Time
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.total_minutes_outside}{' '}
              <span className="text-xs font-bold text-slate-400">mins</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-semibold">
              ≈ {stats.screen_free_hours_gained} hours screen-free
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Completed
              </span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.completed_plans}{' '}
              <span className="text-xs font-bold text-slate-400">/ {stats.total_plans}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Quests accomplished
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Grass Score
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">
              {stats.grass_touched_score}
            </div>
            <p className="text-[11px] text-slate-500">
              Real world grounding points
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Screen Saved
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <PhoneOff className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.screen_free_hours_gained}{' '}
              <span className="text-xs font-bold text-slate-400">hrs</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Saved from doomscrolling
            </p>
          </div>
        </div>
      )}

      {/* Activity Breakdown Chips */}
      {stats && stats.activity_breakdown && Object.keys(stats.activity_breakdown).length > 0 && (
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            Activities:
          </span>
          {Object.entries(stats.activity_breakdown).map(([act, count]) => (
            <span
              key={act}
              className="px-3 py-1 rounded-full bg-white text-emerald-800 text-xs font-semibold shadow-2xs border border-emerald-200"
            >
              {act} <span className="text-emerald-500 font-normal">({count})</span>
            </span>
          ))}
        </div>
      )}

      {/* Plan History List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Trees className="w-5 h-5 text-emerald-600" />
          <span>Adventure History ({plans.length})</span>
        </h2>

        {plans.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <Trees className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No adventures planned yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Ready to disconnect from screens and step outside? Create your first outdoor quest now.
            </p>
            <button
              onClick={onNewPlan}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Plan Your First Quest
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectPlan(item)}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                      {item.activity}
                    </span>

                    {item.completed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                        Planned
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <div className="space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.duration} mins • {item.steps.length} steps</span>
                    </div>
                  </div>

                  {item.completion_reflection && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 italic">
                      &ldquo;{item.completion_reflection}&rdquo;
                    </div>
                  )}

                  {item.rating && (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            (item.rating || 0) >= s
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  <span className="font-semibold text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>View Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
