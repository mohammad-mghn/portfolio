/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        port: "",
        protocol: "https",
        hostname: "github.com",
        pathname: "/vito-mohagheghian/portfolio/blob/images-db/**",
      },
    ],
  },
};

module.exports = nextConfig;
