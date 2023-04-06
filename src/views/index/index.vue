<template>
  <div>
    <div ref="banner" class="banner"  style="height: 100vh;" :style="{ 'background-image': 'url(' + bannerImage + ')' }">
      <div>
        <div class="text-center text-bold margin-bottom-xl animate__animated animate__zoomIn" style="font-size: 40px;">晨曦的个人网站</div>
        <div class="typer">{{ obj.output }}<span class="typed-cursor">|</span></div>
      </div>

      <div class="scroll-down animate__animated animate__shakeY animate__infinite" @click="scrollDown">
        <i class="el-icon-arrow-down"></i>
      </div>
      
    </div>

    <el-row :gutter="10" style="margin: 20px auto; max-width: 1200px; min-width: 1200px;">
      <el-col :span="18">
        <!-- 文章信息 -->
        <div v-if="!articleList.length" v-loading="true" class="margin-tb-xl" ></div>
        <el-card 
          v-for="(item, index) in articleList" 
          :key="'article-' + index" 
          class="article-card cursor-pointer animate__animated animate__zoomIn">
          <div 
            class="flex align-center" 
            :style="{'flex-direction': index % 2 == 0 ? 'row' : 'row-reverse' }"
            @click="navArticle(item.id)" >
            <div style="height: 240px; width: 360px;">
              <el-image 
                style="height: 240px; width: 360px;"
                fit="cover" 
                :src="item.coverUrl || require('@/assets/image/default_cover.jpg')" lazy></el-image>
            </div>
            <div style="width: 100%; height: 80%;" class="padding-xl">
              <div class="text-xxl text-cut" style="max-width: 470px;">{{ item.title }}</div>
              <div class="margin-tb-sm flex align-center">
                <el-tag v-if="item.top" size="mini" type="warning">置顶</el-tag>
                <el-divider v-if="item.top" direction="vertical"></el-divider>
                <div class="text-sm text-gray"><i class="el-icon-alarm-clock"></i> {{ item.createTime.slice(0, 10) }}</div>
                <el-divider direction="vertical"></el-divider>
                <div class="text-sm text-gray"><i class="el-icon-view"></i> {{ item.viewCount }}</div>
                <el-divider direction="vertical"></el-divider>
                <div class="text-sm text-gray"><i class="el-icon-star-off"></i> {{ item.praiseCount }}</div>
                <el-divider direction="vertical"></el-divider>
                <div class="text-sm text-gray"><i class="el-icon-collection"></i> {{ item.category.name }}</div>
                <el-divider v-if="item.tagList.length" direction="vertical"></el-divider>
                <div 
                  v-for="(tagItem, tagIndex) in item.tagList.slice(0, 2)" 
                  :key="'article-' + index + '-tag-' + tagIndex"
                  class="text-sm text-gray margin-right-xs">
                  <i class="el-icon-price-tag"></i> {{ tagItem.name }}
                </div>
              </div>
              <div class="article-description">{{ item.description }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" style="position: sticky; top: 20px;">
        <!-- 网站信息 -->  
        <el-card class="animate__animated animate__zoomIn">
          <div class="text-center">
            <el-avatar style="width: 90px; height: 90px;" src="https://qiniu.zhongjiachen.cn/avatar/ddfd0d3d-2538-4354-b2f3-cfc686745c1f.jpg" ></el-avatar>
            <div class="text-xxl margin-top">晨曦</div>
            <div class="text-df margin-tb">失眠了，那就写点东西吧！</div>
          </div>
          <div class="flex justify-center">
            <img @click="contact('qq')"      class="contact-icon" :src="require('@/assets/image/qq.svg')"/>
            <img @click="contact('message')" class="contact-icon" :src="require('@/assets/image/message.svg')"/>
            <img @click="contact('github')"  class="contact-icon" :src="require('@/assets/image/github.svg')"/>
            <img @click="contact('gitee')"   class="contact-icon" :src="require('@/assets/image/gitee.svg')" style="scale: 0.9;" />
          </div>
          <el-row>
            <el-col :span="8">
              <div class="text-center">
                <div class="text-xxl text-black margin-tb">
                  <ICountUp :endVal="articleCount"/>
                </div>
                <div class="text-df">文章</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="text-center">
                <div class="text-xxl text-black margin-tb">
                  <ICountUp :endVal="praiseCount"/>
                </div>
                <div class="text-df">点赞</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="text-center">
                <div class="text-xxl text-black margin-tb">
                  <ICountUp :endVal="commentCount"/>
                </div>
                <div class="text-df">评论</div>
              </div>
            </el-col>
          </el-row>
          <div class="margin-top">
            <el-button 
              icon="el-icon-star-on" 
              type="primary" 
              size="medium" 
              style="width: 100%;"
              @click="favourite">收藏本站</el-button>
          </div>

        </el-card>
        <!-- 更新时间线 -->
        <el-card class="animate__animated animate__zoomIn margin-top">
          <div class="margin-bottom"> <i class="el-icon-s-promotion text-blue text-xxl"></i> 更新记录 </div>
          <el-timeline style="padding-left: 10px; max-height: 300px; overflow-y: scroll;">
            <el-timeline-item
              v-for="(item, index) in updateLog"
              :key="'timeline-' + index"
              :timestamp="item.timestamp"
              :size="index == 0 ? 'large' : 'normal' "
              :type="index == 0 ? 'success' : 'primary' ">
              {{item.content}}
            </el-timeline-item>
          </el-timeline>
        </el-card>
        <!-- 网站运行统计 -->
        <el-card class="animate__animated animate__zoomIn margin-top">
          <div class="margin-bottom"> <i class="el-icon-s-marketing text-red text-xxl"></i> 网站资讯 </div>
          <div class="text-df flex justify-between text-content">
            <div>运行时长：</div>
            <div>{{ runningTime }}</div>
          </div>
          <div class="text-df flex justify-between text-content">
            <div>总访问量：</div>
            <div>{{ viewCount }}</div>
          </div>
        </el-card>
        
      </el-col>
    </el-row>
    
    
  </div>
</template>

<script>
import EasyTyper from "easy-typer-js";
import ICountUp from 'vue-countup-v2';

import { updateLog } from "@/assets/js/data.js"
import { articleStatistic, articlePage } from "@/api/article.js";

export default {
  name: 'Index',
  components: {
    ICountUp
  },
  data() {
    return {
      bannerImage: require('../../assets/image/bg.jpg'),

      typerContentList: [
        "弱小和无知不是生存的障碍，\n傲慢才是。——《三体》",
        "理科生不会写，文科生不会算，\n大概的确是不对的。"
      ],
      typerFinished: false,

      obj: {
				output: "",
        type: 'rollback',
				isEnd: false,
				speed: 150,
				singleBack: true,
				sleep: 10 * 1000,
				backSpeed: 150,
				sentencePause: false
			},

      updateLog: null,

      runningTime: 0,
      startTime: new Date(2022, 8, 18, 0, 0, 0),
      timer: null,

      commentCount: 0,
      articleCount: 0,
      praiseCount: 0,
      viewCount: 0,

      articleList: [],
    }
  },
  watch: {
    typerFinished(newVal, oldVal) {
      if (newVal == true) {
        this.typerFinished = false
        this.initTyped()
      }
    }
  },
  created() {
    this.updateLog = updateLog
    this.initRunningTime()
    this.initTyped()
    this.getStatistic()
    this.getArticle()
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  
  methods: {
    scrollDown() {
      window.scrollTo({
        behavior: "smooth",
        top: this.$refs['banner'].clientHeight
      });
    },

    initTyped() {
			const obj = this.obj
      const input = [ ...this.typerContentList ]
      const fn = (instance) => { this.typerFinished = true }
      const hooks = (instance) =>{}
			const typed = new EasyTyper(obj, input, fn, hooks)
		},

    initRunningTime() {
      this.timer = setInterval(() => {
        let duration = Date.now() - this.startTime
        let day = Math.floor(duration / (24 * 60 * 60 * 1000))
        duration %= (24 * 60 * 60 * 1000)
        duration = Math.floor(duration / 1000)
        let hour = Math.floor(duration / 3600)
        duration %= 3600
        let min = Math.floor(duration / 60)
        let sec = duration %= 60
        this.runningTime = `${day}天${hour}时${min}分${sec}秒`
      }, 1000);
    },

    favourite() {
      this.$message({
        message: '按 CTRL+D 可将本页面加入书签',
        type: 'success',
      })
    },

    contact(type) {
      if (type == 'qq') {
        navigator.clipboard.writeText("404874351")
        this.$message({
          message: 'qq已复制到剪贴板',
          type: 'success',
        })
        return
      }
      if (type == 'message') {
        navigator.clipboard.writeText("jiachen_zhong@163.com")
        this.$message({
          message: '邮箱已复制到剪贴板',
          type: 'success',
        })
        return
      }
      if (type == 'github') {
        window.open('https://github.com/404874351')
        return
      }
      if (type == 'gitee') {
        window.open('https://gitee.com/zhong_jiachen')
        return
      }
    },

    getStatistic() {
      articleStatistic().then(res => {
        this.articleCount = res.data.count
        this.praiseCount = res.data.praiseCount
        this.commentCount = res.data.commentCount
        this.viewCount = res.data.viewCount
      }).catch(err => {
        console.log(err);
      })
    },
    getArticle() {
      articlePage({
        current: 1, 
        size: 10, 
        sortBy: "article_view_count",
      }).then(res => {
        this.articleList = res.data.records
      }).catch(err => {
        console.log(err);
      })
    },

    navArticle(id) {
      this.$router.push({ path: `/article/${id}` })
    },

  }
}
</script>

<style scoped>
.scroll-down {
  position: absolute;
  bottom: 20px;
  left: 0;
  width: 100%;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: white;
  cursor: pointer;
}

.animate__animated.animate__shakeY {
  --animate-duration: 10s;
}

.typed-cursor {
  opacity: 1;
  animation: blink 2s infinite;
}

.typer {
  height: 80px;
  white-space: pre;
  word-break: break-all;
  line-height: 1.6;
  font-size: 18px;
}

.contact-icon {
  width: 30px;
  height: 30px;
  margin: 0 5px;
  cursor: pointer;
}

*::-webkit-scrollbar {
  width: 0.5rem;
  height: 1px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: rgba(144, 147, 153, 0.3);
}

.article-card {
  margin-top: 15px;
}

.article-card:first-child {
  margin-top: 0;
}
.article-card >>> .el-card__body {
  padding: 0;
}

.article-description {
  min-height: 100px;
  font-size: 14px;
  line-height: 1.8;
  word-break: break-all;
  overflow:hidden; 
  text-overflow:ellipsis;
  display:-webkit-box;    
  -webkit-box-orient:vertical; 
  -webkit-line-clamp:4; 
}
</style>