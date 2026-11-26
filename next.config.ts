import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Formatos modernos gerados automaticamente pelo <Image> do Next.js
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
