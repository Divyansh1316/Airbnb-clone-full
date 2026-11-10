const requests = new Map<string, { count: number; resetAt: number }>();

/** Per-process fixed-window limiter. Use a shared store when running multiple instances. */
export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  let entry = requests.get(key);

  if (!entry || entry.resetAt <= now) {
    if (!entry && requests.size >= 10_000) {
      for (const [storedKey, storedEntry] of requests) {
        if (storedEntry.resetAt <= now) requests.delete(storedKey);
      }
      if (requests.size >= 10_000) {
        return { allowed: false, retryAfter: Math.ceil(windowMs / 1000) };
      }
    }

    entry = { count: 0, resetAt: now + windowMs };
    requests.set(key, entry);
  }

  entry.count += 1;

  return {
    allowed: entry.count <= limit,
    retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

export function getClientKey(request: Request) {
  // In production, only trust this header when the hosting proxy overwrites it.
  const forwardedFor = request.headers.get("x-forwarded-for");
  const address = forwardedFor?.split(",")[0]?.trim() || "unknown";
  return address.slice(0, 128);
}
