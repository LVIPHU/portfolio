import { Tabs, TabsContent, TabsList, TabsTrigger } from 'web-2025'

export const ProfileTabs = () => (
  <Tabs defaultValue="overview" style={{ maxWidth: 480 }}>
    <TabsList>
      <TabsTrigger value="overview">Tổng quan</TabsTrigger>
      <TabsTrigger value="experience">Kinh nghiệm</TabsTrigger>
      <TabsTrigger value="projects">Dự án</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <p className="text-sm text-muted-foreground" style={{ paddingTop: 8 }}>
        Software engineer chuyên Next.js/React, thích viết blog kỹ thuật và chia sẻ kiến thức về web
        performance.
      </p>
    </TabsContent>
    <TabsContent value="experience">
      <p className="text-sm text-muted-foreground" style={{ paddingTop: 8 }}>
        3+ năm kinh nghiệm frontend, hiện làm việc với TypeScript, Next.js và thiết kế hệ thống UI.
      </p>
    </TabsContent>
    <TabsContent value="projects">
      <p className="text-sm text-muted-foreground" style={{ paddingTop: 8 }}>
        Portfolio monorepo, blog song ngữ, và các dự án open source trên GitHub.
      </p>
    </TabsContent>
  </Tabs>
)
