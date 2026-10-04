/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { bodySizeLimit: '6mb' } }, // menu photo uploads
  // Old page URLs now point at sections of the single-page site.
  async redirects() {
    return [
      { source: '/menu', destination: '/#menu', permanent: true },
      { source: '/about', destination: '/#about', permanent: true },
      { source: '/contact', destination: '/#visit', permanent: true },
    ];
  },
};
export default nextConfig;
