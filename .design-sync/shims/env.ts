// Shim @env (t3-env) — env.mjs thật import dotenv + node:path, không chạy được
// trong browser bundle. Giá trị tĩnh đủ cho render tĩnh.
export const env: Record<string, string | undefined> = {
  NODE_ENV: 'production',
  NEXT_PUBLIC_NODE_ENV: 'production',
  NEXT_PUBLIC_APP_URL: 'https://web-2025.vercel.app',
  DATABASE_URL: undefined,
  GITHUB_API_TOKEN: undefined,
  NEXT_PUBLIC_GISCUS_REPO: undefined,
  NEXT_PUBLIC_GISCUS_REPOSITORY_ID: undefined,
  NEXT_PUBLIC_GISCUS_CATEGORY: undefined,
  NEXT_PUBLIC_GISCUS_CATEGORY_ID: undefined,
}
