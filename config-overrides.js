const OfflinePlugin = require('offline-plugin')

module.exports = function override(config, env) {
  //do stuff with the webpack config...
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
  return config;
}