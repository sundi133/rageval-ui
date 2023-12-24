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
  },
  rewrites: async () => {
    return [
      {
        source: "/rageval/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/rageval/:path*"
            : "/rageval/",
      }
    ];
  },
};

module.exports = nextConfig;
