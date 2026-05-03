import React from 'react'
import { useAuth } from '../auth/AuthProvider'
import { PosApp } from '../pos/PosApp'

export function PosPage(): React.JSX.Element {
  const { logout, user } = useAuth()

  return (
    <div>
      <div className="print-hidden border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <div className="text-xs text-zinc-600">Signed in as {user?.email}</div>
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50"
          >
            Logout
          </button>
        </div>
      </div>
      <PosApp />
    </div>
  )
}

