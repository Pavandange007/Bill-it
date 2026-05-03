import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export function ProtectedRoute({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-dvh grid place-items-center bg-zinc-50 text-zinc-900">
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold">Loading…</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

