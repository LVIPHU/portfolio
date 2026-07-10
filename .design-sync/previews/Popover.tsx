import { Button, Popover, PopoverContent, PopoverTrigger } from 'web-2025'

// Trạng thái MỞ (export đầu = primaryStory) — popover chia sẻ bài viết.
export const SharePostPopover = () => (
  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20, minHeight: 320 }}>
    <Popover open>
      <PopoverTrigger asChild>
        <Button variant="outline">Chia sẻ</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-3">
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">Chia sẻ bài viết</h4>
            <p className="text-sm text-muted-foreground">
              Lan tỏa bài viết này tới cộng đồng dev Việt.
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Facebook
            </Button>
            <Button size="sm" variant="outline">
              X (Twitter)
            </Button>
            <Button size="sm">Sao chép link</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
)
