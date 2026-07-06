import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  // vi không có prefix (/about), en có prefix (/en/about)
  localePrefix: "as-needed",
});
