import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'

// 引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 引入Animate.css动画库
import 'animate.css';

// 引入vue-baberrage弹幕插件
import { vueBaberrage } from 'vue-baberrage';
Vue.use(vueBaberrage);

// 引入prism.js代码样式库
import Prism from "prismjs";
Vue.prototype.$prism = Prism

// 开发环境下引入mock
if(process.env.NODE_ENV == 'development') {  
  require('./mock/index.js')
}

// 是否启动开发建议，仅在开发环境下使用
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

window.router = router