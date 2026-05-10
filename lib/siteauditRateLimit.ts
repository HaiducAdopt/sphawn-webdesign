type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;

export function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }

  return realIp ?? "unknown";
}

export function checkSiteAuditRateLimit(identifier: string) {
  const now = Date.now();
  const current = store.get(identifier);

  if (!current || current.resetAt < now) {
    store.set(identifier, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });

    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: now + WINDOW_MS,
    };
  }

  if (current.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  store.set(identifier, current);

  return {
    allowed: true,
    remaining: MAX_REQUESTS - current.count,
    resetAt: current.resetAt,
  };
}