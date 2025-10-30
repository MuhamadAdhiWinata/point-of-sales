const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const text = await res.text()
    let message = text
    try {
      const parsed = JSON.parse(text)
      message = parsed.message || text
    } catch {
      //
    }
    throw new Error(`HTTP ${res.status}: ${message}`)
  }

  const text = await res.text()
  if (!text) return null as T

  return JSON.parse(text) as T
}

export default {
  get: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body?: any, options?: RequestInit) =>
    request<T>(url, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body?: any, options?: RequestInit) =>
    request<T>(url, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(url: string, options?: RequestInit) =>
    request<T>(url, { ...options, method: "DELETE" }),
}
