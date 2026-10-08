import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { PlannerPage } from './components/PlannerPage';
import { PlanDetailPage } from './components/PlanDetailPage';
import { AdventureMode } from './components/AdventureMode';
import { HistoryPage } from './components/HistoryPage';
import type {
  AdventurePlan,
  PlanRequest,
  CompletePlanPayload,
  StatsResponse,
  HealthResponse,
} from './types';
import * as api from './api';

export function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'planner' | 'plan' | 'adventure' | 'history'>('landing');
  const [activePlan, setActivePlan] = useState<AdventurePlan | null>(null);
  const [plans, setPlans] = useState<AdventurePlan[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presetValues, setPresetValues] = useState<Partial<PlanRequest> | undefined>(undefined);

  const loadPlansAndStats = async () => {
    try {
      const [plansData, statsData] = await Promise.all([
        api.getPlans().catch(() => []),
        api.getStats().catch(() => null),
      ]);
      setPlans(plansData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load plans or stats', err);
    }
  };

  // Initial load: health, plans, stats
  useEffect(() => {
    let isMounted = true;

    api.getHealth()
      .then((data) => {
        if (isMounted) setHealth(data);
      })
      .catch((err) => {
        console.warn('Backend health check error:', err);
      });

    Promise.all([
      api.getPlans().catch(() => []),
      api.getStats().catch(() => null),
    ]).then(([plansData, statsData]) => {
      if (isMounted) {
        setPlans(plansData);
        setStats(statsData);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreatePlan = async (request: PlanRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPlan = await api.createPlan(request);
      setActivePlan(newPlan);
      setCurrentTab('plan');
      // Refresh list in background
      loadPlansAndStats();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate plan';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompletePlan = async (payload: CompletePlanPayload) => {
    if (!activePlan) return;
    try {
      const updated = await api.completePlan(activePlan.id, payload);
      setActivePlan(updated);
      await loadPlansAndStats();
      setCurrentTab('history');
    } catch (err) {
      console.error('Complete plan error:', err);
      setCurrentTab('history');
    }
  };

  const handleSelectPreset = (preset: {
    location: string;
    duration: number;
    activity: string;
    fitness_level: string;
    interests: string[];
  }) => {
    setPresetValues(preset);
    setCurrentTab('planner');
  };

  const handleSelectHistoricalPlan = (plan: AdventurePlan) => {
    setActivePlan(plan);
    setCurrentTab('plan');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf7] text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-900">
      {/* If in Adventure Mode, render full-screen minimalist interface */}
      {currentTab === 'adventure' && activePlan ? (
        <AdventureMode
          plan={activePlan}
          onExit={() => setCurrentTab('plan')}
          onComplete={handleCompletePlan}
        />
      ) : (
        <>
          <Navbar
            currentTab={currentTab}
            setCurrentTab={(tab) => setCurrentTab(tab as typeof currentTab)}
            health={health}
          />

          <main className="flex-1 pb-16">
            {currentTab === 'landing' && (
              <LandingPage
                onStartPlanning={() => {
                  setPresetValues(undefined);
                  setCurrentTab('planner');
                }}
                onSelectPreset={handleSelectPreset}
                health={health}
              />
            )}

            {currentTab === 'planner' && (
              <PlannerPage
                initialValues={presetValues}
                onSubmit={handleCreatePlan}
                isLoading={isLoading}
                error={error}
              />
            )}

            {currentTab === 'plan' && activePlan && (
              <PlanDetailPage
                plan={activePlan}
                onStartAdventure={() => setCurrentTab('adventure')}
                onBackToPlanner={() => setCurrentTab('planner')}
              />
            )}

            {currentTab === 'history' && (
              <HistoryPage
                plans={plans}
                stats={stats}
                onSelectPlan={handleSelectHistoricalPlan}
                onNewPlan={() => {
                  setPresetValues(undefined);
                  setCurrentTab('planner');
                }}
                isLoading={isLoading}
              />
            )}
          </main>

          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
