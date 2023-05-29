const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // publicPath: '/bigbrain/'
  // publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
})
