// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.

import IORedis from "ioredis";

export interface RateLimitRule {
  /** Key prefix so different rules on the same identifier don't collide. */
  name: string;
  windowSeconds: number;
  max: number;
}

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

// Fail-fast options: rate limiting sits on the request path, so a slow or
// down Redis must not hang requests — errors fall back to in-memory counting.
let redis: IORedis | null | undefined;

function getRedis(): IORedis | null {
  if (redis !== undefined) return redis;
  const url = process.env.REDIS_URL;
  if (!url) {
    redis = null;
    return null;
  }
  redis = new IORedis(url, {
    maxRetriesPerRequest: 1,
    connectTimeout: 2000,
    commandTimeout: 1000,
    enableOfflineQueue: false,
  });
  redis.on("error", (err) => {
    console.warn("[rateLimit] redis error:", err.message);
  });
  return redis;
}

// In-memory fallback. Per-instance only (each serverless instance counts
// separately), so treat it as a soft limit when Redis is unavailable.
const memoryCounters = new Map<string, { count: number; resetAt: number }>();
const MEMORY_SWEEP_THRESHOLD = 5000;

function memoryHit(key: string, windowSeconds: number) {
  const now = Date.now();

  if (memoryCounters.size > MEMORY_SWEEP_THRESHOLD) {
    for (const [k, v] of memoryCounters) {
      if (v.resetAt <= now) memoryCounters.delete(k);
    }
  }

  const entry = memoryCounters.get(key);
  if (!entry || entry.resetAt <= now) {
    memoryCounters.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { count: 1, retryAfterSeconds: windowSeconds };
  }
  entry.count += 1;
  return {
    count: entry.count,
    retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

async function redisHit(key: string, windowSeconds: number) {
  const client = getRedis();
  if (!client) return null;
  try {
    const count = await client.incr(key);
    let ttl = await client.ttl(key);
    if (ttl < 0) {
      await client.expire(key, windowSeconds);
      ttl = windowSeconds;
    }
    return { count, retryAfterSeconds: Math.max(1, ttl) };
  } catch {
    return null;
  }
}

/**
 * Fixed-window rate limiter. Checks every rule and returns the longest
 * retry-after among the ones that failed.
 */
export async function checkRateLimit(
  identifier: string,
  rules: RateLimitRule[]
): Promise<RateLimitResult> {
  let retryAfterSeconds = 0;

  for (const rule of rules) {
    const key = `rl:${rule.name}:${identifier}`;
    const hit =
      (await redisHit(key, rule.windowSeconds)) ??
      memoryHit(key, rule.windowSeconds);
    if (hit.count > rule.max) {
      retryAfterSeconds = Math.max(retryAfterSeconds, hit.retryAfterSeconds);
    }
  }

  return retryAfterSeconds > 0 ? { ok: false, retryAfterSeconds } : { ok: true };
}
