import type { ReactNode } from 'react'

/**
 * Khung giả terminal cho output lệnh — ý tưởng học react.dev.
 * Server component, không dep mới; style qua styles.css.
 */
export function TerminalBlock({ title = 'Terminal', children }: { title?: string; children?: ReactNode }) {
  return (
    <div className='mdx-terminal'>
      <div className='mdx-terminal-bar'>
        <span className='mdx-terminal-dot' />
        <span className='mdx-terminal-dot' />
        <span className='mdx-terminal-dot' />
        <span className='mdx-terminal-title'>{title}</span>
      </div>
      <pre className='mdx-terminal-body'>{children}</pre>
    </div>
  )
}
