import express from 'express';
import dotenv from 'dotenv';
import { mapCrewAIResponseToResult } from '../utils/responseMapper';

dotenv.config();

const DEFAULT_CREWAI_TIMEOUT_MS = process.env.VERCEL ? 55000 : 120000;
const CREWAI_TIMEOUT_MS =
  Number(process.env.CREWAI_TIMEOUT_MS) || DEFAULT_CREWAI_TIMEOUT_MS;
const POLL_INTERVAL_MS = 2500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseCrewBaseAndKickoffUrls(rawUrl: string): {
  baseUrl: string;
  primaryPostUrl: string;
  kickoffUrl: string;
} {
  const trimmed = rawUrl.trim().replace(/\/+$/, '');
  if (trimmed.endsWith('/kickoff')) {
    const baseUrl = trimmed.slice(0, -'/kickoff'.length);
    return {
      baseUrl,
      primaryPostUrl: trimmed,
      kickoffUrl: trimmed,
    };
  }
  const parsed = new URL(trimmed);
  const hasExplicitActionPath =
    parsed.pathname !== '' && parsed.pathname !== '/';
  return {
    baseUrl: trimmed,
    primaryPostUrl: hasExplicitActionPath ? trimmed : `${trimmed}/kickoff`,
    kickoffUrl: `${trimmed}/kickoff`,
  };
}

function safeParseJsonText(rawText: string): unknown | null {
  try {
    return JSON.parse(rawText);
  } catch {
    return null;
  }
}

