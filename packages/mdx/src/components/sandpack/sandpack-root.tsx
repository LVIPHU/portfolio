'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from '@codesandbox/sandpack-react'
import type { SandpackFileMap } from './create-file-map'
import { cssVarTheme } from './themes'
import { SANDPACK_HEIGHT } from './constants'

/**
 * Overlay đè iframe preview: wheel bubble → Lenis (không mất event vào cross-origin).
 *
 * Mở bằng HOVER chứ KHÔNG phải click: bản click nuốt luôn cú bấm đầu tiên — bài playground-demo
 * bảo người đọc "bấm vào nút" mà lần bấm đầu không ăn gì, nút Refresh của sandpack cũng nằm trong
 * vùng bị phủ, và onMouseLeave re-arm nên mỗi lần đưa chuột ra rồi vào lại là mất thêm một cú nữa.
 * Chuột chưa tới preview thì gate vẫn còn, nên wheel lướt qua vùng đó vẫn về Lenis.
 */
function PreviewPointerGate({ children }: { children: ReactNode }) {
  const [live, setLive] = useState(false)

  return (
    <div className='relative min-w-0' style={{ height: '100%', flex: 1 }} onMouseLeave={() => setLive(false)}>
      {children}
      {!live ? (
        <div
          aria-hidden
          data-sandpack-preview-gate
          className='absolute inset-0 z-10'
          style={{ cursor: 'auto' }}
          onPointerEnter={() => setLive(true)}
        />
      ) : null}
    </div>
  )
}

// C11: chunk NẶNG tách riêng (chỉ tải khi dynamic import ở sandpack-client kích hoạt).
// initMode lazy + rootMargin 1400px (số react.dev, D-02 tầng 2): sandbox chỉ
// boot khi cuộn gần block, không boot ngay khi vào trang.
export default function SandpackRoot({ files }: { files: SandpackFileMap }) {
  return (
    <SandpackProvider
      template='react'
      theme={cssVarTheme}
      files={files}
      options={{
        initMode: 'user-visible',
        initModeObserverOptions: { rootMargin: '1400px 0px' },
      }}
    >
      {/* Chiều cao đi qua BIẾN CSS: hai pane BẮT BUỘC phải đặt height inline (luật của sandpack cho
          .sp-stack thắng luật của ta trong cascade — bỏ inline ra là pane editor rơi về 300px mặc
          định của nó), mà inline thì media query không với tới. Nên inline trỏ vào biến, còn
          styles.css đổi giá trị biến theo breakpoint. */}
      <div
        className='sandpack-shell overflow-hidden rounded-lg border'
        style={{ '--sandpack-height': `${SANDPACK_HEIGHT}px` } as CSSProperties}
      >
        <SandpackLayout>
          {/* data-lenis-prevent CHỈ ở pane editor: lenis 1.3.25 (lenis.mjs:607) nhả wheel cho trình
              duyệt khi thấy attribute này trên composedPath, không thấy thì preventDefault (:625) —
              mà `allowNestedScroll` không bật. Bỏ nó khỏi cả khối (để wheel trên preview bubble lên
              lenis) làm luôn editor hết cuộn nội bộ: đoạn code dài hơn ~18 dòng vừa bị shell 420px
              cắt vừa không lăn chuột tới được. */}
          <SandpackCodeEditor
            data-lenis-prevent
            style={{ height: 'var(--sandpack-pane-height)', flex: 1 }}
            showLineNumbers
            showTabs
            closableTabs={false}
          />
          <PreviewPointerGate>
            <SandpackPreview
              style={{ height: 'var(--sandpack-pane-height)', flex: 1 }}
              showOpenInCodeSandbox={false}
              showRefreshButton
            />
          </PreviewPointerGate>
        </SandpackLayout>
      </div>
    </SandpackProvider>
  )
}
