const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

module.exports = {
  ...withPWA(),
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // For client-side only
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false, // Ensure that net module is false
        tls: false, // Ensure that tls module is false
        fs: false, // Ensure that fs module is false
        "fs/promises": false, // Ensure that fs/promises module is false
        child_process: false, // Ensure that child_process module is false
        dns: false, // Ensure that dns module is false
      };
    }
    return config;
  },
  images: {
    domains: ['s4.anilist.co', 'artworks.thetvdb.com', 'media.kitsu.io', 'image.tmdb.org'],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
