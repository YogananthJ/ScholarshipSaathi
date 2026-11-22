import {
  AnalyzeApiResponse,
  CrewAIAnalyzeRequest,
} from '../types/scholarship';

export interface BackendHealthStatus {
  ok: boolean;
  configured: boolean;
  mode: 'crewai' | 'unconfigured';
}

export async function checkBackendHealth(): Promise<BackendHealthStatus> {
  try {
    const res = await fetch('/api/health', { method: 'GET' });
    if (!res.ok) {
      return { ok: false, configured: false, mode: 'unconfigured' };
    }
    return (await res.json()) as BackendHealthStatus;
  } catch {
    return { ok: false, configured: false, mode: 'unconfigured' };
  }
}

export async function submitScholarshipAnalysis(
  payload: CrewAIAnalyzeRequest,
  signal?: AbortSignal
): Promise<AnalyzeApiResponse> {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    });

    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();

    let parsed: AnalyzeApiResponse | null = null;
    try {
      parsed = JSON.parse(rawText) as AnalyzeApiResponse;
    } catch {
      const looksLikeHtml =
        contentType.includes('text/html') ||
        rawText.trimStart().startsWith('<!doctype') ||
        rawText.trimStart().startsWith('<html');

      return {
        ok: false,
        error: {
          code: 'INVALID_JSON',
          message: looksLikeHtml
            ? `The /api/analyze endpoint returned HTML instead of JSON (HTTP ${response.status}). Make sure the Express backend server (server.ts) is running rather than a static frontend preview.`
            : `The analysis service returned an unreadable non-JSON response (HTTP ${response.status}). No results were fabricated.`,
          retryable: true,
        },
      };
    }

    if (!response.ok || !parsed?.ok) {
      return {
        ok: false,
        error: parsed?.error ?? {
          code: 'UPSTREAM_ERROR',
          message: `Analysis request failed with HTTP ${response.status}.`,
          retryable: response.status >= 500,
        },
      };
    }

    if (!parsed.result) {
      return {
        ok: false,
        error: {
          code: 'INVALID_JSON',
          message:
            'The backend succeeded but omitted the structured result object.',
          retryable: true,
        },
      };
    }

    return parsed;
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return {
        ok: false,
        error: {
          code: 'CREWAI_TIMEOUT',
          message:
            'The analysis request was cancelled or timed out before CrewAI responded.',
          retryable: true,
        },
      };
    }
    return {
      ok: false,
      error: {
        code: 'UPSTREAM_ERROR',
        message:
          'Unable to reach the ScholarshipSaathi backend server. Please check your connection and try again.',
        retryable: true,
      },
    };
  }
}
