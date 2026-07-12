import type { SandpackFileMap } from './create-file-map'
import { SandpackClient } from './sandpack-client'

// C11 (D-03): server shim — KHÔNG 'use client'. remarkSandpackFiles đã gộp fence
// con thành thuộc tính `files` (JSON string) ở tầng mdast; ở đây chỉ parse rồi
// đẩy xuống client core lazy. Renderer RSC (C3) không đổi.
export function Sandpack({ files }: { files?: string }) {
  let parsed: SandpackFileMap = {}
  if (files) {
    try {
      parsed = JSON.parse(files) as SandpackFileMap
    } catch {
      parsed = {}
    }
  }
  return <SandpackClient files={parsed} />
}
