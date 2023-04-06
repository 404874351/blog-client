<template>
  <div>
    <!-- 导航栏 -->
    <Header  />
    <!-- 路由页面 -->
    <router-view />
    <!-- 底部栏 -->
    <Footer  />
    <!-- 返回顶部 -->
    <BackTop />
    <!-- 登录框 -->
    <LoginDialog />
    
  </div>
    
</template>

<script>
import Header from "@/components/Header";
import BackTop from "@/components/BackTop";
import Footer from "@/components/Footer";
import LoginDialog from "@/components/LoginDialog";

export default {
  name: "Layout",
  components: {
    Header,
    BackTop,
    Footer,
    LoginDialog,
},
  data() {
    return {
      
    };
  },
  computed: {

  },
  watch: {
    $route(newVal, oldVal) {
      // 监听路由变化
    }
  },
  created() {

  },
  mounted() {
    
  },
  
  methods: {
    
  }
};
</script>

<style lang="scss" scoped>

</style>