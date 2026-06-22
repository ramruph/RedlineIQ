import type {
  AnalyticsSummary,
  BuildExplanationRequest,
  BuildExplanationResponse,
  EvidenceItem,
  Product,
  RecommendRequest,
  RecommendResponse,
  Vehicle,
  VehicleVariant,
} from '../types/api';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const data = await response.json();
      if (typeof data?.detail === 'string') {
        message = data.detail;
      } else if (data?.detail?.message) {
        message = data.detail.message;
      } else if (Array.isArray(data?.detail)) {
        message = data.detail.map((item: unknown) => JSON.stringify(item)).join(', ');
      }
    } catch {
      // Keep default message if response is not JSON.
    }

    throw new ApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

function buildQuery(params: Record<string, string | number | boolean | null | undefined>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });

  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export const redlineApi = {
  health: () => apiFetch<{ status: string; service: string; version: string }>('/health'),

  vehicles: () => apiFetch<Vehicle[]>('/api/v1/vehicles/'),

  variants: (vehicleId: string) =>
    apiFetch<VehicleVariant[]>(`/api/v1/vehicles/${vehicleId}/variants`),

  products: (params: {
    vehicle_id?: string | null;
    variant_id?: string | null;
    engine_id?: string | null;
    category?: string | null;
    limit?: number;
  }) => apiFetch<Product[]>(`/api/v1/products/${buildQuery(params)}`),

  recommend: (payload: RecommendRequest) =>
    apiFetch<RecommendResponse>('/api/v1/recommend/', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  
  buildExplanation: (payload: BuildExplanationRequest) =>
    apiFetch<BuildExplanationResponse>('/api/v1/rag/build-explanation', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  ragAnswer: (payload: {
    question: string;
    vehicle_id?: string | null;
    variant_id?: string | null;
    top_k?: number;
  }) =>
    apiFetch<BuildExplanationResponse>('/api/v1/rag/answer', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  evidence: (params: {
    vehicle_id?: string | null;
    variant_id?: string | null;
    evidence_type?: string | null;
    category?: string | null;
    min_quality?: number;
    limit?: number;
  }) => apiFetch<EvidenceItem[]>(`/api/v1/evidence/${buildQuery(params)}`),

  analytics: () => apiFetch<AnalyticsSummary>('/api/v1/analytics/summary')};

export { API_BASE_URL };
