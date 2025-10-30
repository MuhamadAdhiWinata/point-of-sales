import api from "./api"

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  nama: string
  email: string
  password: string
  no_hp?: string
  alamat?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    id: number
    nama: string
    email: string
    role: string
    status: string
  }
}

// Local Storage Keys
const AUTH_USER_KEY = 'auth_user'
const AUTH_TOKEN_KEY = 'auth_token'

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", payload)
  
  // Simpan user data ke localStorage
  if (response.data && response.data) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(response.data))
    // Untuk future JWT implementation
    if (response.data) {
      localStorage.setItem(AUTH_TOKEN_KEY, 'temp-token')
    }
  }
  
  return response
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", payload)
  return response
}

export function logout() {
  localStorage.removeItem(AUTH_USER_KEY)
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function getAuthUser() {
  const userStr = localStorage.getItem(AUTH_USER_KEY)
  if (userStr) {
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }
  return null
}

export function isAuthenticated(): boolean {
  return !!getAuthUser()
}