<template>
  <div>
    <div v-if="article" class="banner" :style="{ 'background-image': 'url(' + bannerImage  + ')'}">
      <div class="banner-article-container"></div>
      <div style="z-index: 999;">
        <div class="text-center text-bold margin-bottom-xl" style="font-size: 40px;">{{ article.title || '文章' }}</div>
        <div class="flex justify-center align-center text-df margin-tb-sm">
          <div><i class="el-icon-view"></i> 阅读量: {{ article.viewCount }}</div>
          <el-divider direction="vertical"></el-divider>
          <div><i class="el-icon-chat-dot-square"></i> 评论量: {{ article.commentCount }}</div>
          <el-divider direction="vertical"></el-divider>
          <div><i class="el-icon-collection"></i> {{ article.category.name }}</div>
        </div>
        <div class="flex justify-center align-center text-df margin-tb-sm">
          <div><i class="el-icon-time"></i> 阅读时长: {{ readTime }}分钟</div>
          <el-divider direction="vertical"></el-divider>
          <div><i class="el-icon-alarm-clock"></i> 发布于: {{ article.createTime.slice(0, 10) }}</div>
        </div>
      </div>
    </div>

    <el-row v-if="article" :gutter="10" style="margin: 20px auto; max-width: 1200px;" class="animate__animated animate__fadeInUp">
      <el-col :span="18">
        <el-card class="article-container" v-loading="articleLoading">
          <!-- 文章内容 -->
          <div id="content" ref="content" class="article-content" v-html="content"></div>
          <!-- 后缀信息 -->
          <div 
            class="padding margin-tb-xl border-solid" 
            style="line-height: 2; position: relative; ">
            <i class="el-icon-circle-plus text-blue text-xxl" style="position: absolute; right: 15px; top: 15px;"></i>
            <div>
              <span class="text-bold text-blue margin-right-xs">本文作者: </span>
              <span>{{ article.user.nickname }}</span>
            </div>
            <div>
              <span class="text-bold text-blue margin-right-xs">本文链接: </span>
              <span>{{ articleLink }}</span>
            </div>
            <div>
              <span class="text-bold text-blue margin-right-xs">版权声明: </span>
              <span>所有文章内容一律为作者原创，转载请注明文章出处!</span>
            </div>
          </div>
          <!-- 点赞区 -->
          <div class="margin-tb-xl text-center">
            <el-button 
              style="width: 120px; " 
              :type="article.praiseStatus ? 'primary' : 'info'" 
              :icon="article.praiseStatus ? 'el-icon-star-on' : 'el-icon-star-off'"   
              @click="handleArticlePraise(id)" >
              {{article.praiseStatus ? '已点赞' : '点赞'}} {{ article.praiseCount }}
            </el-button>
            <el-popover
              placement="top"
              width=""
              trigger="hover">
              <div class="flex justify-center">
                <div class="text-center">
                  <el-image class="qr-code" fit="cover" :src="require('@/assets/image/weixin_qr_code.png')" ></el-image>
                  <div>微信</div>
                </div>
                <div class="text-center">
                  <el-image class="qr-code" fit="cover" :src="require('@/assets/image/alipay_qr_code.jpg')" ></el-image>
                  <div>支付宝</div>
                </div>
              </div>
              <el-button 
              slot="reference"
                style="width: 120px; margin-left: 10px;" 
                type="primary" 
                icon="el-icon-s-finance" >
                打赏
              </el-button>
            </el-popover>
          </div>
          <el-divider ></el-divider>
          <!-- 评论区 -->
          <div>
            <div class="flex align-center">
              <div class=""> 
                <span class="text-bold text-xxl"> 评论 </span>
                <span class="text-gray">{{ article.commentCount }}</span>
              </div>
              <div class="margin-left-xl">
                <el-button 
                  type="text" 
                  :class="commentSortBy == 'comment_praise_count' ? 'comment-btn-selected' : 'comment-btn'"
                  @click="selectCommentSortBy('comment_praise_count')">最热</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button 
                  type="text" 
                  :class="commentSortBy == 'comment_create_time' ? 'comment-btn-selected' : 'comment-btn'"
                  @click="selectCommentSortBy('comment_create_time')">最新</el-button>
              </div>
            </div>
            <!-- 评论框 -->
            <CommentBox 
              class="margin-tb" 
              v-model="commentContent" >
              <template slot="footer">
                <el-button type="primary" size="medium" @click="addComment">发布</el-button>
              </template>
            </CommentBox>
            <!-- 评论列表 -->
            <CommentList :list="commentList" :articleId="id" />
            <div ref="commentBottom" class="text-gray text-center">{{ commentHasMore ? '正在加载...' : '没有更多了!' }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" style="position: sticky; top: 20px;">
        <!-- 文章目录 -->
        <el-card >
          <div class="margin-bottom"> <i class="el-icon-menu text-blue text-xxl"></i> 目录 </div>
          <div id="toc"></div>
          <div v-if="!tocExists" class="text-gray text-sm"> 本文不包含目录结构 </div>
        </el-card>
        <!-- 文章信息 -->
        <el-card class="margin-top" >
          <div class="margin-bottom"> <i class="el-icon-s-help text-blue text-xxl"></i> 相关信息 </div>
          <div class="margin-bottom-xs text-content">{{ article.description }}</div>
          <el-tag 
            v-for="(item, index) in article.tagList" 
            :key="'tag-' + index"
            size="medium"
            class="margin-tb-xs margin-right-xs cursor-pointer"
            @click="navTag(item.name)">{{ item.name }}</el-tag>
            <div class="text-content text-df">
              <div class="margin-top-xs">
                <i class="el-icon-view"></i>
                <span> 阅读 </span>
                <span class="text-bold">{{ article.viewCount }}</span>
              </div>
              <div class="margin-top-xs">
                <i class="el-icon-star-off"></i>
                <span> 点赞 </span>
                <span class="text-bold">{{ article.praiseCount }}</span>
              </div>
              <div class="margin-top-xs">
                <i class="el-icon-chat-dot-square"></i>
                <span> 评论 </span>
                <span class="text-bold">{{ article.commentCount }}</span>
              </div>
            </div>
        </el-card>
        <!-- 最新文章 -->
        <el-card class="margin-top">
          <div class="margin-bottom"> <i class="el-icon-share text-blue text-xxl"></i> 最新文章 </div>
          <div
            v-for="(item, index) in latestArticleList" 
            :key="'latest-' + index"
            class="latest-article-card flex align-center cursor-pointer padding-tb-xs border-bottom-solid"
            @click="navLatestArticle(item.id)">
            <el-image 
              style="height: 60px; width: 90px; min-width: 90px; border-radius: 4px;" 
              fit="cover" 
              :src="item.coverUrl || require('@/assets/image/default_cover.jpg')" lazy></el-image>
            <div class="margin-left">
              <div class="text-df text-cut" style="max-width: 110px">{{ item.title }}</div>
              <div class="text-sm text-gray margin-top-xs">{{ item.createTime.slice(0, 10) }}</div>
            </div>
          
          </div>
          <div v-if="!latestArticleList.length" class="text-gray text-sm"> 暂无数据 </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import tocbot from "tocbot";
import { articlePage, articleInfo, articlePraise, articleCancelPraise } from '@/api/article.js';
import { commentPage, commentSave } from '@/api/comment.js';
import { getArticle } from '@/api/qiniu.js';
import { getHostPath } from "@/utils/util.js";
import { hasLogin } from '@/utils/auth.js';
import { markdownToHtml } from '@/utils/markdown.js';

import CommentBox from '@/components/CommentBox';
import CommentList from '@/components/CommentList';

export default {
  name: 'ArticleDetail',
  components: {
    CommentBox,
    CommentList,
  },
  data() {
    return {
      bannerImage: require('../../../assets/image/default_cover.jpg'),
      articleLoading: false,

      id: null,
      article: null,
      content: '',
      readTime: 0,
      tocExists: false,
      latestArticleList: [],

      commentCurrent: 1,
      commentSize: 10,
      commentSortBy: 'comment_praise_count',
      commentHasMore: true,
      commentObserver: null,
      commentContent: '',
      commentList: [],

    }
  },
  computed: {
    articleLink() {
      return getHostPath(this) + this.$route.path
    }
  },
  created() {
    
  },
  mounted() {
    this.id = parseInt(this.$route.params.id)
    this.getArticleInfo()
    this.getLatestArticle()
    
    this.commentObserver = new IntersectionObserver(entries => {
      if (entries[0].intersectionRatio > 0) {
        this.getCommentList()
      }
    })
  },
  beforeDestroy() {
    tocbot.destroy()
  },
  methods: {
    getLatestArticle() {
      articlePage({
        current: 1, 
        size: 5, 
        sortBy: "article_create_time",
      }).then(res => {
        this.latestArticleList = res.data.records
      }).catch(err => {
        console.log(err);
      })
    },

    getArticleInfo() {
      this.articleLoading = true
      articleInfo({ 
        id: this.id
      }).then(res => {
        if (!res.data) {
          this.$message({
            message: '文章不存在或未公开',
            type: 'error'
          })
          return
        }

        this.article = res.data
        document.title = '文章-' + this.article.title
        if (this.article.coverUrl) {
          this.bannerImage = this.article.coverUrl
        }
        
        this.getContent()

      }).catch(err => {
        console.log(err);
        this.articleLoading = false
      })
    },

    getContent() {
      getArticle(this.article.contentUrl).then(res => {
        this.readTime = Math.round(res.data.length / 400)
        this.content = markdownToHtml(res.data)
        // 在文章内容挂载后，再进行后续dom操作
        this.$nextTick(() => {
          this.commentObserver.observe(this.$refs['commentBottom'])
          this.tocInit()
          this.$prism.highlightAll()
        })
        this.articleLoading = false
        
      }).catch(err => {
        console.log(err);
        this.articleLoading = false
      })
    },

    getCommentList() {
      if (!this.commentHasMore) {
        return
      }
      commentPage({
        current: this.commentCurrent++, 
        size: this.commentSize, 
        sortBy: this.commentSortBy,
        articleId: this.id,
      }).then(res => {
        this.commentList = this.commentList.concat(res.data.records)
        if (res.data.records.length < this.commentSize) {
          this.commentHasMore = false
        }
      }).catch(err => {
        console.log(err);
      })
    },

    tocInit() {
      let nodes = this.$refs['content'].children;
      if (nodes.length) {
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          let reg = /^H[1-4]{1}$/;
          if (reg.exec(node.tagName)) {
            this.tocExists = true
            node.id = i;
          }
        }
      }
      tocbot.init({
        tocSelector: "#toc", 
        contentSelector: "#content", 
        headingSelector: "h1, h2, h3",
        hasInnerContainers: true,
        onClick: function(e) { e.preventDefault() }
      })
    },

    handleArticlePraise(id) {
      if (!hasLogin()) {
        this.$store.commit('SET_LOGIN_VISIBLE', true)
        return
      }

      if (this.article.praiseStatus) {
        articleCancelPraise({ id }).then(res => {
          this.article.praiseStatus = false
          this.article.praiseCount -= 1
          this.$message({
            message: '取消点赞', 
            type: 'success'
          })
        }).catch(err => {
          console.log(err);
        })
      } else {
        articlePraise({ id }).then(res => {
          this.article.praiseStatus = true
          this.article.praiseCount += 1
          this.$message({
            message: '点赞成功', 
            type: 'success'
          })
        }).catch(err => {
          console.log(err);
        })
      }
    },

    addComment() {
      if (!hasLogin()) {
        this.$store.commit('SET_LOGIN_VISIBLE', true)
        return
      }
      if (!this.commentContent.trim().length) {
        this.$message({
          message: '评论内容不能为空',
          type: 'error'
        })
        return
      }

      commentSave({
        content: this.commentContent, 
        articleId: this.id, 
      }).then(res => {
        this.commentList.unshift(res.data)
        this.commentContent = ''
        this.article.commentCount += 1

        this.$message({
          message: '评论成功', 
          type: 'success'
        })
      }).catch(err => {
        console.log(err);
      })
    },

    selectCommentSortBy(value) {
      if (this.commentSortBy === value) {
        return
      }
      this.commentSortBy = value
      this.commentCurrent = 1
      this.commentHasMore = true
      this.commentList = []
      this.getCommentList() 
    },

    navTag(value) {
      this.$router.push({ path: "/article", query: { key: value } })
    },

    navLatestArticle(id) {
      this.$router.push({ path: `/article/${id}` })
    },

  }
}
</script>

