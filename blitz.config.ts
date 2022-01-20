import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"
import WindiCSSWebpackPlugin from "windicss-webpack-plugin"

const config: BlitzConfig = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "crossfit-social",
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    config.plugins.push(new WindiCSSWebpackPlugin())
    return config
  },
}
module.exports = config
