import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import unusedImports from 'eslint-plugin-unused-imports'
import tsParser from '@typescript-eslint/parser'

// C10 (D-02, M-01): flat config root, CHỈ rules của eslint-plugin-react-hooks
// (preset recommended-latest đã gộp rules React Compiler) — ép Rules of React.
// @typescript-eslint/parser chỉ để PARSE .ts/.tsx (không kèm rule TS nào).
// Không kéo lại eslint-config-next (gỡ ở C7).
// jsx-a11y: error sau khi P4/P6 đã vá (P8).
const reactHooksConfig = reactHooks.configs.flat['recommended-latest']
const a11yRecommended = jsxA11y.flatConfigs.recommended.rules ?? {}

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/.next-build/**',
      '**/public/**',
      '**/dist/**',
      '**/.turbo/**',
      'ds-bundle/**',
      'ds-bundle-2026/**',
      '**/.ds-css/**',
      '.claude/worktrees/**',
    ],
  },
  {
    files: ['apps/**/src/**/*.{ts,tsx}', 'packages/**/src/**/*.{ts,tsx}'],
    ...reactHooksConfig,
    plugins: {
      ...reactHooksConfig.plugins,
      'jsx-a11y': jsxA11y,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      ...reactHooksConfig.rules,
      ...a11yRecommended,
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      // 3 rule MỚI của v7 (refs/set-state-in-effect/immutability) khắt khe với pattern
      // hợp lệ có sẵn (đọc ref trong event handler/cleanup, setState mount-gate hydration,
      // mutate .current của useRef) — hạ 'warn' làm nợ (D-02), KHÔNG chặn. rules-of-hooks
      // + exhaustive-deps + rules React Compiler vẫn là ERROR.
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
]
