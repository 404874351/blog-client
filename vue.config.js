const config = require("./src/config/index.js")

module.exports = {
  // 保存文件时的检查代码规范，开发时很麻烦，通常关闭
  lintOnSave: false,
  // 设置生成的静态文件相对于打包目录的相对目录
  assetsDir: 'static',
  // 公共资源路径，指向process.env.BASE_URL
  // 使用history模式，
  publicPath: '/',

  // 代理服务器，解决跨域问题
  devServer: {
    // 是否自动弹出浏览器页面
    open: true, 
    proxy: {
      '/api': {
        // 线上地址
        target: config.domain,
        // 本地测试
        // target: 'http://127.0.0.1:8088',
        // 启用websocket
        ws: true,
        // 如走https协议，需要开启
        secure: true,
        // 修改origin
        changeOrigin: true,
        // 路径前缀重写，其实该情况可以省略
        pathRewrite: {
          // 线上地址，用于nginx的路径转发
          '^/api': '/api'
          // 本地地址，用于非路径转发
          // '^/api': ''
        }
      },
    }
  }
}