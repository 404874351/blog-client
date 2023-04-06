// 线上域名
const domain = 'https://www.zhongjiachen.cn'
// 七牛云域名
const qiniu_domain = 'https://qiniu.zhongjiachen.cn'

const apiBaseUrl = {
  // 开发环境
  development: '/api',
  // 生产环境
  production: domain + '/api',
}

module.exports = {
  domain,
  qiniu_domain,
  apiBaseUrl,
} 