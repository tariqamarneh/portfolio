// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals = config.externals.filter(external => {
      if (typeof external === 'object' && ('react-native-fs' in external || '@react-three/fiber' in external || 'three' in external)) {
        return false;
      }
      return true;
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.credly.com',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig