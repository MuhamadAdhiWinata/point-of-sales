export interface IUser {
  id: number
  nama: string
  email: string
  no_hp?: string
  alamat?: string
  role: string
  status?: string
  created_at?: string
  updated_at?: string
}

export interface UserResponse {
  count?: number
  data: IUser[]
}

export interface CreateUserPayload {
  nama: string
  email: string
  password: string
  no_hp?: string
  alamat?: string
  role: string
  status?: string
}

export interface UpdateUserPayload {
  nama?: string
  email?: string
  password?: string
  no_hp?: string
  alamat?: string
  role?: string
  status?: string
}
