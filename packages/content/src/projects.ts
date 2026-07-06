import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "portfolio-monorepo",
    name: "Portfolio Monorepo",
    description: {
      vi: "Chính trang web này — monorepo chứa nhiều version portfolio, nội dung dùng chung qua package riêng, song ngữ vi/en.",
      en: "This very website — a monorepo hosting multiple portfolio versions with shared content and vi/en localization.",
    },
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Turborepo"],
    year: 2026,
    featured: true,
    links: {
      source: "https://github.com/your-username/portfolio",
    },
  },
  {
    slug: "sample-project-a",
    name: "Sample Project A",
    description: {
      vi: "Mô tả ngắn gọn dự án: giải quyết vấn đề gì, cho ai, kết quả ra sao. Sửa file packages/content/src/projects.ts để thay nội dung này.",
      en: "A short description: what problem it solves, for whom, and the outcome. Edit packages/content/src/projects.ts to replace this.",
    },
    tech: ["React", "Node.js"],
    year: 2025,
    featured: true,
    links: {
      demo: "https://example.com",
      source: "https://github.com/your-username/project-a",
    },
  },
  {
    slug: "sample-project-b",
    name: "Sample Project B",
    description: {
      vi: "Một dự án khác của bạn. Có thể thêm bao nhiêu project tùy thích — trang Projects sẽ tự render.",
      en: "Another project of yours. Add as many as you like — the Projects page renders them automatically.",
    },
    tech: ["Python", "PostgreSQL"],
    year: 2024,
    featured: false,
    links: {},
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
