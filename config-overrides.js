const OfflinePlugin = require('offline-plugin')
const { ReactLoadablePlugin } = require('react-loadable/webpack')
const rewireStyledComponents = require('react-app-rewire-styled-components')
const { injectBabelPlugin } = require('react-app-rewired')
const swPrecachePlugin = require('sw-precache-webpack-plugin')

const isServiceWorkerPlugin = plugin => plugin instanceof swPrecachePlugin

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  config.plugins.push(
    new ReactLoadablePlugin({
      filename: './build/react-loadable.json',
    })
  )

  config = injectBabelPlugin('react-loadable/babel', config)

  config.plugins = config.plugins.filter(
    plugin => !isServiceWorkerPlugin(plugin)
  )
  
  config.plugins.push(
    new OfflinePlugin({
      caches: process.env.NODE_ENV === 'development' ? {} : 'all',
      autoUpdate: true,
      cacheMaps: [
        {
          match: function(url) {
            var EXTERNAL_PATHS = ['/api', '/auth'];
            if (
              EXTERNAL_PATHS.some(function(path) {
                return url.pathname.indexOf(path) === 0;
              })
            ) {
              return false;
            }
            return new URL('./index.html', location);
          },
          requestTypes: ['navigate'],
        },
      ],
      rewrites: arg => arg,
      ServiceWorker: {
        entry: './public/push-sw.js',
        events: true,
        prefetchRequest: {
          mode: 'cors',
          credentials: 'include',
        },
      },
      AppCache: false
    })
  )
  return rewireStyledComponents(config, env, { ssr: true });
}