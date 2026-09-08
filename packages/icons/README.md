# `@portfolio/icons`

SVG brand/social/tech + lucide animated (GSAP). Hai app và `@portfolio/ui` / `@portfolio/mdx` import từ đây — không import `lucide-react` trực tiếp.

## Lucide GSAP

Nguồn glyph: lucide-react. Nguồn motion gốc: [lucide-animated](https://lucide-animated.com/r/<kebab>.json) (404 thì [animateicons.in](https://animateicons.in/icons/lucide)). Viết lại bằng GSAP; **không** thêm `motion` / `framer-motion`.

Tái sinh file: `node packages/icons/scripts/gen-lucide.mjs` (cả animated lẫn `@portfolio/icons/lucide/static`).

`@portfolio/ui` và `@portfolio/mdx` import **static** (không GSAP, RSC-safe). Chrome app import `./lucide` animated.

### Hai bẫy

1. **`pathLength`** — motion tween `pathLength` sẵn. GSAP tương đương là `DrawSVGPlugin` (Club, không có trong repo). Cách miễn phí: trong `useGSAP` gọi `path.getTotalLength()` rồi tween `strokeDasharray` / `strokeDashoffset`.
2. **Ease** — không đọc token `--ease-*` của app (chrome dùng chung hai site).

| motion                            | GSAP            |
| --------------------------------- | --------------- |
| `[0.4, 0, 0.2, 1]` (cubic-bezier) | `power2.inOut`  |
| spring                            | `back.out(1.4)` |

`prefers-reduced-motion: reduce` → không tạo timeline, icon tĩnh. `size` mặc định **24** (bằng lucide-react, không phải 28 của lucide-animated).

Handle: `{ startAnimation, stopAnimation }` — hover `play()` / `reverse()`, vẫn gọi `onMouseEnter` / `onMouseLeave` của caller.
