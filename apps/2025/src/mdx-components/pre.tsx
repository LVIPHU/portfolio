'use client'

import { type ReactNode } from 'react'
import { CopyCodeButton } from './copy-code-button'

export function Pre({ children }: { children: ReactNode }) {
  return (
    <div id={'code-custom'} className='relative overflow-hidden rounded-lg border border-gray-50 dark:border-gray-800'>
      <CopyCodeButton parent='code-block' className='absolute right-0 top-0 hidden lg:inline-block' />
      <pre className='bg-solarized-light text-code-block dark:bg-github-dark-dimmed'>{children}</pre>
    </div>
  )
}
