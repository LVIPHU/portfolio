'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import { usePathname } from '@portfolio/i18n/navigation'
import { FelixFLX, FelixEI } from './felix-mark'
import { waitForPageReady } from './page-ready'
import { blockScrollKeys } from '@/components/scroll/scroll-lock'
import s from './intro.module.css'

// Intro kiểu lenis: tấm phủ gold, chữ FELIX đen trượt lên so le, E/I trồi lên ghép vào F-L-X
// thành chữ hoàn chỉnh, rồi cả tấm trượt khỏi màn hình.
//
// Nó KIÊM LUÔN cổng chờ tải: tấm chỉ mở ra khi (a) đã chạy đủ nhịp tối thiểu và (b)
// waitForPageReady() báo trang đích đã có đủ font/ảnh/model 3D. Trang nhẹ thì (a) quyết định,
// trang nặng thì (b) — nên sau intro trang luôn hiện đầy đủ, không còn cảnh quả cầu bật ra sau.
//
// QUAN TRỌNG — overlay nằm NGAY TRONG HTML server trả về (không chờ hydrate): nếu chỉ mount sau
// khi client chạy thì người dùng thấy nội dung trang trước rồi tấm gold mới nhảy vào. Việc bỏ qua
// (reduced-motion) do CSS lo — KHÔNG dùng class trên <html> trước paint vì React hydration xoá
// sạch class gắn kiểu đó.
//
// Mount MỘT lần ở [locale]/layout.tsx và chạy lại theo từng lần đổi pathname.