async function pollCrewStatus(
  baseUrl: string,
  kickoffId: string,
  headers: Record<string, string>,
  deadlineMs: number,
  signal: AbortSignal
): Promise<unknown> {
  const statusUrl = `${baseUrl}/status/${encodeURIComponent(kickoffId)}`;

  while (Date.now() < deadlineMs) {
    if (signal.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const statusRes = await fetch(statusUrl, {
      method: 'GET',
      headers,
      signal,
    });

    const statusText = await statusRes.text();
    const statusJson = safeParseJsonText(statusText);

    if (!statusRes.ok) {
      throw new Error(
        `CrewAI status check returned HTTP ${statusRes.status}.`
      );
    }

    if (!statusJson || typeof statusJson !== 'object') {
      throw new Error(
        'CrewAI status endpoint returned a non-JSON response.'
      );
    }

    const record = statusJson as Record<string, unknown>;
    const state = String(
      record.state ?? record.status ?? ''
    ).toUpperCase();

    if (
      state === 'SUCCESS' ||
      state === 'COMPLETED' ||
      state === 'DONE'
    ) {
      return record;
    }

    if (state === 'FAILED' || state === 'ERROR' || state === 'CANCELLED') {
      const reason =
        typeof record.error === 'string'
          ? record.error
          : typeof record.message === 'string'
            ? record.message
            : 'CrewAI execution failed.';
      throw new Error(`CrewAI workflow failed: ${reason}`);
    }

    await sleep(POLL_INTERVAL_MS);
  }

  throw new DOMException('CrewAI polling timed out', 'AbortError');
}

export function createApiApp(): express.Express {
  const app = express();

  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    const configured = Boolean(process.env.CREWAI_API_URL?.trim());
    res.json({
      ok: true,
      configured,
      mode: configured ? 'crewai' : 'unconfigured',
    });
  });

  app.post('/api/analyze', async (req, res) => {
    const body = req.body as Record<string, unknown> | undefined;
    const scholarshipSource =
      typeof body?.scholarship_source === 'string'
        ? body.scholarship_source.trim()
        : '';
    const studentProfile =
      typeof body?.student_profile === 'string'
        ? body.student_profile.trim()
        : '';

    if (scholarshipSource.length < 15) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message:
            'Scholarship source information is missing or too short to analyse.',
          retryable: false,
        },
      });
    }

    if (studentProfile.length < 15) {
      return res.status(400).json({
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Student profile information is incomplete.',
          retryable: false,
        },
      });
    }

    const crewUrl = process.env.CREWAI_API_URL?.trim();
    const crewKey = process.env.CREWAI_API_KEY?.trim();

    if (!crewUrl) {
      return res.status(503).json({
        ok: false,
        error: {
          code: 'CREWAI_NOT_CONFIGURED',
          message:
            'Live CrewAI deployment endpoint is not configured on this server yet (CREWAI_API_URL is unset). Once configured, live analysis will run here.',
          retryable: false,
        },
      });
    }

    let urls: ReturnType<typeof parseCrewBaseAndKickoffUrls>;
    try {
      urls = parseCrewBaseAndKickoffUrls(crewUrl);
    } catch {
      return res.status(500).json({
        ok: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message:
            'Server CREWAI_API_URL is not a valid HTTP/HTTPS URL. Check server configuration.',
          retryable: false,
        },
      });
    }

    const controller = new AbortController();
    const deadlineMs = Date.now() + CREWAI_TIMEOUT_MS;
    const timer = setTimeout(() => controller.abort(), CREWAI_TIMEOUT_MS);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (crewKey) {
        headers.Authorization = `Bearer ${crewKey}`;
      }

      const crewInputsPayload = {
        inputs: {
          scholarship_source: scholarshipSource,
          student_profile: studentProfile,
        },
      };

      const flatInputsPayload = {
        scholarship_source: scholarshipSource,
        student_profile: studentProfile,
      };

      let targetUrl = urls.primaryPostUrl;
      let upstreamRes = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(crewInputsPayload),
        signal: controller.signal,
      });

      // If user configured a base path without /kickoff and it returned 404, try /kickoff
      if (upstreamRes.status === 404 && targetUrl !== urls.kickoffUrl) {
        targetUrl = urls.kickoffUrl;
        upstreamRes = await fetch(targetUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(crewInputsPayload),
          signal: controller.signal,
        });
      }

      // If a custom wrapper expects flat top-level inputs and returned 422, retry with flat payload
      if (upstreamRes.status === 422) {
        upstreamRes = await fetch(targetUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(flatInputsPayload),
          signal: controller.signal,
        });
      }

      const rawResponseText = await upstreamRes.text();

      if (!upstreamRes.ok) {
        clearTimeout(timer);
        const upstreamErrJson = safeParseJsonText(rawResponseText) as Record<
          string,
          unknown
        > | null;
        const upstreamDetail =
          (typeof upstreamErrJson?.detail === 'string' &&
            upstreamErrJson.detail) ||
          (typeof upstreamErrJson?.message === 'string' &&
            upstreamErrJson.message) ||
          (typeof upstreamErrJson?.error === 'string' &&
            upstreamErrJson.error) ||
          '';

        return res.status(502).json({
          ok: false,
          error: {
            code: 'UPSTREAM_ERROR',
            message: upstreamDetail
              ? `CrewAI service responded with HTTP ${upstreamRes.status}: ${upstreamDetail}`
              : `CrewAI service responded with HTTP ${upstreamRes.status}. Verify the deployment URL path and authentication token.`,
            retryable: upstreamRes.status >= 500 || upstreamRes.status === 429,
          },
        });
      }

      const parsedBody = safeParseJsonText(rawResponseText);
      let finalPayload: unknown = parsedBody ?? rawResponseText;

      // Handle async CrewAI kickoff responses ({ kickoff_id: "..." })
      if (
        parsedBody &&
        typeof parsedBody === 'object' &&
        !Array.isArray(parsedBody) &&
        typeof (parsedBody as Record<string, unknown>).kickoff_id === 'string'
      ) {
        const kickoffId = (parsedBody as Record<string, unknown>)
          .kickoff_id as string;
        finalPayload = await pollCrewStatus(
          urls.baseUrl,
          kickoffId,
          headers,
          deadlineMs,
          controller.signal
        );
      }

      clearTimeout(timer);

      const rawMetadata =
        body?.metadata &&
        typeof body.metadata === 'object' &&
        !Array.isArray(body.metadata)
          ? (body.metadata as Record<string, unknown>)
          : undefined;
      const rawDocResponses =
        rawMetadata?.document_responses &&
        typeof rawMetadata.document_responses === 'object' &&
        !Array.isArray(rawMetadata.document_responses)
          ? (rawMetadata.document_responses as Record<string, unknown>)
          : undefined;
      const documentResponses = rawDocResponses
        ? Object.fromEntries(
            Object.entries(rawDocResponses).filter(
              (entry): entry is [string, string] => typeof entry[1] === 'string'
            )
          )
        : undefined;

      try {
        const mapped = mapCrewAIResponseToResult(finalPayload, {
          studentProfile,
          documentResponses,
        });
        return res.json({
          ok: true,
          result: mapped,
        });
      } catch (mapErr) {
        return res.status(502).json({
          ok: false,
          error: {
            code: 'INVALID_JSON',
            message:
              mapErr instanceof Error
                ? mapErr.message
                : 'CrewAI output did not match expected structured fields.',
            retryable: false,
          },
        });
      }
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === 'AbortError') {
        return res.status(504).json({
          ok: false,
          error: {
            code: 'CREWAI_TIMEOUT',
            message:
              'The CrewAI workflow took longer than the allowed timeout window. Please try again.',
            retryable: true,
          },
        });
      }

      return res.status(502).json({
        ok: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message:
            err instanceof Error
              ? err.message
              : 'Could not reach the configured CrewAI endpoint.',
          retryable: true,
        },
      });
    }
  });

  // Always return JSON for unmatched /api/* routes instead of falling through to SPA HTML
  app.all('/api/*', (_req, res) => {
    res.status(404).json({
      ok: false,
      error: {
        code: 'UPSTREAM_ERROR',
        message: 'API route not found on ScholarshipSaathi server.',
        retryable: false,
      },
    });
  });

  return app;
}
