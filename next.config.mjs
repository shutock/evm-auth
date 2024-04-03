/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      aws4: false,
      "pino-pretty": false,
      lokijs: false,
      encoding: false,
    };

    return config;
  },
};

export default nextConfig;
