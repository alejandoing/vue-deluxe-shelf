const path = require('path');

const resolvePath = (route) => path.resolve(__dirname, route);

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolvePath('src'),
        "assets": resolvePath('src/assets'),
        "components": resolvePath('src/components'),
        "constants": resolvePath('src/constants'),
        "models": resolvePath('src/models'),
        "plugins": resolvePath('src/plugins'),
        "routes": resolvePath('src/routes'),
        'uploads': resolvePath('server/app/uploads'),
        "services": resolvePath('src/services'),
        "store": resolvePath('src/store'),
        "views": resolvePath('src/views')
      },
      extensions: ['.js', '.vue']
    }
  },
  devServer: {
    port: 8081,
    host: '0.0.0.0',
    proxy: { 
      '/api': {
        target: 'http://localhost:3001'
      }
    }
  },
  transpileDependencies: ['vuetify']
}