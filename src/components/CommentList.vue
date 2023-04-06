<template>
  <div>
    <div 
      v-for="(item, index) in list" 
      :key="'comment-' + index"
      class="flex padding-lr padding-tb-xs" >
      <div style="height: 40px; width: 40px;">
        <el-image
          style="height: 40px; width: 40px; border-radius: 999px;"
          fit="cover" 
          :src="item.user.avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'">
        </el-image>
      </div>
      <div 
        style="width: 100%;"
        class="margin-left padding-bottom border-bottom-solid">
        <div class="margin-tb-xs text-blue">{{ item.user.nickname }}</div>
        <div class="comment-content" >{{ item.content }}</div>
        <div class="flex text-gray text-sm">
          <div class="margin-right">{{ item.createTime }}</div>
          <div class="margin-right cursor-pointer" @click="handleCommentPraise(item)"><i :class="item.praiseStatus ? 'el-icon-star-on' : 'el-icon-star-off'"  ></i> {{ item.praiseCount }}</div>
          <div class="margin-right comment-reply-btn" @click="selectReplyItem(item)">回复</div> 

          <el-dropdown 
            v-if="$store.state.userInfo && item.user.id == $store.state.userInfo.id" 
            size="small" >
            <div class="text-gray text-sm margin-right cursor-pointer" ><i class="el-icon-more"></i></div>

            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="deleteComment(item, index, list)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div v-if="item.children && item.children.length">
          <div 
            v-for="(childrenItem, childrenIndex) in item.children" 
            :key="'comment-' + index + '-children-' + childrenIndex"
            class="flex padding-lr padding-tb-xs">
            <div style="height: 30px; width: 30px;">
              <el-image
                style="height: 30px; width: 30px; border-radius: 999px;"
                fit="cover" 
                :src="childrenItem.user.avatarUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'">
              </el-image>
            </div>
            <div 
              style="width: 100%;"
              class="margin-left padding-bottom">
              <div class="comment-content">
                <span class="margin-right-sm text-blue">{{ childrenItem.user.nickname }} </span>
                <span v-if="childrenItem.replyUser.id != item.user.id">回复 @{{ childrenItem.replyUser.nickname }} : </span>
                <span>{{ childrenItem.content }}</span>
              </div>
              <div class="flex text-gray text-sm">
                <div class="margin-right">{{ childrenItem.createTime }}</div>
                <div class="margin-right cursor-pointer" @click="handleCommentPraise(childrenItem)"><i :class="childrenItem.praiseStatus ? 'el-icon-star-on' : 'el-icon-star-off'"  ></i> {{ childrenItem.praiseCount }}</div>
                <div class="margin-right comment-reply-btn" @click="selectChildrenReplyItem(item, childrenItem.user)">回复</div>
                <el-dropdown 
                  v-if="$store.state.userInfo && childrenItem.user.id == $store.state.userInfo.id" 
                  size="small" >
                  <div class="text-gray text-sm margin-right cursor-pointer" ><i class="el-icon-more"></i></div>

                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="deleteComment(childrenItem, childrenIndex, item.children)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> 
              </div>
            </div>
          </div>
          <div v-if="item.childrenCount > 3 && !item.childrenCurrent" class="text-gray text-sm">
            <span>共{{ item.childrenCount }}条回复，</span>
            <span class="comment-reply-btn" @click="selectChildrenCurrent(1, item)">点击查看</span>
          </div>
          <div v-if="item.childrenCurrent">
            <el-pagination
              hide-on-single-page
              small
              layout="total, prev, pager, next"
              :page-size="10"
              :current-page="item.childrenCurrent"
              :total="item.childrenCount"
              @current-change="selectChildrenCurrent($event, item)">
            </el-pagination>
          </div>
        </div>

        <CommentBox 
          v-if="item.selected"
          class="margin-top" 
          v-model="commentContent" 
          :placeholder="'回复 @' + replyUser.nickname + ': '" >
          <template slot="footer">
            <el-button type="primary" size="medium" @click="replyComment">发布</el-button>
          </template>
        </CommentBox>
        
      </div>
    </div>
  </div>
