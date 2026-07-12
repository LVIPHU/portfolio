import reactHooks from 'eslint-plugin-react-hooks'
import tsParser from '@typescript-eslint/parser'

// C10 (D-02, M-01): flat config root, CHỈ rules của eslint-plugin-react-hooks
// (preset recommended-latest đã gộp rules React Compiler) — ép Rules of React.
// @typescript-eslint/parser chỉ để PARSE .ts/.tsx (không kèm rule TS nào).
// Không kéo lại eslint-config-next (gỡ ở C7).
export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/public/**',
      '**/dist/**',
      '**/.turbo/**',
      'ds-bundle/**', // design-sync bundle sinh tự động (C12 dọn)
      '**/.ds-css/**',
    ],
  },
  {
    files: ['apps/**/src/**/*.{ts,tsx}', 'packages/**/src/**/*.{ts,tsx}'],
    // v7: preset flat nằm dưới configs.flat (bản top-level còn là eslintrc-style)
    ...reactHooks.configs.flat['recommended-latest'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // 3 rule MỚI của v7 (refs/set-state-in-effect/immutability) khắt khe với pattern
    // hợp lệ có sẵn (đọc ref trong event handler/cleanup, setState mount-gate hydration,
    // mutate .current của useRef) — hạ 'warn' làm nợ (D-02), KHÔNG chặn. rules-of-hooks
    // + exhaustive-deps + rules React Compiler vẫn là ERROR.
    files: ['apps/**/src/**/*.{ts,tsx}', 'packages/**/src/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
]
