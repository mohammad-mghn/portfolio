/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        port: "",
        protocol: "https",
        hostname: "github.com",
        pathname: "/mohammad-mghn/portfolio/blob/images-db/**",
      },
    ],
  },
};

module.exports = nextConfig;
