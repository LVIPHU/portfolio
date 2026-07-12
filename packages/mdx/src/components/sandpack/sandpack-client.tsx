'use client'

import dynamic from 'next/dynamic'
import type { SandpackFileMap } from './create-file-map'

// C11 (D-02 tầng 1 + D-06): sau ranh giới 'use client', dynamic ssr:false tách
// bundle Sandpack (~200KB) khỏi SSR; skeleton giữ chiều cao ~420px chống CLS.
const SandpackRoot = dynamic(() => import('./sandpack-root'), {
  ssr: false,
  loading: () => <SandpackSkeleton />,
})

function SandpackSkeleton() {
  return (
    <div
      className='bg-muted/40 my-4 animate-pulse rounded-lg border'
      style={{ height: 420 }}
      aria-hidden
      data-sandpack-skeleton
    />
  )
}

export function SandpackClient({ files }: { files: SandpackFileMap }) {
  return (
    <div className='my-4' data-sandpack>
      <SandpackRoot files={files} />
    </div>
  )
}
