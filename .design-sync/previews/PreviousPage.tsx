import { PreviousPage } from 'web-2025'

// Nav cuối trang chi tiết: Separator + nút ghost "Go back" (Trans đã shim về
// children, router.back là no-op trong preview).
export const GoBack = () => (
  <div style={{ maxWidth: 560 }}>
    <PreviousPage />
  </div>
)
