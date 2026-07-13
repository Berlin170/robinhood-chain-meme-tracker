/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // token logos from GoldRush / Covalent
      { protocol: "https", hostname: "logos.covalenthq.com" },
      { protocol: "https", hostname: "www.datocms-assets.com" },
      { protocol: "https", hostname: "assets.coingecko.com" },
      // brand marks are local assets in /public/logos/ — no external logo CDN
    ],
  },
};

export default nextConfig;
