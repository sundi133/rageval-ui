/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh'
      }
    ]
  }
  // rewrites: async () => {
  //   return [
  //     {
  //       source: "/api/auth/session/:path*",
  //       destination: "/api/auth/session/",
  //     },
  //     {
  //       source: "/api/:path*",
  //       destination:"/api",
  //     },
  //   ];
  // },
};

require('dotenv').config();

module.exports = nextConfig;
