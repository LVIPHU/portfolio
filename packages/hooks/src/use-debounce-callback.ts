'use client'

import { useMemo, useRef } from 'react'

import debounce from 'lodash.debounce'

import { useUnmount } from './use-unmount'

type DebounceOptions = {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

type ControlFunctions = {
  cancel: () => void
  flush: () => void
  isPending: () => boolean
}

export type DebouncedState<T extends (...args: any) => ReturnType<T>> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) &
  ControlFunctions

export function useDebounceCallback<T extends (...args: any) => ReturnType<T>>(
  func: T,
  delay = 500,
  options?: DebounceOptions
): DebouncedState<T> {
  const funcRef = useRef(func)
  funcRef.current = func

  // Một instance duy nhất: bản cũ tạo 2 debounce (useMemo + useEffect→ref) nên unmount
  // cancel nhầm instance, isPending luôn true sau mount.
  const debounced = useMemo(() => {
    let pending = false
    const instance = debounce(
      (...args: Parameters<T>) => {
        pending = false
        return funcRef.current(...args)
      },
      delay,
      options
    )

    const wrapped = ((...args: Parameters<T>) => {
      pending = true
      return instance(...args)
    }) as DebouncedState<T>
    wrapped.cancel = () => {
      pending = false
      instance.cancel()
    }
    wrapped.flush = () => instance.flush()
    wrapped.isPending = () => pending
    return wrapped
  }, [delay, options])

  useUnmount(() => {
    debounced.cancel()
  })

  return debounced
}
