/**
 * Tiêu đề file cho code block — nhận props do remarkCodeTitles chèn
 * (fence dạng ```lang:tên-file). Server component, style qua styles.css.
 * Không dùng icon map theo app (SocialIcons là đồ riêng của 2025 — app nào
 * muốn icon thì override CodeTitle qua prop components của MDXContent).
 */
export function CodeTitle({ lang, title }: { lang?: string; title: string }) {
  return (
    <div className='mdx-code-title' data-lang={lang}>
      <span className='mdx-code-title-name'>{title}</span>
      {lang ? <span className='mdx-code-title-lang'>{lang}</span> : null}
    </div>
  )
}
