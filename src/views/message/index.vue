<template>
  <div style="position: relative;">
    <div class="banner" style="height: 100vh;" :style="{ 'background-image': 'url(' + bannerImage + ')' }">
      <div class="animate__animated animate__zoomIn" style="z-index: 9999;">
        <div class="text-center text-bold margin-bottom-xl" style="font-size: 40px;">留言墙</div>
        <div class="message-input">
          <el-input 
            style="width: 300px;" 
            v-model="content" 
            prefix-icon="el-icon-edit" 
            placeholder="留下你的足迹..."
            @keyup.enter.native="messageSubmit"></el-input>
        </div>
      </div>
    </div>
    <!-- 弹幕区域 -->
    <div class="barrage-container">
      <vue-baberrage 
        :isShow="true"
        :maxWordCount="60"
        :throttleGap="2000"
        :loop="true"
        :barrageList="barrageList" >
      </vue-baberrage>
    </div>
  </div>
</template>

<script>
import { messagePage, messageSave } from '@/api/message.js';
import { getLoginStatus } from '../../utils/auth';

export default {
  name: 'Message',
  data() {
    return {
      bannerImage: require('../../assets/image/message.jpg'),

      content: '',
      
      timer: null,
      current: 1,
      size: 1,

      barrageList: []
    }
  },

  mounted() {
    this.timer = setInterval(() => {
      this.messagePush()
    }, 3000);
    
  },
  
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  methods: {
    messageSubmit() {
      if (!this.content.trim().length) {
        this.$message({
          message: '留言内容不能为空',
          type: 'error'
        });
        return
      }

      messageSave({ 
        content: this.content 
      }).then(res => {
        let userInfo = getLoginStatus().userInfo
        this.barrageList.push({
          avatar: userInfo && userInfo.avatarUrl ? userInfo.avatarUrl : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
          msg: '最新: ' + this.content,
          time: Math.random() * 9 + 5,
          barrageStyle: 'normal'
        })
        this.content = ''

        this.$message({
          message: '留言成功',
          type: 'success'
        });

      }).catch(err => {
        console.log(err);
      })
    },

    messagePush() {
      messagePage({ 
        current: this.current++,
        size: this.size, 
      }).then(res => {
        if (this.current > res.data.pages) {
          clearInterval(this.timer)
        }

        let messageList = res.data.records.map(item => {
          return {
            id: item.id,
            avatar: item.user && item.user.avatarUrl ? item.user.avatarUrl : 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
            msg: (item.user ? item.user.nickname : "游客") + ": " + item.content,
            time: Math.random() * 9 + 5,
            barrageStyle: 'normal'
          }
        })
        this.barrageList = this.barrageList.concat(messageList)

      }).catch(err => {
        console.log(err);
      })
    },
  }
}
</script>

<style scoped>
.message-input >>> input {
  color: white;
  background-color: #00000020;
}

.message-input >>> .el-input__icon {
  color: white;
}

.barrage-container {
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100vh - 60px);
  width: 100%;
}
</style>