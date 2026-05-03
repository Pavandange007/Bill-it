export interface ApiUser {
  id: string
  email: string
  createdAt: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    credentials: 'include',
  })

  if (!res.ok) {
    let body: unknown = null
    try {
      body = await res.json()
    } catch {
      // ignore
    }
    throw new Error(typeof body === 'object' && body !== null && 'error' in body ? String((body as any).error) : 'request_failed')
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

export async function signup(email: string, password: string): Promise<ApiUser> {
  const out = await request<{ user: ApiUser }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return out.user
}

export async function login(email: string, password: string): Promise<ApiUser> {
  const out = await request<{ user: ApiUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return out.user
}

export async function logout(): Promise<void> {
  await request<void>('/api/auth/logout', { method: 'POST' })
}

export async function me(): Promise<ApiUser> {
  const out = await request<{ user: ApiUser }>('/api/auth/me')
  return out.user
}

