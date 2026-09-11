import "server-only";
import { createHash } from "node:crypto";

/**
 * Helpers voor route handlers: IP bepalen (Vercel/proxy-aware), IP hashen
 * (AVG: geen ruwe IP's opslaan) en een eenvoudige in-memory rate limiter.
 *
 * Let op: de rate limiter is per serverless-instantie en dus "best effort".
 * Voor harde limieten: Vercel Firewall / Upstash Ratelimit (zie docs/DEPLOYMENT.md).
 */

export function getClientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "nova-onderhoud-demo";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSec: 0 };
}

/** Houd de map klein op langlopende instanties. */
export function pruneRateLimits() {
  const now = Date.now();
  for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k);
}

export function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return Response.json({ ok: false, error: message, ...extra }, { status });
}
