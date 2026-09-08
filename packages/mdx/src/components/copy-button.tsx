'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from '@portfolio/icons/lucide/static'

/**
 * Island client DUY NHẤT của package (D-10). Tìm <pre> gần nhất trong
 * wrapper [data-mdx-pre] và copy textContent.
 */
export function CopyButton() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  function handleCopy(e: React.MouseEvent<HTMLButtonElement>) {
    const pre = e.currentTarget.closest('[data-mdx-pre]')?.querySelector('pre')
    if (!pre?.textContent) return
    void navigator.clipboard.writeText(pre.textContent)
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button type='button' aria-label='Copy code' className='mdx-copy-button' data-copied={copied} onClick={handleCopy}>
      {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
    </button>
  )
}
