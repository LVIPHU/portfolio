import type { ResumeData } from "./types";

export const resume: ResumeData = {
  experience: [
    {
      company: "Company Name",
      role: {
        vi: "Lập trình viên",
        en: "Software Developer",
      },
      start: "2024-06",
      end: null,
      summary: [
        {
          vi: "Mô tả công việc chính: bạn làm gì, với công nghệ nào, tạo ra giá trị gì.",
          en: "Main responsibility: what you do, with which technologies, and the value created.",
        },
        {
          vi: "Một thành tựu nổi bật, tốt nhất là có con số (giảm x%, tăng y người dùng...).",
          en: "A notable achievement, ideally with numbers (reduced x%, grew y users...).",
        },
      ],
    },
    {
      company: "Previous Company",
      role: {
        vi: "Thực tập sinh",
        en: "Intern",
      },
      start: "2023-06",
      end: "2024-05",
      summary: [
        {
          vi: "Mô tả ngắn về vai trò và những gì bạn học được.",
          en: "Short description of the role and what you learned.",
        },
      ],
    },
  ],
  education: [
    {
      school: "Tên trường đại học",
      degree: {
        vi: "Cử nhân Công nghệ thông tin",
        en: "B.Sc. in Information Technology",
      },
      start: "2020",
      end: "2024",
    },
  ],
  skills: [
    {
      label: { vi: "Ngôn ngữ", en: "Languages" },
      items: ["TypeScript", "JavaScript", "Python"],
    },
    {
      label: { vi: "Frontend", en: "Frontend" },
      items: ["React", "Next.js", "Tailwind CSS"],
    },
    {
      label: { vi: "Backend & khác", en: "Backend & others" },
      items: ["Node.js", "PostgreSQL", "Git", "Docker"],
    },
  ],
};
