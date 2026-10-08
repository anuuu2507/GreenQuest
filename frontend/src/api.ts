import type {
  AdventurePlan,
  PlanRequest,
  CompletePlanPayload,
  StatsResponse,
  HealthResponse,
} from './types';

const API_BASE = '/api';

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) {
    throw new Error(`Failed to fetch health: ${res.statusText}`);
  }
  return res.json();
}

export async function createPlan(data: PlanRequest): Promise<AdventurePlan> {
  const res = await fetch(`${API_BASE}/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMsg = `Server error (${res.status})`;
    try {
      const errJson = await res.json();
      if (errJson.detail) {
        errorMsg = typeof errJson.detail === 'string' ? errJson.detail : JSON.stringify(errJson.detail);
      }
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export async function getPlans(): Promise<AdventurePlan[]> {
  const res = await fetch(`${API_BASE}/plans`);
  if (!res.ok) {
    throw new Error(`Failed to load plans: ${res.statusText}`);
  }
  return res.json();
}

export async function getPlan(id: string): Promise<AdventurePlan> {
  const res = await fetch(`${API_BASE}/plans/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to load plan: ${res.statusText}`);
  }
  return res.json();
}

export async function completePlan(id: string, payload?: CompletePlanPayload): Promise<AdventurePlan> {
  const res = await fetch(`${API_BASE}/plans/${id}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {}),
  });

  if (!res.ok) {
    throw new Error(`Failed to complete plan: ${res.statusText}`);
  }

  return res.json();
}

export async function getStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) {
    throw new Error(`Failed to fetch stats: ${res.statusText}`);
  }
  return res.json();
}
