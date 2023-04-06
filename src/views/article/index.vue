<template>
  <div>
    <div class="banner" :style="{ 'background-image': 'url(' + bannerImage + ')' }">
      <div class="animate__animated animate__zoomIn">
        <div class="text-center text-bold margin-bottom-xl " style="font-size: 40px;">文章</div>
        <div>共计{{total}}条数据</div>
      </div> 
    </div>

    <el-card class="article-container animate__animated animate__zoomIn">
      <!-- 搜索栏 -->
      <div class="margin-bottom flex justify-center align-center">
        <el-input 
          v-model="key" 
          suffix-icon="el-icon-search" 
          size="medium"
          placeholder="搜索文章信息"
          @keyup.enter.native="getData()">
        </el-input>
        <div class="margin-lr text-gray text-sl flex justify-center align-center" style="width: 100px;">
          <i class="el-icon-menu   margin-lr-xs" :class="layout == 'detail' ? 'layout-selected' : 'layout'" @click="selectLayout('detail')"></i>
          <i class="el-icon-s-grid margin-lr-xs" :class="layout == 'grid'   ? 'layout-selected' : 'layout'" @click="selectLayout('grid')"  ></i>
        </div>
      </div>
      <!-- 过滤栏 -->
      <div v-if="sortByList.length" class="margin-tb-xs">
        <el-button 
          v-for="(item, index) in sortByList" 
          :key="'sortBy-' + index" 
          :class="sortBy == item.value ? 'article-btn-selected' : 'article-btn'"
          type="text" 
          @click="selectSortBy(item.value)">
          {{ item.name }}
        </el-button>
      </div>
      <div v-if="categoryList.length" class="margin-tb-xs" >
        <el-button 
          :class="categoryId == null ? 'article-btn-selected' : 'article-btn'"
          type="text" 
          @click="selectCategory(null)">
          全部分类
        </el-button>
        <el-button 
          v-for="(item, index) in categoryList" 
          :key="'category-' + index" 
          :class="categoryId == item.id ? 'article-btn-selected' : 'article-btn'"
          type="text" 
          @click="selectCategory(item.id)">
          {{ item.name }}
        </el-button>
      </div>
      <el-divider ></el-divider>
      <!-- 文章 -->
      <el-empty v-if="!list.length" description="没有找到相关信息..."></el-empty>
      <div v-if="layout == 'detail'" v-loading="loading">
        <el-card 
          v-for="(item, index) in list" 
          :key="'article-' + index" 
          class="article-card cursor-pointer animate__animated animate__zoomIn">
          <div 
            class="flex align-center" 
            @click="navArticle(item.id)" >
            <div style="height: 160px; width: 240px;">
              <el-image 
                style="height: 160px; width: 240px;"
                fit="cover" 
                :src="item.coverUrl || require('@/assets/image/default_cover.jpg')" lazy></el-image>
            </div>
            <div style="width: 100%;" class="padding-lr-xl">
              <div class="text-xl">
                <el-tag v-if="item.top" size="mini" type="warning" disable-transitions class="margin-right-xs">置顶</el-tag>
                {{ item.title }}
              </div>
              <div class="margin-tb-sm article-description">{{ item.description }}</div>
              <div class="flex align-center">
                <div class="text-sm text-gray"><i class="el-icon-alarm-clock"></i> {{ item.createTime.slice(0, 10) }}</div>
                <el-divider direction="vertical"></el-divider>
                <div class="text-sm text-gray"><i class="el-icon-view"></i> {{ item.viewCount }}</div>
                <el-divider direction="vertical"></el-divider>
                <div class="text-sm text-gray"><i class="el-icon-star-off"></i> {{ item.praiseCount }}</div>
                <el-divider direction="vertical"></el-divider>
                <div class="text-sm text-gray"><i class="el-icon-collection"></i> {{ item.category.name }}</div>
                <el-divider v-if="item.tagList.length" direction="vertical"></el-divider>
                <div 
                  v-for="(tagItem, tagIndex) in item.tagList.slice(0, 3)" 
                  :key="'article-' + index + '-tag-' + tagIndex"
                  class="text-sm text-gray margin-right-xs">
                  <i class="el-icon-price-tag"></i> {{ tagItem.name }}
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <div v-else v-loading="loading" class="flex flex-wrap justify-between">
        <el-card 
          v-for="(item, index) in list" 
          :key="'article-' + index" 
          class="article-card-grid cursor-pointer animate__animated animate__zoomIn">
          <div 
            class=""
            @click="navArticle(item.id)" >
            <div style="height: 240px; width: 100%;">
              <el-image 
                style="height: 240px; width: 100%;"
                fit="cover" 
                :src="item.coverUrl || require('@/assets/image/default_cover.jpg')" lazy></el-image>
            </div>
            <el-tag 
              v-if="item.top" 
              size="mini" 
              type="warning" 
              disable-transitions 
              style="position: absolute; left: 10px; top: 10px;">置顶</el-tag>
            <div class="padding-sm">
              <div class="text-lg margin-bottom-sm">{{ item.title }}</div>
              <div class="flex justify-between align-center">
                <div class="flex align-center">
                  <div class="text-df text-gray"><i class="el-icon-view"></i> {{ item.viewCount }}</div>
                  <el-divider direction="vertical"></el-divider>
                  <div class="text-df text-gray"><i class="el-icon-star-off"></i> {{ item.praiseCount }}</div>
                  <el-divider direction="vertical"></el-divider>
                  <div class="text-df text-gray"><i class="el-icon-collection"></i> {{ item.category.name }}</div>
                </div>
                
                <div class="text-df text-gray"><i class="el-icon-alarm-clock"></i> {{ item.createTime.slice(0, 10) }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <!-- 分页 -->
      <div class="text-center margin-top">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-sizes="sizeList"
          :page-size="size"
          :current-page="current"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>

    </el-card>
  </div>
</template>

<script>
import PageMixin from '@/mixins/PageMixin.vue'
import { categoryOption } from '@/api/category';
import { articlePage } from '@/api/article';

export default {
  name: 'Article',
  mixins: [PageMixin],
  data() {
    return {
      bannerImage: require('../../assets/image/article.jpg'),
      loading: false,
      layout: 'detail',

      categoryList: [],
      sortByList: [
        {
          value: 'article_create_time',
          name: '最新发布',
        },
        {
          value: 'article_view_count',
          name: '最多点击',
        },
        {
          value: 'article_praise_count',
          name: '最多点赞',
        },
        {
          value: 'article_comment_count',
          name: '最多评论',
        },
      ],

      key: '',
      categoryId: null,
      sortBy: 'article_create_time'

    }
  },
  created() {
    this.key = this.$route.query.key || ''
    this.getCategoryList()
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      articlePage({
        current: this.current, 
        size: this.size, 
        key: this.key, 
        categoryId: this.categoryId, 
        sortBy: this.sortBy,
      }).then(res => {
        this.setPage(res.data)
        this.loading = false
      }).catch(err => {
        console.log(err);
        this.loading = false
      })
    },

    getCategoryList() {
      categoryOption().then(res => {
        this.categoryList = res.data
      }).catch(err => {
        console.log(err);
      })
    },

    selectCategory(id) {
      this.categoryId = id
      this.getData()
    },

    selectSortBy(value) {
      this.sortBy = value
      this.getData()
    },

    selectLayout(value) {
      this.layout = value
    },

    navArticle(id) {
      this.$router.push({ path: `/article/${id}` })
    },
  }
}
</script>

<style scoped>
.article-container {
  margin: 20px auto;
  width: 80%;
  max-width: 1200px;
  font-size: 14px;
}

.layout {
  cursor: pointer;
  transition: all 0.2s linear;
}

.layout:hover {
  color: #409eff;
}

.layout-selected {
  color: #409eff;
  cursor: pointer;
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
  min-height: 50px;
  font-size: 14px;
  line-height: 1.8;
  word-break: break-all;
  overflow:hidden; 
  text-overflow:ellipsis;
  display:-webkit-box;    
  -webkit-box-orient:vertical; 
  -webkit-line-clamp:2; 
}

.article-card-grid {
  margin: 10px 0;
  width: 49%;
}
.article-card-grid >>> .el-card__body {
  padding: 0;
}

.article-btn {
  padding: 5px 10px;
  color: #909399;
}

.article-btn:hover {
  color: #409eff;
}

.article-btn-selected {
  padding: 5px 10px;
  color: white;
  background-color: #409eff;
}


</style>