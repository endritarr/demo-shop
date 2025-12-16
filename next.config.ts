import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js to not bundle pdfkit - it will be required at runtime
  // This works with both webpack and Turbopack
  serverExternalPackages: ['pdfkit'],
};

export default nextConfig;
