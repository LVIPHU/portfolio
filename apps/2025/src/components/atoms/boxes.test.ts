import { createElement } from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TOTAL_GRID } from '@/constants/boxes'

// Âm thanh chạm AudioContext (jsdom không có) → mock cả module.
// createElement thay vì JSX: pipeline test của Vitest 4 (rolldown) không transform JSX.
vi.mock('@/utils', () => ({
  initAudio: vi.fn(),
  playRandomNote: vi.fn(),
}))

import { Boxes } from './boxes'

describe('Boxes', () => {
  // Khóa hai regression đã gặp:
  //  1. Lưới bị cắt theo viewport (484/225 ô) → desktop mất dấu cộng — phải luôn đủ TOTAL_GRID.
  //  2. 3.600 nút focusable lọt vào tab order + cây a11y — lưới là trang trí, phải ẩn cả hai.
  it('luôn render đủ TOTAL_GRID ô + dấu cộng, nằm ngoài tab order lẫn cây a11y', () => {
    const { container } = render(createElement(Boxes))

    expect(container.querySelectorAll('.box-grid')).toHaveLength(TOTAL_GRID)
    expect(container.querySelectorAll('.box-grid svg')).toHaveLength(TOTAL_GRID)
    expect(container.querySelectorAll('.box-grid button')).toHaveLength(TOTAL_GRID * 4)

    // không nút nào được phép quay lại tab order
    expect(container.querySelectorAll('.box-grid button:not([tabindex="-1"])')).toHaveLength(0)
    // toàn bộ lưới nằm dưới một tổ tiên aria-hidden
    expect(container.querySelectorAll('[aria-hidden="true"] .box-grid')).toHaveLength(TOTAL_GRID)
  })
})
