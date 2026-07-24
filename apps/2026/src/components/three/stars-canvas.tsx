'use client'

import { BackgroundCanvas } from './background-canvas'
import { Stars } from './stars'

// Canvas nền chỉ chứa starfield (không Earth) cho các trang (main).
export default function StarsCanvas() {
  return (
    <BackgroundCanvas>
      <Stars />
    </BackgroundCanvas>
  )
}
