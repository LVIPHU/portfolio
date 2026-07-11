/**
 * Nhúng YouTube kiểu lite: chỉ dựng iframe từ videoId, loading lazy —
 * không script bên thứ ba, không cookie tracking trước khi user bấm play
 * (dùng domain youtube-nocookie).
 */
export function YouTube({ id, title = 'YouTube video' }: { id: string; title?: string }) {
  return (
    <div className='mdx-youtube'>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading='lazy'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      />
    </div>
  )
}
