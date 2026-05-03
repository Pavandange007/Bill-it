import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export function LoginPage(): React.JSX.Element {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')
  const [error, setError] = React.useState<string>('')
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900">
      <div className="mx-auto grid max-w-md place-items-center px-4 py-10">
        <div className="w-full rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-lg font-bold">Login</div>
          <div className="mt-1 text-sm text-zinc-600">Sign in to access the POS.</div>

          {error ? <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div> : null}

          <form
            className="mt-4 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault()
              setError('')
              setIsSubmitting(true)
              try {
                await login(email, password)
                const to = (location.state as any)?.from?.pathname ?? '/'
                navigate(to, { replace: true })
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Login failed')
              } finally {
                setIsSubmitting(false)
              }
            }}
          >
            <label className="block">
              <div className="mb-1 text-xs font-semibold text-zinc-700">Email</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                required
              />
            </label>

            <label className="block">
              <div className="mb-1 text-xs font-semibold text-zinc-700">Password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
                required
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 text-sm text-zinc-600">
            No account?{' '}
            <Link to="/signup" className="font-semibold text-zinc-900 underline underline-offset-4">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

