const path = require('path')

module.exports = {
  webpack: (config, options, webpack) => {
    // Perform customizations to config
    // Important: return the modified config

    // changes the entry point
    config.entry.main = [
      './src/ssr/index.js'
    ]

    config.output.path = path.resolve(__dirname, "build-ssr")

    return config
  }
}