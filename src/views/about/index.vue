<template>
  <div>
    <div class="banner" :style="{ 'background-image': 'url(' + bannerImage + ')' }">
      <div class="text-center text-bold margin-bottom-xl animate__animated animate__zoomIn" style="font-size: 40px;">关于我</div>
    </div>

    <el-card class="cv-card animate__animated animate__zoomIn">
      <div class="text-center margin-bottom">
        <el-avatar style="width: 90px; height: 90px;" src="https://qiniu.zhongjiachen.cn/avatar/ddfd0d3d-2538-4354-b2f3-cfc686745c1f.jpg" ></el-avatar>
        <div class="text-xxl margin-top">晨曦</div>
      </div>
      <!-- 主体内容 -->
      <div v-if="content" v-html="content"></div>
      <div v-else class="text-center text-gray">作者好像什么也没写...</div>
    </el-card>
  </div>
</template>

<script>
import { getArticle } from '@/api/qiniu.js';
import { markdownToHtml } from '@/utils/markdown.js';

export default {
  name: 'About',
  data() {
    return {
      bannerImage: require('../../assets/image/about.jpg'),
      url: 'https://qiniu.zhongjiachen.cn/article/31311424-720a-4721-ad0d-85de8f9f0b58.md',
      content: ''
    }
  },
  created() {
    this.getContent()
  },
  methods: {
    getContent() {
      getArticle(this.url).then(res => {
        this.content = markdownToHtml(res.data)
      }).catch(err => {
        console.log(err);
      })
    },
  }
}
</script>

<style scoped>
.cv-card {
  margin: 20px auto;
  width: 80%;
  max-width: 1200px;
  font-size: 14px;
}
</style>