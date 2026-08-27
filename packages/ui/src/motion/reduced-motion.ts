/** Tôn trọng prefers-reduced-motion — đọc 1 lần lúc setup GSAP. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
