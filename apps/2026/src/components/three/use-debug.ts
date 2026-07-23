'use client'

import { useEffect, useState } from 'react'

// Bật panel debug (leva + stats) khi URL có ?debug (vd /about?debug).
export function useDebug() {
  const [debug, setDebug] = useState(false)
  useEffect(() => {
    const check = () => setDebug(new URLSearchParams(window.location.search).has('debug'))
    check()
    window.addEventListener('popstate', check)
    return () => window.removeEventListener('popstate', check)
  }, [])
  return debug
}
