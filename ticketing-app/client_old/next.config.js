/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};

module.exports = nextConfig;
