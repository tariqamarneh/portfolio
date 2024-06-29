// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Remove the problematic externals
    config.externals = config.externals.filter(external => {
      if (typeof external === 'object' && ('react-native-fs' in external || '@react-three/fiber' in external || 'three' in external)) {
        return false;
      }
      return true;
    });
    return config;
  },
}

module.exports = nextConfig