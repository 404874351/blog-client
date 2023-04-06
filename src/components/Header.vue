<template>
  <div :class="navClass">
    <div
      style="height: 60px; "
      class="flex justify-between align-center padding-lr">
      <!-- 页面导航 -->
      <div class="flex align-center">
        <!-- 网站logo -->
        <img src="@/assets/image/logo.png" width="55" class="cursor-pointer padding-lr-sm" @click="nav({ path: '/' })" />
        <div 
          v-for="(item, index) in navList" 
          :key="'nav-' + index" 
          class="margin-right cursor-pointer"
          @click="nav(item)">
          <i :class="item.icon" class="margin-left-xs"></i> {{ item.name }}
        </div>
        <!-- 搜索框 -->
        <div style="width: 300px;" class="margin-lr-sm">
          <el-input
            placeholder="搜索文章信息"
            v-model="search"
            size="small"
            prefix-icon="el-icon-search"
            @keyup.enter.native="searchArticle">
          </el-input>
        </div>
      </div>
      
      <!-- 头像区 -->
      <div>
        <el-dropdown  v-if="$store.state.userInfo" class="block" @command="handleDropdownClick">
          <div class="flex justify-center align-center nav-user">
            <el-avatar
              shape="circle"
              size="medium"
              :src="$store.state.userInfo.avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
            ></el-avatar>
            <div class="margin-left">
              {{ $store.state.userInfo.nickname }}
            </div>
            <i class="el-icon-caret-bottom margin-left-xs"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-user-solid" command="navIndividual">个人中心</el-dropdown-item>
            <el-dropdown-item icon="el-icon-remove" command="userLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div v-else class="cursor-pointer" @click="showLoginDialog">
          <i class="el-icon-user-solid margin-left-xs"></i> 登录
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import { logout } from "@/api/user.js";
import { clearLoginStatus } from "@/utils/auth.js";

export default {
  name: "Header",
  props: {},
  data() {
    return {
      navClass: 'nav',
      scrollTop: 0,

      navList: [
        {
          icon: "el-icon-s-home",
          name: "首页",
          path: "/"
        },
        {
          icon: "el-icon-menu",
          name: "文章",
          path: "/article"
        },
        {
          icon: "el-icon-s-comment",
          name: "留言",
          path: "/message"
        },
        {
          icon: "el-icon-s-promotion",
          name: "关于",
          path: "/about"
        },
      ],

      search: ''
    }
  },
  created() {},
  mounted() {
    // 监听页面滚动 
    window.addEventListener("scroll", this.scroll);
  },    
  
  methods: {
    /**
     * 滚动回调，用以控制导航栏样式
     * 
     * 滚动到顶部，导航栏固定且无背景
     * 向上滚动，导航栏固定且有背景
     * 向下滚动，导航栏隐藏
     */
    scroll() {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      if (scrollTop > 60) {
        this.navClass = "nav-fixed"
      } else {
        this.navClass = "nav"
      }
      if (this.scrollTop < scrollTop) {
        this.navClass += " nav-hidden"
      }
      this.scrollTop = scrollTop
    },

    searchArticle() {
      if (!this.search) {
        return
      }
      this.$router.push({ path: "/article", query: { key: this.search } })
    },

    nav(item) {
      this.$router.push({ path: item.path })
    },

    showLoginDialog() {
      this.$store.commit('SET_LOGIN_VISIBLE', true)
    },

    /**
     * 下拉菜单点击
     */
    handleDropdownClick(command) {
      this[command]()
    },

    /**
     * 退出登录
     */
    userLogout() {
      const loading = this.$loading({
        lock: true,
        text: '正在退出登录',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      });

      logout({}).then(res => {
        // 清除登录态
        clearLoginStatus()
        loading.close()
      }).catch(err => {
        console.log(err);
      })
    },

    /**
     * 跳转个人页
     */
    navIndividual() {
      this.$router.push({ path: '/user' })
    }
    
  },
};
</script>

<style lang="css" scoped>

.nav {
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100%;
  background-color: transparent;
  color: white;
  transition: all ease-in-out .4s;
}

.nav-fixed {
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100%;
  background-color: #ffffffb0;
  color: #303133;
  transition: all ease-in-out .4s;
}

.nav >>> input {
  color: white;
  background-color: transparent !important;
  transition: all ease-in-out .4s;
}

.nav-fixed >>> input {
  color: initial;
  transition: all ease-in-out .4s;
}

.nav-hidden {
  transform: translateY(-100%);
}

.nav .nav-user {
  color: white;
  transition: all ease-in-out .4s;
}
.nav-fixed .nav-user {

}
</style>