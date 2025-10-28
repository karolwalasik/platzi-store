import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { authService } from '@/features/auth/services/auth-service'
import { authApi } from '@/features/auth/services/auth-api'


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.escuelajs.co/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor - dodaj access token do każdego requestu
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getAccessToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle 401 i auto-refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }


    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      try {
    
        let refreshPromise = authService.getRefreshPromise()

        if (!refreshPromise) {
          const refreshToken = authService.getRefreshToken()

          if (!refreshToken) {
            // Brak refresh tokenu - wyloguj użytkownika
            authService.clearTokens()
            window.location.href = '/login'
            return Promise.reject(error)
          }

          // Utwórz nowy refresh promise
          refreshPromise = authApi
            .refreshToken(refreshToken)
            .then((response) => {
              authService.setTokens({
                access_token: response.access_token,
                refresh_token: response.refresh_token,
              })
              return response.access_token
            })
            .catch((refreshError) => {
              // Refresh failed - wyloguj użytkownika
              authService.clearTokens()
              window.location.href = '/login'
              throw refreshError
            })
            .finally(() => {
              // Clear refresh promise po zakończeniu
              authService.setRefreshPromise(null)
            })

          authService.setRefreshPromise(refreshPromise)
        }

        // Poczekaj na nowy token
        const newAccessToken = await refreshPromise

        // Retry original request z nowym tokenem
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        }

        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api

