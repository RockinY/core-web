module.exports = {
  webpack: (config, options, webpack) => {
    // Perform customizations to config
    // Important: return the modified config

    // changes the entry point
    config.entry.main = [
      './src/ssr/index.js'
    ]

    return config
  }
}