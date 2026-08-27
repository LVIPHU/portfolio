'use client'

import type { MouseEvent } from 'react'
import { useLenis } from 'lenis/react'

// Lenis nuốt hash navigation: <a href="#main"> đổi URL nhưng scrollY đứng 0, và #main không
// focus được nếu thiếu tabindex. Click/Enter phải tự scroll + nhường tiêu điểm vào <main>
// để Tab tiếp theo vào nội dung, bỏ qua nút Menu.
export function SkipLink({ label }: { label: string }) {
  const lenis = useLenis()

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    const main = document.getElementById('main')
    if (!main) return
    e.preventDefault()
    main.focus({ preventScroll: true })
    if (lenis) lenis.scrollTo(main)
    else main.scrollIntoView()
  }

  return (
    <a href='#main' className='skip-link' onClick={onClick}>
      {label}
    </a>
  )
}
