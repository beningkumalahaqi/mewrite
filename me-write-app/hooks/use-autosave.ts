"use client"

import { useCallback, useEffect, useRef } from 'react'

interface UseAutosaveOptions {
  onSave: () => void | Promise<void>
  delay?: number
  enabled?: boolean
}

export function useAutosave({ onSave, delay = 2000, enabled = true }: UseAutosaveOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onSaveRef = useRef(onSave)
  onSaveRef.current = onSave

  const scheduleSave = useCallback(() => {
    if (!enabled) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onSaveRef.current()
      timerRef.current = null
    }, delay)
  }, [delay, enabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { scheduleSave }
}
