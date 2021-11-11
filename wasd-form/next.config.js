module.exports = {
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },

    env: {
      DEVELOPMENT: false,
      SITE_KEY: "ac9c242c-74f7-499b-b29a-af4aef0f6052"
    }
  }