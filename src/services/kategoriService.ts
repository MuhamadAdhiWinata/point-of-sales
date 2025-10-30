import api from "./api"

export interface IKategori {
  id?: number
  nama: string
  status?: string
  created_at?: string
  updated_at?: string
}

export interface KategoriResponse {
  success: boolean
  message: string
  data: IKategori[]
}

export async function getKategoris(): Promise<KategoriResponse> {
  return api.get<KategoriResponse>("/kategori")
}

export async function createKategori(payload: IKategori) {
  return api.post("/kategori", payload)
}

export async function updateKategori(id: number, payload: Partial<IKategori>) {
  return api.put(`/kategori/${id}`, payload)
}

export async function deleteKategori(id: number) {
  return api.delete(`/kategori/${id}`)
}

export async function getKategoriById(id: number) {
  return api.get<IKategori>(`/kategori/${id}`)
}
