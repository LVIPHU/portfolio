import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from 'web-2025'

// Trạng thái MỞ (export đầu = primaryStory): open + value controlled tĩnh.
export const OpenLanguagePicker = () => (
  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 24, minHeight: 360 }}>
    <Select open value="vi">
      <SelectTrigger style={{ width: 220 }}>
        <SelectValue placeholder="Chọn ngôn ngữ" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Ngôn ngữ bài viết</SelectLabel>
          <SelectItem value="vi">Tiếng Việt</SelectItem>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="fr" disabled>
            Français (sắp có)
          </SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Sắp xếp</SelectLabel>
          <SelectItem value="newest">Mới nhất</SelectItem>
          <SelectItem value="popular">Đọc nhiều</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
)

export const TriggerStates = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 260 }}>
    <Select value="grid">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="grid">Dạng lưới</SelectItem>
        <SelectItem value="list">Dạng danh sách</SelectItem>
      </SelectContent>
    </Select>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Chọn chủ đề blog…" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="nextjs">Next.js</SelectItem>
      </SelectContent>
    </Select>
    <Select disabled>
      <SelectTrigger>
        <SelectValue placeholder="Không khả dụng" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">—</SelectItem>
      </SelectContent>
    </Select>
  </div>
)
