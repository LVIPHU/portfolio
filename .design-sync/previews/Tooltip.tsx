import { Button, Tooltip, TooltipContent, TooltipTrigger } from 'web-2025'

// Trạng thái MỞ (export đầu = primaryStory) — tooltip trên nút lưu bài viết.
// TooltipProvider đã là provider toàn cục của preview harness.
export const SaveArticleTooltip = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
    <Tooltip open>
      <TooltipTrigger asChild>
        <Button variant="outline">Lưu bài viết</Button>
      </TooltipTrigger>
      <TooltipContent side="top">Thêm vào danh sách đọc sau</TooltipContent>
    </Tooltip>
  </div>
)
