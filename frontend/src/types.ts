export interface PlanStep {
  order?: number;
  duration: number; // minutes
  activity: string;
  description: string;
  mindfulness_prompt?: string;
}

export interface AdventurePlan {
  id: string;
  created_at: string;
  title: string;
  location: string;
  duration: number;
  activity: string;
  difficulty: string;
  steps: PlanStep[];
  things_to_bring: string[];
  safety_tips: string[];
  offline_tip: string;
  touch_grass_motto: string;
  completed: boolean;
  completed_at?: string;
  completion_reflection?: string;
  rating?: number;
  model_used: string;
}

export interface PlanRequest {
  location: string;
  duration: number;
  activity: string;
  fitness_level: string;
  interests?: string[];
  custom_notes?: string;
}

export interface CompletePlanPayload {
  reflection?: string;
  rating?: number;
}

export interface StatsResponse {
  total_plans: number;
  completed_plans: number;
  total_minutes_outside: number;
  screen_free_hours_gained: number;
  grass_touched_score: number;
  activity_breakdown: Record<string, number>;
}

export interface HealthResponse {
  status: string;
  model_provider: string;
  model_name: string;
  open_weight: boolean;
  version: string;
}
