import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Chia project vì alias '@' của mỗi app trỏ vào src KHÁC NHAU — một config phẳng không gộp được.
// packages/ chạy node thuần; test component (RTL) chạy jsdom.
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'packages',
          include: ['packages/*/src/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        resolve: {
          alias: { '@': fileURLToPath(new URL('./apps/2025/src', import.meta.url)) },
        },
        // tsconfig của app đặt jsx=preserve (Next tự transform) — pipeline test thì không ai
        // transform hộ, phải ép runtime automatic ở đây.
        oxc: {
          jsx: { runtime: 'automatic' },
        },
        test: {
          name: 'web-2025',
          include: ['apps/2025/src/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
        },
      },
      {
        resolve: {
          alias: { '@': fileURLToPath(new URL('./apps/2026/src', import.meta.url)) },
        },
        test: {
          name: 'web-2026',
          include: ['apps/2026/src/**/*.test.{ts,tsx}'],
          environment: 'node',
        },
      },
    ],
  },
})