</template>

<script>
import { commentPage, commentSave, commentPraise, commentCancelPraise, commentRemove } from '@/api/comment.js';
import { hasLogin } from '@/utils/auth.js';

import CommentBox from '@/components/CommentBox';
// import { Emoji } from 'emoji-mart-vue'
// import { emojiMap, emojiPattern } from '@/assets/js/data';

export default {
  name: "CommentList",
  components: {
    CommentBox,
    // Emoji,
  },
  props: {
    list: Array,
    articleId: Number,
  },
  data() {
    return {
      commentContent: '',
      replyItem: null,
      replyUser: null,
    }
  },
  created() {
  },
  methods: {
    selectChildrenCurrent(current, item) {
      item.childrenCurrent = current
      this.getChildrenCommentPage(item)
    },

    getChildrenCommentPage(item) {
      commentPage({
        current: item.childrenCurrent || 1, 
        size: 10, 
        articleId: this.articleId,
        parentId: item.id,
      }).then(res => {
        item.children = res.data.records
      }).catch(err => {
        console.log(err);
      })
    },

    handleCommentPraise(item) {
      if (!hasLogin()) {
        this.$store.commit('SET_LOGIN_VISIBLE', true)
        return
      }

      if (item.praiseStatus) {
        commentCancelPraise({
          id: item.id
        }).then(res => {
          item.praiseStatus = false
          item.praiseCount -= 1
          this.$message({
            message: '取消点赞', 
            type: 'success'
          })
        }).catch(err => {
          console.log(err);
        })
      } else {
        commentPraise({
          id: item.id
        }).then(res => {
          item.praiseStatus = true
          item.praiseCount += 1
          this.$message({
            message: '点赞成功', 
            type: 'success'
          })
        }).catch(err => {
          console.log(err);
        })
      }


    },

    selectReplyItem(item) {
      if (this.replyItem) {
        this.$set(this.replyItem, 'selected', false)
        if (this.replyItem == item) {
          this.replyItem = null
          this.replyUser = null
          return
        }
      }
      this.replyItem = item
      this.$set(this.replyItem, 'selected', true)
      this.replyUser = item.user
    },

    selectChildrenReplyItem(item, replyUser) {
      if (this.replyItem) {
        this.$set(this.replyItem, 'selected', false)
        if (this.replyItem == item && this.replyUser == replyUser) {
          this.replyItem = null
          this.replyUser = null
          return
        }
      }
      this.replyItem = item
      this.$set(this.replyItem, 'selected', true)
      this.replyUser = replyUser
    },

    replyComment() { 
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
        articleId: this.articleId, 
        parentId: this.replyItem.id, 
        replyUserId: this.replyUser.id,
      }).then(res => {
        if (this.replyItem.children == null) {
          this.replyItem.children = []
        }
        this.replyItem.children.push(res.data)
        this.$set(this.replyItem, 'selected', false)
        this.commentContent = ''
        this.replyItem = null
        this.replyUser = null

        this.$message({
          message: '回复成功', 
          type: 'success'
        })
      }).catch(err => {
        console.log(err);
      })
    },

    deleteComment(item, index, list) {
      // console.log(item, index, list);
      this.$confirm('即将删除该评论及其所有回复，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        commentRemove({
          id: item.id
        }).then(res => {
          list.splice(index, 1)
          
          this.$message({
            message: '删除成功', 
            type: 'success'
          })
        }).catch(err => {
          console.log(err);
        })
      }).catch(() => {})
    },

    // renderComment(content) {
    //   return content.replace(emojiPattern, (str) => {
    //     return `<Emoji emoji="${emojiMap[str].colons.slice(1, -1)}" :size="20" />`
    //   })
    // },

  }
}
</script>

<style scoped>
.comment-content {
  line-height: 1.8;
  margin-bottom: 5px;
}

.comment-reply-btn {
  cursor: pointer;
}
.comment-reply-btn:hover {
  color: #409eff;
}

.action-popover {
  min-width: none;
}

.action-popover >>> .el-popover{
  min-width: none;
}
</style>