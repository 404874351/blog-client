<template>
  <router-view :key="$route.fullPath" />
</template>

<script>
import { userInfo } from "@/api/user.js";
import { getToken, getLoginStatus, setLoginStatus } from "@/utils/auth.js";

export default {
  components: {},
  created() {
    // token不存在，则匿名访问
    const token = getToken();
    if (!token) {
      return;
    }
    // 登录态存在，也不再获取
    const loginStatus = getLoginStatus();
    if (loginStatus.userInfo) {
      return;
    }
    // token存在，且登录态不存在，则重新获取登录态，用于页面刷新
    console.log("正在恢复登录态");
    this.recoverLoginStatus();
  },
  methods: {
    async recoverLoginStatus() {
      try {
        // 获取用户信息
        let res = await userInfo();
        setLoginStatus(res.data);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss">
// 引入scss常用样式库
@import "./assets/css/common.css";
@import "./assets/css/transition.css";
@import "./assets/css/animation.css";
@import "./assets/css/color.scss";

#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  color: $--black;
}

body {
  margin: 0;
  height: 100%;
  width: 100%;
  min-width: 1000px;
  background: linear-gradient(90deg, #fff8f4, #f5ffff);
}
</style>

