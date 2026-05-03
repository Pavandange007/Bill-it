import React from 'react'

function safeParseJson<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T
  } catch (err) {
    if (err instanceof SyntaxError) return null
    return null
  }
}

export function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = React.useState<T>(() => {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return defaultValue
    const parsed = safeParseJson<T>(raw)
    return parsed ?? defaultValue
  })

  React.useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      if (err instanceof DOMException) return
    }
  }, [key, value])

  return [value, setValue]
}

