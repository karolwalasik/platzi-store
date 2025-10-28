import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Label } from '@/shared/components/ui/Label'
import { Spinner } from '@/shared/components/ui/Spinner'
import { useLogin } from '../hooks/useLogin'
import { loginSchema, type LoginFormData } from '../types/auth.schema'

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin()

  // Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-500/10 border border-red-500/20 p-4">
          <p className="text-sm text-red-400">
            {error instanceof Error ? error.message : 'Login failed. Please try again.'}
          </p>
        </div>
      )}

      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          disabled={isPending}
          {...register('email')}
        />
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          disabled={isPending}
          {...register('password')}
        />
      </div>

      {/* Demo credentials info */}
      <div className="rounded-md bg-indigo-500/10 border border-indigo-500/20 p-4">
        <p className="text-xs text-indigo-300">
          <strong className="text-indigo-200">Demo credentials:</strong>
          <br />
          Email: john@mail.com
          <br />
          Password: changeme
        </p>
      </div>

      {/* Submit button */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Spinner size="sm" className="mr-2" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>
    </form>
  )
}