// Nhịp: phủ + vạch chờ chạy → (≥1000ms VÀ trang đích sẵn sàng) → chữ trượt vào 1500ms → E/I ghép
// ở +1900 → tấm trượt đi (CSS trễ đúng --intro-dur rồi chạy 1500ms) → nhả ở +3600.
// MỌI route đều chạy bản đầy đủ này, kể cả điều hướng trong site — user chốt như vậy.
const TIMING = { hold: 1000, join: 1900, release: 3600 }

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export function Intro() {
  const lenis = useLenis()
  // lenis đến MUỘN hơn effect đầu của Intro (ReactLenis set context trong effect cha).
  // Mọi chỗ nhả khoá phải đọc qua ref — closure bắt lenis=undefined từng gây kẹt cuộn.
  const lenisRef = useRef(lenis)
  lenisRef.current = lenis
  const pathname = usePathname()

  const [isLoaded, setIsLoaded] = useState(false)
  const [introOut, setIntroOut] = useState(false)
  const [done, setDone] = useState(false)

  // Mỗi lần đổi route là một "run"; mọi timer/promise của run cũ phải tự vô hiệu khi run mới bắt
  // đầu — nếu không, release() của lượt trước sẽ gỡ class ngay giữa lượt sau.
  const runRef = useRef(0)
  const releasedRef = useRef(false)

  // nhả khoá + gỡ overlay. Gọi được nhiều lần (transitionEnd + timer dự phòng) — bắt buộc có
  // fallback, nếu transition không bắn thì trang sẽ kẹt không cuộn được.
  const release = () => {
    if (releasedRef.current) return
    releasedRef.current = true
    const run = runRef.current
    lenisRef.current?.start()
    setDone(true)
    // Gỡ class trạng thái sau khi transition ghép của hero chắc chắn xong — không để state intro
    // rò rỉ vĩnh viễn trên <html>. Chỉ gỡ nếu CHƯA có run mới (đổi route ngay sau khi lộ trang).
    setTimeout(() => {
      if (runRef.current !== run) return
      document.documentElement.classList.remove('intro-running', 'intro-out')
    }, 1600)
  }

  // useLayoutEffect chứ không useEffect: usePathname() chỉ đổi SAU khi trang mới đã commit, nên
  // tấm phủ phải kín NGAY trong khung hình đó. Chờ tới useEffect là người dùng kịp thấy trang mới
  // lúc chưa tải xong.
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      releasedRef.current = true
      setDone(true)
      return
    }

    const run = ++runRef.current
    const alive = () => runRef.current === run

    releasedRef.current = false
    setDone(false)
    setIsLoaded(false)
    setIntroOut(false)

    const html = document.documentElement
    html.classList.add('intro-running')
    html.classList.remove('intro-out')
    lenisRef.current?.stop()

    // Mở ra khi CẢ HAI xong: nhịp tối thiểu và trang đích đã sẵn sàng. Trong lúc chờ, tấm gold
    // KHÔNG để trống trơn — vạch chờ ở đáy tự chạy bằng CSS (xem .loader).
    Promise.all([sleep(TIMING.hold), waitForPageReady()]).then(() => {
      if (!alive()) return
      setIsLoaded(true)
    })

    return () => {
      // Unmount/đổi route TRƯỚC khi release() kịp chạy (vd nhấn Back giữa intro): transitionEnd
      // không bao giờ bắn vì wrapper đã unmount, timer thì bị clear — không còn đường nào gỡ
      // class. Mà class kẹt là kẹt CẢ SESSION: BackgroundCanvas đọc intro-running sẽ ghim
      // frameloop='never' vĩnh viễn (ultrareview bug_003). Chốt an toàn cuối; chỉ dọn khi KHÔNG
      // có run mới nối tiếp.
      if (runRef.current !== run) return
      lenisRef.current?.start()
      html.classList.remove('intro-running', 'intro-out')
    }
  }, [pathname])

  // Chặn Tab + phím cuộn suốt intro. Tab: tấm phủ che kín màn nhưng nội dung phía sau vẫn focus
  // được, người dùng bàn phím sẽ tab vào control vô hình (WCAG focus-not-obscured). Phím cuộn:
  // lenis chỉ chặn wheel/touch, còn `overflow: clip` của nó đã bị trung hoà (native-scrollbar.css)
  // để thanh cuộn không biến mất — nên phần bàn phím phải tự lo.
  useEffect(() => {
    if (done) return
    return blockScrollKeys(true)
  }, [done])

  // Chữ trượt vào xong → E/I trồi lên ghép; rồi nhả. Mốc tính từ isLoaded (thời điểm bắt đầu
  // choreography) chứ không từ lúc mount — vì cổng chờ tài nguyên có thể kéo dài bao lâu tuỳ mạng.
  useEffect(() => {
    if (!isLoaded || done) return
    const timers = [setTimeout(() => setIntroOut(true), TIMING.join), setTimeout(release, TIMING.release)]
    return () => timers.forEach(clearTimeout)
    // release/setIntroOut ổn định theo run; phụ thuộc thêm chỉ tổ khởi động lại timer giữa chừng
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, done])

  useEffect(() => {
    if (!introOut) return
    document.documentElement.classList.add('intro-out')
  }, [introOut])

  // Khoá cuộn khi lenis SẴN SÀNG, không phải lúc layout effect chạy: ReactLenis set context ở
  // effect của component cha nên lượt đầu tiên `lenisRef.current` còn undefined và stop() rơi vào
  // khoảng không — đo được: lần tải đầu `lenis-stopped` không hề xuất hiện, trang phía sau tấm gold
  // vẫn cuộn được. Effect này chạy lại khi lenis xuất hiện nên bịt đúng khe đó.
  useEffect(() => {
    if (done || !lenis) return
    lenis.stop()
    return () => lenis.start()
  }, [done, lenis])

  if (done) return null

  return (
    <div
      className={`${s.wrapper} ${isLoaded ? s.out : ''}`}
      aria-hidden
      onTransitionEnd={(e) => {
        // tấm phủ báo kết thúc → nhả scroll; path chữ báo kết thúc → tới pha ghép E/I
        if (e.target === e.currentTarget) release()
        else if ((e.target as Element).tagName === 'path') setIntroOut(true)
      }}
    >
      <div className={`${s.inner} ${isLoaded ? s.relative : ''}`}>
        <FelixFLX
          fill='var(--color-black, #000)'
          isLoaded={isLoaded}
          className={s.mark}
          letterClassName={s.start}
          showClassName={s.show}
        />
        <FelixEI
          fill='var(--color-black, #000)'
          isLoaded={isLoaded}
          className={`${s.mark} ${introOut ? s.translate : ''}`}
          letterClassName={s.start}
          showClassName={s.show}
        />
      </div>
      {/* Vạch chờ: chạy suốt lúc cổng chờ tài nguyên còn giữ màn (trước đây chỗ này là tấm gold
          trống trơn, tải chậm là đứng hình mấy giây). Tự tắt khi chữ bắt đầu trượt vào. */}
      <div className={`${s.loader} ${isLoaded ? s.loaderDone : ''}`} />
    </div>
  )
}