<style scoped>
.banner-article-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000080;
}

.article-container {
  font-size: 14px;
}

.article-content {
  font-size: 14px;
  line-height: 1.5;
  overflow-wrap: break-word;
}

.article-content >>> img {
  width: 100%;
}

.article-content >>> a, a:link, a:visited, a:hover, a:active {
  text-decoration: underline;
  color: #409eff;
}

.article-content >>> table {
  margin-top: 0px;
  margin-bottom: 16px;
  border-spacing: 0px;
  border-collapse: collapse;
  font-size: 16px;
}

.article-content >>> table td {
  padding: 6px 13px;
  border: 1px solid rgb(223, 226, 229);
}

.article-content >>> table th {
  padding: 6px 13px;
  border: 1px solid rgb(223, 226, 229);
  font-weight: bold;
}

.article-content >>> table tr {
  background-color: rgb(255, 255, 255);
  border-top: 1px solid rgb(198, 203, 209);
}

.article-content >>> table tr:nth-child(2n) {
  background-color: rgb(246, 248, 250);
}

.latest-article-card:last-child {
  border: none;
}

.qr-code {
  width: 150px;
  height: 150px;
}

#toc >>> .toc-list {
  margin: 0;
  padding: 0;
}

#toc >>> .toc-list-item {
  line-height: 2;
  list-style: none;
  font-size: 14px;
}

#toc >>> .toc-link {
  display: block;
  padding-left: 6px;
  color: #909399 !important;
  transition: all .2s ease-in-out;
}

#toc >>> .is-active-link {
  background: #409eff;
  color: #fff !important;
}

.comment-btn {
  color: #909399;
}

.comment-btn:hover {
  color: #409eff;
}

.comment-btn-selected {
  color: #409eff;
}
</style>