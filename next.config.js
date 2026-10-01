const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    if (isServer) {
      config.externals = [...(config.externals || []), "onnxruntime-web"];
    } else {
      config.resolve.alias = {
        ...config.resolve.alias,
        "onnxruntime-web": path.resolve(__dirname, "node_modules/onnxruntime-web/dist/ort.min.js"),
      };
    }

    return config;
  },
};

module.exports = nextConfig;
