// All API calls route through /proxy which Next.js rewrites to the configured API base URL.
// This avoids CORS issues when running Next.js on a different port than the API.
const API_PREFIX = "/proxy";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_PREFIX}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, `API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export function getSSEUrl(): string {
  return `${API_PREFIX}/api/events`;
}
