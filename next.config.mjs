/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['doodleai.s3.us-east-1.amazonaws.com', 'doodleai.s3.amazonaws.com', 'ziigtovwwrdvvlzagnlj.supabase.co', 'upcdn.io'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery"
      },
    ],
  },
  experimental: {
    fontLoaders: [
      {
        loader: "@next/font/google",
        options: { subsets: ["latin"] },
      },
    ],
  },
}

export default nextConfig
