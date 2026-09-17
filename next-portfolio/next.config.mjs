/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // three.js and its R3F ecosystem ship ESM that benefits from transpilation.
  transpilePackages: ["three"],
};

export default nextConfig;
