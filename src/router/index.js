import Vue from "vue";
import Router from "vue-router";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import Layout from "@/layout/index.vue";


// 解决 Redirected when going from ... to ... via a navigation guard 报错的问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);


// 基础路由
const baseRoutes = [
  {
    path: "/",
    component: Layout,
    children: [
      { 
        path: '', 
        name: "Index",
        component: () => import("@/views/index/index.vue"),
        meta: {
          title: '晨曦的个人网站'
        },
      },
      { 
        path: 'article', 
        name: "Article",
        component: () => import("@/views/article/index.vue"),
        meta: {
          title: '文章'
        },
      },
      { 
        path: 'article/:id', 
        name: "ArticleDetail",
        component: () => import("@/views/article/detail/index.vue"),
      },
      { 
        path: 'message', 
        name: "Message",
        component: () => import("@/views/message/index.vue"),
        meta: {
          title: '留言'
        },
      },
      { 
        path: 'user', 
        name: "User",
        component: () => import("@/views/user/index.vue"),
        meta: {
          title: '个人中心'
        },
      },
      { 
        path: 'about', 
        name: "About",
        component: () => import("@/views/about/index.vue"),
        meta: {
          title: '关于我'
        },
      },
    ]
  },
  { 
    path: '/404', 
    name: "404",
    component: () => import("@/views/404/index.vue"),
    meta: {
      title: '诶呀，出错啦！'
    },
  },
  { 
    path: '*', 
    redirect: '/404', 
    hidden: true 
  }
  
]

const router = new Router({
  // 如不使用history模式，部署更方便，但不够美观
  mode: "history",
  base: process.env.BASE_URL,
  routes: baseRoutes,
})

// 前置路由守卫
router.beforeEach((to, from, next) => {
  // 启动进度条
  NProgress.start()
  // 标签页标题修改
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

// 后置路由守卫
router.afterEach((to, from) => {
  // 完结进度条
  NProgress.done()
})

export default router