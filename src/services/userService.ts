import api from "./api"

export interface IUser {
  id?: number
  nama: string
  email: string
  password: string
  no_hp?: string
  alamat?: string
  role: string
  status?: string
  created_at?: string
  updated_at?: string
}

export interface UserResponse {
  success: boolean
  message: string
  data: IUser[]
}

export async function getUsers(): Promise<UserResponse> {
  return api.get<UserResponse>("/user")
}

export async function createUser(payload: IUser) {
  return api.post("/user", payload)
}

export async function updateUser(id: number, payload: Partial<IUser>) {
  return api.put(`/user/${id}`, payload)
}

export async function deleteUser(id: number) {
  return api.delete(`/user/${id}`)
}

export async function getUserById(id: number) {
  return api.get<IUser>(`/user/${id}`)
}
