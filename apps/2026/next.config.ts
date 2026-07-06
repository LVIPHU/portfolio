import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {
  transpilePackages: ["@portfolio/content"],
};

export default withNextIntl(config);
