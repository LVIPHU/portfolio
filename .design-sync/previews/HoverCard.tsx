import { HoverCard, HoverCardContent, HoverCardTrigger } from 'web-2025'

// Trạng thái MỞ (prop `open` của Radix Root) — hover card hồ sơ tác giả.
// Container flex center + minHeight vừa đủ để content (side bottom) nằm trọn khung.
// Popper của react-hover-card trong bundle neo sai (đo nhầm hộp story-root thay
// vì trigger) → content trôi giữa khung. Ghim wrapper popper ngay dưới trigger
// bằng CSS !important — chỉ định vị, không đụng style DS của content.
export const AuthorProfileCard = () => (
  <>
    <style>{`body{margin-right:0!important;padding-right:0!important}
[data-radix-popper-content-wrapper]{position:fixed!important;top:68px!important;left:50%!important;transform:translateX(-50%)!important}`}</style>
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, minHeight: 230 }}>
      <HoverCard open>
        <HoverCardTrigger
          href="https://github.com/LVIPHU"
          className="text-sm font-medium text-primary-500"
          style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}
        >
          @LVIPHU
        </HoverCardTrigger>
        <HoverCardContent className="w-64" avoidCollisions={false}>
          <div className="flex gap-3">
            <img
              src="https://avatars.githubusercontent.com/u/84316006?v=4"
              alt="Lương Vĩ Phú"
              style={{ width: 40, height: 40, borderRadius: 9999, flexShrink: 0 }}
            />
            <div className="space-y-1">
              <p className="text-sm font-semibold">Lương Vĩ Phú</p>
              <p className="text-sm text-muted-foreground">
                Full-stack developer — Next.js, NestJS. Viết blog kỹ thuật song ngữ Việt – Anh.
              </p>
              <p className="text-xs text-muted-foreground">TP. Hồ Chí Minh · GitHub từ 2021</p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  </>
)
