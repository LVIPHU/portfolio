/** jsdom không có matchMedia — GSAP `matchMedia` chỉ gọi `attach()` khi `no-preference` khớp. */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: /prefers-reduced-motion:\s*no-preference/.test(query),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false
    },
  }),
})
