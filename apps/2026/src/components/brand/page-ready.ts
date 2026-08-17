import { getSceneState, subscribeScene } from '@/components/three/scene-ready'

// "Trang đích đã tải xong chưa" — tấm Intro giữ màn cho tới khi hàm này resolve, nhờ vậy lúc tấm
// gold trượt đi thì trang phía sau đã đủ chữ, đủ ảnh, đủ model 3D.
//
// TRẦN CHỜ là bắt buộc: mạng hỏng giữa chừng không được phép nhốt người dùng sau tấm phủ. Hết trần
// thì cứ mở ra, thà thấy trang đang tải còn hơn thấy màn gold vĩnh viễn.
const MAX_WAIT = 8000
// Canvas mount TRỄ (next/dynamic ssr:false + chunk riêng) nên lúc Intro bắt đầu chờ thì chưa ai
// đăng ký cảnh nào. Chờ hết cửa sổ này mà vẫn không có ai đăng ký thì kết luận trang không có 3D.
const SCENE_GRACE = 600

function timeout(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Hai khung hình liên tiếp: DOM của trang mới chắc chắn đã qua ít nhất một lần paint. */
function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
}

function fontsReady(): Promise<void> {
  return document.fonts ? document.fonts.ready.then(() => undefined) : Promise.resolve()
}

/** Ảnh trong khoảng 1.5 màn đầu — dưới nữa thì lazy-load lo, chờ cả trang là chờ vô ích. */
function imagesReady(): Promise<void> {
  const limit = window.innerHeight * 1.5
  const pending = [...document.images]
    .filter((img) => !img.complete && img.getBoundingClientRect().top < limit)
    // .catch: ảnh 404 / decode lỗi KHÔNG được treo cổng chờ
    .map((img) => img.decode().catch(() => undefined))
  return Promise.all(pending).then(() => undefined)
}

/** Cảnh 3D: chờ pending về 0. Chưa ai đăng ký sau SCENE_GRACE → trang này không có canvas. */
function scenesReady(): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      const { pending, registered } = getSceneState()
      if (registered > 0 && pending === 0) {
        cleanup()
        resolve()
      }
    }
    const graceId = setTimeout(() => {
      // Hết ân hạn: không có cảnh nào đăng ký thì coi như xong; có rồi thì để `check` lo tiếp.
      if (getSceneState().registered === 0) {
        cleanup()
        resolve()
      }
    }, SCENE_GRACE)
    const unsubscribe = subscribeScene(check)
    const cleanup = () => {
      clearTimeout(graceId)
      unsubscribe()
    }
    check()
  })
}

export function waitForPageReady(): Promise<void> {
  return Promise.race([
    Promise.all([fontsReady(), imagesReady(), scenesReady(), nextPaint()]).then(() => undefined),
    timeout(MAX_WAIT),
  ])
}
