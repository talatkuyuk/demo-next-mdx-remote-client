/** @type {import('next').NextConfig} */
import path from "path";

const __dirname = new URL(".", import.meta.url).pathname;

const nextConfig = {
  reactStrictMode: true,
  // output: "export",
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./"),
    };

    return config;
  },
};

module.exports = nextConfig;
