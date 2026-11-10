const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api').replace(/\/$/, '')
export const TOKEN_KEY = 'aquasense:token'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY)
  const res = await fetch(`${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (!res.ok) {
    const corpo = await res.json().catch(() => null)
    throw new ApiError(res.status, corpo?.message ?? corpo?.erro ?? `Erro ${res.status} ao acessar ${path}`)
  }

  if (res.status === 204) return undefined as T
  const texto = await res.text()
  return (texto ? JSON.parse(texto) : undefined) as T
}

export async function apiArquivo(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY)

  const res = await fetch(
    `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`,
    {
      ...options,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    },
  )

  if (!res.ok) {
    const corpo = await res.json().catch(() => null)

    throw new ApiError(
      res.status,
      corpo?.message ??
        corpo?.erro ??
        `Erro ${res.status} ao acessar ${path}`,
    )
  }

  return res
}
