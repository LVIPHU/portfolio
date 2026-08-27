import { describe, expect, it, vi } from 'vitest'
import { getSceneState, markSceneReady, registerScene, subscribeScene, unregisterScene } from './scene-ready'

// Store module-scope, không có API reset (thêm chỉ để test là phình bề mặt) —
// mỗi test dùng id riêng và tự unregister để không rò state sang test khác.

describe('scene-ready', () => {
  it('đếm pending theo cảnh đã đăng ký nhưng chưa ready', () => {
    registerScene('a')
    expect(getSceneState()).toEqual({ registered: 1, pending: 1 })
    markSceneReady('a')
    expect(getSceneState()).toEqual({ registered: 1, pending: 0 })
    unregisterScene('a')
  })

  it('idempotent theo id — StrictMode gọi effect hai lần không làm lệch bộ đếm', () => {
    registerScene('b')
    registerScene('b')
    markSceneReady('b')
    markSceneReady('b')
    expect(getSceneState()).toEqual({ registered: 1, pending: 0 })
    unregisterScene('b')
  })

  it('mark TRƯỚC register vẫn đúng (effect con trong Suspense chạy trước cha)', () => {
    markSceneReady('c')
    registerScene('c')
    expect(getSceneState()).toEqual({ registered: 1, pending: 0 })
    unregisterScene('c')
  })

  it('unregister quên hẳn cảnh — kể cả trạng thái ready cũ', () => {
    registerScene('d')
    markSceneReady('d')
    unregisterScene('d')
    expect(getSceneState()).toEqual({ registered: 0, pending: 0 })
    // đăng ký lại thì phải chờ lại từ đầu, không ăn ké ready của vòng trước
    registerScene('d')
    expect(getSceneState()).toEqual({ registered: 1, pending: 1 })
    unregisterScene('d')
  })

  it('subscribe nhận thông báo mỗi thay đổi và huỷ được', () => {
    const fn = vi.fn()
    const unsubscribe = subscribeScene(fn)
    registerScene('e')
    markSceneReady('e')
    expect(fn).toHaveBeenCalledTimes(2)
    unsubscribe()
    unregisterScene('e')
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
