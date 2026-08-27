/** Phát hiện TeX trong MDX — tách khỏi KatexStyles để không kéo CSS khi bài không có toán. */
export function hasMath(source: string): boolean {
  return /\$\$|\\\(|\\\[|\\begin\{/.test(source)
}
