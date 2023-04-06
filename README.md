# blog-client

### 介绍

个人博客-客户端

本项目实现了基础博客系统，逻辑简单，没有太多花里胡哨的功能，适合初学者快速上手。

本项目是基于vue2的SPA项目，使用了vue全家桶完成项目架构，并使用element-ui等常见样式库进行优化。核心博客模块，使用markdown风格进行文章编辑和渲染。

### 主要功能

- 博客查询，博客阅读
- 用户注册，用户多方式登录
- 用户点赞，用户留言
- 用户评论，多级评论展示

### 技术选型

- vue2全家桶：vue2, vue-router, vuex, vue-cli,
- 网络请求：axios, mockjs
- CSS预处理器：node-sass, sass-loader
- 样式库：element-ui, animate.css
- 博客相关：markdown-it, prismjs, tocbot

### 目录结构

```bash
blog-client
├── dist                        # 打包目录
├── node-modules                # 项目依赖
├── public                      # 静态资源
├── src                         # 项目源代码
    ├── api                     # 接口请求函数
    ├── assets                  # 项目文件资源
    ├── components              # 全局公共组件
    ├── config                  # 项目配置
    ├── layout                  # 页面布局
    ├── mixins                  # 混入组件
    ├── mock                    # 请求拦截配置
    ├── router                  # 项目路由
    ├── store                   # 全局存储
    ├── utils                   # 常用工具包
    ├── views                   # 视图页面组件
    ├── App.vue                 # 项目主组件
    └── main.js                 # 项目入口
├── babel.config.js             # babel配置
├── package.json                # node项目配置
└── vue.config.js               # 项目打包配置和本地跨域配置
```

### 项目使用

```bash
# 克隆项目到本地
git clone
# 下载依赖
npm install
# 修改/src/config/index.js中的域名
domain = <your-domain>
qiniu_domain  = <your-qiniu-domain>
# 启动服务
npm run serve
# 启动测试
npm run test
# 项目打包
npm run build
```

### 后续改进

1. 项目部署后依然是单页面应用（SPA），服务器压力较小，但不利于SEO。对于搜索引擎可见的需求，可使用SSR或Nuxt.js。
2. 如依然存在问题，可联系作者。 QQ：404874351