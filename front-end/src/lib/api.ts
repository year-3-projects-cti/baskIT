const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

type RequestOptions = RequestInit & { skipJson?: boolean };

export async function apiRequest<T>(path: string, options: RequestOptions = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  const hasBody = options.body !== undefined && options.body !== null;
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = "A apărut o eroare. Încearcă din nou.";
    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (options.skipJson || response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export { API_BASE_URL };
