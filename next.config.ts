/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true, // it should be false if you are facing any issue with vercel deployment
  images: {
    domains: ['ncdynpeyquxlxndpxlng.supabase.co'], // Add your domain(s) here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ncdynpeyquxlxndpxlng.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;