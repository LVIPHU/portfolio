'use client'

import { SandpackProvider, SandpackCodeEditor, SandpackPreview } from '@codesandbox/sandpack-react'
import type { SandpackFileMap } from './create-file-map'
import { cssVarTheme } from './themes'

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
      <div className='sandpack-shell overflow-hidden rounded-lg border'>
        <SandpackCodeEditor showLineNumbers showTabs closableTabs={false} />
        <SandpackPreview showOpenInCodeSandbox={false} showRefreshButton />
      </div>
    </SandpackProvider>
  )
}
