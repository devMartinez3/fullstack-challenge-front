import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // with comment this line, the app will run in deploy in Vercel
  // with uncomment this line, the app will run in local
  output: "standalone",
};

export default withNextIntl(nextConfig);
