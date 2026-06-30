import type {
  AnalyticsSummary,
  BuildExplanationRequest,
  BuildExplanationResponse,
  BuildSubmissionPayload,
  EvidenceItem,
  IntakeResponse,
  LeadPayload,
  Product,
  RecommendRequest,
  RecommendResponse,
  Vehicle,
  VehicleRequestPayload,
  VehicleVariant,
} from '../types/api';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function parseErrorMessage(response: Response): Promise<{ message: string; details?: unknown }> {
  const fallback = `Request failed with status ${response.status}`;

  try {
    const data = await response.json();

    if (typeof data?.detail === 'string') {
      return { message: data.detail, details: data };
    }

    if (data?.detail?.message) {
      return { message: data.detail.message, details: data };
    }

    if (Array.isArray(data?.detail)) {
      return {
        message: data.detail
          .map((item: unknown) => {
            if (typeof item === 'string') return item;
            return JSON.stringify(item);
          })
          .join(', '),
        details: data,
      };
    }

    if (typeof data?.message === 'string') {
      return { message: data.message, details: data };
    }

    return { message: fallback, details: data };
  } catch {
    const text = await response.text().catch(() => '');
    return { message: text || fallback };
  }
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const hasBody = options.body !== undefined && options.body !== null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const { message, details } = await parseErrorMessage(response);
    throw new ApiError(message, response.status, details);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return undefined as T;
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
  health: () => apiFetch<{ status: string; service?: string; version?: string }>('/health'),

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

  analytics: () => apiFetch<AnalyticsSummary>('/api/v1/analytics/summary'),

  submitVehicleRequest: (payload: VehicleRequestPayload) =>
    apiFetch<IntakeResponse>('/api/v1/intake/vehicle-request', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitBuildSubmission: (payload: BuildSubmissionPayload) =>
    apiFetch<IntakeResponse>('/api/v1/intake/build-submission', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitLead: (payload: LeadPayload) =>
    apiFetch<IntakeResponse>('/api/v1/intake/lead', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export { API_BASE_URL };
