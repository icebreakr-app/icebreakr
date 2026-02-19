type Bucket = {
  count: number;
  resetAt: number;
};

type LimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

const store = new Map<string, Bucket>();

export function checkRateLimit(key: string, limit: number, windowMs: number): LimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || now > existing.resetAt) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      resetAt,
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    resetAt: existing.resetAt,
  };
}
