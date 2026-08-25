// src/lib/api.ts
import axios from 'axios'

export const TOKEN_KEY = 'lf_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://api.lightforth.ai',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/v3/auth/sign-in'
    }
    return Promise.reject(error)
  },
)

export default api
