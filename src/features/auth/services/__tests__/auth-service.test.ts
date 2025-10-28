import { describe, it, expect, beforeEach } from 'vitest'
import { authService } from '../auth-service'

describe('AuthService', () => {
  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  describe('Token Management', () => {
    it('should store tokens correctly', () => {
      const tokens = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
      }
      
      authService.setTokens(tokens)
      
      expect(authService.getAccessToken()).toBe(tokens.access_token)
      expect(authService.getRefreshToken()).toBe(tokens.refresh_token)
    })

    it('should store access token in sessionStorage', () => {
      const tokens = {
        access_token: 'test-access',
        refresh_token: 'test-refresh',
      }
      
      authService.setTokens(tokens)
      expect(sessionStorage.getItem('access_token')).toBe(tokens.access_token)
    })

    it('should store refresh token in localStorage', () => {
      const tokens = {
        access_token: 'test-access',
        refresh_token: 'test-refresh',
      }
      
      authService.setTokens(tokens)
      expect(localStorage.getItem('refresh_token')).toBe(tokens.refresh_token)
    })

    it('should clear both tokens', () => {
      authService.setTokens({
        access_token: 'access',
        refresh_token: 'refresh',
      })
      
      authService.clearTokens()
      
      expect(authService.getAccessToken()).toBeNull()
      expect(authService.getRefreshToken()).toBeNull()
    })
  })

  describe('Authentication Status', () => {
    it('should return false when no tokens', () => {
      expect(authService.isAuthenticated()).toBe(false)
    })

    it('should return true when tokens exist', () => {
      authService.setTokens({
        access_token: 'test-token',
        refresh_token: 'refresh-token',
      })
      expect(authService.isAuthenticated()).toBe(true)
    })
  })
})

