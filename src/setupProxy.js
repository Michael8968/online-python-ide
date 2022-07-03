const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function(app) {
  app.use(
    ['/idecompiler', '/fileApi'],
    createProxyMiddleware({
      target: 'https://coursemate.cn',
      changeOrigin: true,
    })
  )
}
