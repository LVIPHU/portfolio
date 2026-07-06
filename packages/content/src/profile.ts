import type { Profile } from "./types";

export const profile: Profile = {
  name: "Lương Vĩ Phú",
  title: {
    vi: "Software Developer",
    en: "Software Developer",
  },
  tagline: {
    vi: "Mình xây dựng những sản phẩm web sạch, nhanh và dễ dùng.",
    en: "I build clean, fast and usable web products.",
  },
  bio: [
    {
      vi: "Xin chào! Mình là Phú, một lập trình viên yêu thích việc biến ý tưởng thành sản phẩm thực tế. Mình quan tâm đến trải nghiệm người dùng, hiệu năng và code dễ bảo trì.",
      en: "Hi! I'm Phu, a developer who loves turning ideas into real products. I care about user experience, performance and maintainable code.",
    },
    {
      vi: "Ngoài giờ code, mình thích đi đây đó, chụp ảnh và viết blog chia sẻ những gì học được. Trang này là nơi mình lưu lại hành trình đó.",
      en: "Outside of coding, I enjoy traveling, taking photos and blogging about what I learn. This site is where I keep that journey.",
    },
  ],
  email: "luongviphu0403@gmail.com",
  location: {
    vi: "Việt Nam",
    en: "Vietnam",
  },
  avatar: "/content/gallery/placeholder-1.svg",
  socials: [
    { label: "GitHub", url: "https://github.com/your-username" },
    { label: "LinkedIn", url: "https://linkedin.com/in/your-username" },
    { label: "Facebook", url: "https://facebook.com/your-username" },
  ],
};
