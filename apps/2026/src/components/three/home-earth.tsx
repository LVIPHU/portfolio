'use client'

import { usePathname } from '@portfolio/i18n/navigation'
import { EarthBackground } from './earth-background'

// Canvas Earth phải là sibling của <main> (cùng lớp với StarsBackground), không nằm
// trong <main>. z-index âm của descendant bị stacking context của main nuốt — sau khi
// SkipLink thêm tabIndex={-1} lên main thì quả cầu biến thành vòng tròn mờ giữa màn
// (group chưa kịp pose) hoặc mất hẳn. Trang khác trong (main) không mount canvas này.
export function HomeEarth() {
  const pathname = usePathname()
  if (pathname !== '/') return null
  return <EarthBackground variant='hero' withStars={false} withLeva={false} />
}
