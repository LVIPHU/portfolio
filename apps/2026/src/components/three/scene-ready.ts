// Cổng báo "cảnh 3D đã tải xong asset" cho tấm Intro.
//
// Vì sao KHÔNG dùng useProgress của drei: nó là store zustand móc vào THREE.DefaultLoadingManager,
// tức bên đọc phải import @react-three/drei (kéo theo three). Intro chạy ở MỌI route và nằm trong
// bundle chính, còn three/drei đang gọn trong chunk lazy của canvas (next/dynamic ssr:false) —
// import vào là lôi cả three ra bundle chính. Store này thay thế: không phụ thuộc gói nào.
//
// API theo ID chứ không theo token, vì hai lý do đã cắn thật:
//   1. StrictMode ở dev gọi initializer/effect hai lần → API kiểu "đếm lên/đếm xuống" bị lệch,
//      `pending` kẹt ở 1 và Intro treo tới trần 8s (đo được: intro-out ở 10.5s thay vì ~2.9s).
//      Set theo id thì gọi bao nhiêu lần cũng như một.
//   2. Thứ tự effect của React là CON TRƯỚC CHA: mảnh báo-xong nằm trong <Suspense> (con) có thể
//      chạy trước lúc cha kịp đăng ký. Ghi nhận cả hai vế vào Set nên vế nào tới trước cũng đúng.
//
// Vòng đời: EarthBackground gọi registerScene('earth') khi mount; phần đã resolve bên trong
// <Suspense> gọi markSceneReady('earth') — Suspense resolve nghĩa là useGLTF/useTexture đã xong,
// đúng thứ Intro cần chờ. Trang không có canvas thì không ai đăng ký, bên đọc tự xử bằng cửa sổ
// ân hạn (xem brand/page-ready.ts).

/** Chỉ có đúng một cảnh 3D mỗi trang (quả cầu Earth) — id hằng, không cần sinh động. */
export const SCENE_EARTH = 'earth'

const expected = new Set<string>()
const ready = new Set<string>()
const listeners = new Set<() => void>()

function emit() {
  for (const fn of listeners) fn()
}

export function getSceneState(): { registered: number; pending: number } {
  let pending = 0
  for (const id of expected) if (!ready.has(id)) pending++
  return { registered: expected.size, pending }
}

export function subscribeScene(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function registerScene(id: string) {
  expected.add(id)
  emit()
}

export function markSceneReady(id: string) {
  ready.add(id)
  emit()
}

/** Canvas rời màn (đổi route): quên hẳn cảnh đó đi, đừng bắt trang sau chờ nó. */
export function unregisterScene(id: string) {
  expected.delete(id)
  ready.delete(id)
  emit()
}
