// Barrel i18n hậu C6: routing/request/navigation import trực tiếp theo path.
// PageLangParam giữ lại cho chữ ký page (tên lịch sử — cân nhắc đổi ở C12).
export type PageLangParam = {
  params: Promise<{ locale: string }>
}
