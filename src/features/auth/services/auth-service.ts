import type { AuthTokens } from '../types/auth.types'

class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token'
  private readonly REFRESH_TOKEN_KEY = 'refresh_token'
  private refreshPromise: Promise<string> | null = null

  setTokens(tokens: AuthTokens): void {
    // Access token in sessionStorage (cleared on tab close)
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access_token)
    
    // Refresh token in localStorage (persists across sessions)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh_token)
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  clearTokens(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken() || !!this.getRefreshToken()
  }

  // Setter for refresh promise (used by API client)
  setRefreshPromise(promise: Promise<string> | null): void {
    this.refreshPromise = promise
  }

  getRefreshPromise(): Promise<string> | null {
    return this.refreshPromise
  }
}

export const authService = new AuthService()

