<template>
  <div v-if="visible" class="footer">
    <div> 晨曦的个人网站 ©Copyright 2021-2023 </div>
    <div>
      <a href="https://beian.miit.gov.cn/" target="_blank">苏ICP备2021050505号-1 </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  computed: {
    visible() {
      return this.$route.path !== "/message"
    }
  }
}
</script>

<style scoped>
.footer {
  width: 100%;
  background: linear-gradient(-45deg, #409eff, #23d5ab);
  font-size: 14px;
  line-height: 2;
  padding: 40px 0;
  text-align: center;
  color: white;
}
.footer a {
  color: white !important;
}
</style>