'use client'

import { useState, type ReactNode } from 'react'
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from '@codesandbox/sandpack-react'
import type { SandpackFileMap } from './create-file-map'
import { cssVarTheme } from './themes'
import { SANDPACK_HEIGHT } from './constants'

/**
 * Overlay đè iframe preview: wheel bubble → Lenis (không mất event vào cross-origin).
 * Click một lần mới “live” để tương tác sandbox; rời chuột → lại gate.
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
          onClick={() => setLive(true)}
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
      <div className='sandpack-shell overflow-hidden rounded-lg border' style={{ height: SANDPACK_HEIGHT }}>
        <SandpackLayout style={{ height: '100%' }}>
          <SandpackCodeEditor style={{ height: '100%', flex: 1 }} showLineNumbers showTabs closableTabs={false} />
          <PreviewPointerGate>
            <SandpackPreview style={{ height: '100%', flex: 1 }} showOpenInCodeSandbox={false} showRefreshButton />
          </PreviewPointerGate>
        </SandpackLayout>
      </div>
    </SandpackProvider>
  )
}
