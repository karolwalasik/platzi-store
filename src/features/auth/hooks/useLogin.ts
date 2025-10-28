import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/auth-api'
import { authService } from '../services/auth-service'
import type { LoginCredentials } from '../types/auth.types'

export function useLogin() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    
    onSuccess: (data) => {
      // save tokens in storage
      authService.setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      })
      
      
      navigate('/', { replace: true })
    },
    
    // onError handled in component
  })
}

