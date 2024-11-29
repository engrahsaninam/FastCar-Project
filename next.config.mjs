/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com'],
        // Or you can use remotePatterns for more security
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
