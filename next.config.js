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

module.exports = function (webpackEnv) {
  return {
    ...withPWA({
      images: {
        domains: ['s4.anilist.co', 'artworks.thetvdb.com', 'media.kitsu.io', 'image.tmdb.org'],
        unoptimized: true,
      },
      typescript: {
        ignoreBuildErrors: true,
      },
    }),
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Adding fallback for tls and net modules
        config.resolve.fallback = {
          ...config.resolve.fallback,
          tls: false,
          net: false,
        };
      }
      return config;
    },
  };
};
