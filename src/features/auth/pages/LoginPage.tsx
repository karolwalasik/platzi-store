import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { authService } from '../services/auth-service'

export default function LoginPage() {
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        {/* Card wrapper */}
        <div className="rounded-xl bg-slate-900/50 p-8 shadow-2xl border border-slate-800 backdrop-blur-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-2xl shadow-indigo-500/50">
              <span className="text-3xl font-bold text-white">P</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-400">Sign in to your account to continue</p>
          </div>

          {/* Login form */}
          <LoginForm />

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Platzi Fake Store Demo Application
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

