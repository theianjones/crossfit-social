import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"
import WindiCSSWebpackPlugin from "windicss-webpack-plugin"
const withPlugins = require("next-compose-plugins")
const withTM = require("next-transpile-modules")([
  "@adobe/react-spectrum",
  "@react-spectrum/actiongroup",
  "@react-spectrum/breadcrumbs",
  "@react-spectrum/button",
  "@react-spectrum/buttongroup",
  "@react-spectrum/checkbox",
  "@react-spectrum/combobox",
  "@react-spectrum/dialog",
  "@react-spectrum/divider",
  "@react-spectrum/form",
  "@react-spectrum/icon",
  "@react-spectrum/illustratedmessage",
  "@react-spectrum/image",
  "@react-spectrum/label",
  "@react-spectrum/layout",
  "@react-spectrum/link",
  "@react-spectrum/listbox",
  "@react-spectrum/menu",
  "@react-spectrum/meter",
  "@react-spectrum/numberfield",
  "@react-spectrum/overlays",
  "@react-spectrum/picker",
  "@react-spectrum/progress",
  "@react-spectrum/provider",
  "@react-spectrum/radio",
  "@react-spectrum/slider",
  "@react-spectrum/searchfield",
  "@react-spectrum/statuslight",
  "@react-spectrum/switch",
  "@react-spectrum/table",
  "@react-spectrum/tabs",
  "@react-spectrum/text",
  "@react-spectrum/textfield",
  "@react-spectrum/theme-dark",
  "@react-spectrum/theme-default",
  "@react-spectrum/theme-light",
  "@react-spectrum/tooltip",
  "@react-spectrum/view",
  "@react-spectrum/well",
  "@spectrum-icons/ui",
  "@spectrum-icons/workflow",
])

const config: BlitzConfig = withPlugins([withTM], {
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
})
module.exports = config
