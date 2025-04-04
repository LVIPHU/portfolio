import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from '@/hooks/use-isomorphic-layout-effect'

export function useUnmount(func: () => void) {
  const funcRef = useRef(func)

  funcRef.current = func

  useIsomorphicLayoutEffect(
    () => () => {
      funcRef.current()
    },
    []
  )
}
