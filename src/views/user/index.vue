<template>
  <div>
    <div class="banner" :style="{ 'background-image': 'url(' + bannerImage + ')' }">
      <div class="text-center text-bold margin-bottom-xl animate__animated animate__zoomIn" style="font-size: 40px;">个人中心</div>
    </div>

    <el-card class="user-card animate__animated animate__zoomIn">
      <el-tabs >
        <el-tab-pane label="个人信息" >
          <div>
            <el-form ref="infoForm" :rules="formRules" :model="infoForm" label-width="80px" style="width: 500px; margin-left: 10%;">
              <el-form-item v-show="true" label="头像" prop="avatarUrl">
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :limit="1"
                  :show-file-list="false"
                  :on-error="avatarUpload">
                  <div slot="tip" class="text-gray text-sm">支持jpg, png格式，文件大小不超过3MB，推荐方形或圆形图片。</div>

                  <img v-if="infoForm.avatarUrl" :src="infoForm.avatarUrl" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  
                  <div v-if="uploadLoading" class="avatar-loading">
                    <div>
                      <div style="position: relative; top:  10px; "><i class="el-icon-loading text-xl"></i></div>
                      <div style="position: relative; top: -10px; ">{{ uploadPercent }} %</div>
                    </div>
                  </div>
                  
                </el-upload>
              </el-form-item>
              <el-form-item label="昵称" prop="nickname">
                <el-input size="medium" v-model="infoForm.nickname" placeholder="请输入" clearable></el-input>
              </el-form-item>

              <el-form-item>
                <el-button size="medium" type="primary" icon="el-icon-edit" @click="infoUpdate" :loading="updateLoading">修改</el-button>
              </el-form-item>
            </el-form>

          </div>
        </el-tab-pane>

        <el-tab-pane label="修改密码" >
          <div>
            <el-form ref="passwordForm" :rules="formRules" :model="passwordForm" label-width="80px" style="width: 500px; margin-left: 10%;">
              <el-form-item v-show="true" label="原密码" prop="password">
                <el-input size="medium" v-model="passwordForm.password" placeholder="请输入" clearable show-password></el-input>
              </el-form-item>
              <el-form-item v-show="true" label="新密码" prop="newPassword">
                <el-input size="medium" v-model="passwordForm.newPassword" placeholder="请输入" clearable show-password></el-input>
              </el-form-item>
              <el-form-item v-show="true" label="确认密码" prop="repeatPassword">
                <el-input size="medium" v-model="passwordForm.repeatPassword" placeholder="请输入" clearable show-password></el-input>
              </el-form-item>

              <el-form-item>
                <el-button size="medium" type="primary" icon="el-icon-edit" @click="passwordUpdate" :loading="updateLoading">修改</el-button>
              </el-form-item>
            </el-form>

          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { userUpdate, updatePassword } from "@/api/user.js";
import { getToken, uploadAvatar } from "@/api/qiniu.js";
import { qiniu_domain } from "@/config/index.js";
import { hasLogin } from '@/utils/auth';

export default {
  name: 'User',
  data() {
    return {
      bannerImage: require('../../assets/image/user.jpg'),

      updateLoading: false,

      infoForm: {
        avatarUrl: '',
        nickname: '',
      },

      passwordForm: {
        password: '',
        newPassword: '',
        repeatPassword: '',
      },

      formRules: {
        nickname: [
          {
            required: true,
            message: "昵称不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "原密码不能为空",
            trigger: "blur",
          },
        ],
        newPassword: [
          {
            required: true,
            message: "新密码不能为空",
            trigger: "blur",
          },
          {
            min: 8,
            max: 18,
            message: "密码长度为8-18位",
            trigger: "blur",
          },
          {
            pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$_&*+-])[0-9a-zA-Z!@#$_&*+-]{8,18}$/,
            message: "密码必须包含数字、字母和特殊字符!@#$_&*+-",
            trigger: "blur",
          },
        ],
        repeatPassword: [
          { 
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('确认密码不能为空'))
                return
              } 
              if (value !== this.passwordForm.newPassword) {
                callback(new Error('两次输入密码不相同'))
              }
              callback()
            }, 
            trigger: 'blur' 
          }
        ],
      },

      uploadLoading: false,
      uploadPercent: 0,
      observer: {
        next: (res) => {;
          this.uploadPercent = Math.floor(res.total.percent)
        },
        error: (err) => {
          this.uploadLoading = false
          this.$message({
            showClose: true,
            message: "文件上传错误",
            type: 'error'
          });
        },
        complete: (res) => {
          this.uploadLoading = false
          this.infoForm.avatarUrl = qiniu_domain + "/" + res.key
        }
      }
    
    }
  },
  created() {
    if (!hasLogin()) {
      this.$message({
        message: '请先登录', 
        type: 'error'
      })
      this.$router.push({ path: '/' })
      return
    }
    
    this.infoForm.nickname = this.$store.state.userInfo.nickname
    this.infoForm.avatarUrl = this.$store.state.userInfo.avatarUrl
    
  },
  methods: {
    async avatarUpload(err, file, fileList) {
      this.uploadPercent = 0
      this.uploadLoading = true
      try {
        // 获取上传token
        let tokenRes = await getToken({})
        // 开始上传，后续操作参见observer
        uploadAvatar({
          file: file.raw,
          token: tokenRes.data,
          observer: this.observer
        })
      } catch (err) {
        console.log(err);
        this.uploadLoading = false
      }  
    },

    infoUpdate() {
      this.$refs["infoForm"].validate((isValid) => {
        if (!isValid) {
          return false
        }
        this.updateLoading = true
        userUpdate(this.infoForm).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.updateLoading = false
          // 更新全局状态
          let newUserInfo = Object.assign(this.$store.state.userInfo, this.infoForm)
          this.$store.commit("SET_USER_INFO", newUserInfo)
        }).catch(err => {
          this.updateLoading = false
          console.log(err);
        })
      })
    },

    passwordUpdate() {
      this.$refs["passwordForm"].validate((isValid) => {
        if (!isValid) {
          return false
        }
        this.updateLoading = true
        updatePassword(this.passwordForm).then(res => {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.updateLoading = false

        }).catch(err => {
          this.updateLoading = false
          console.log(err);
        })
      })
    },
  }
}
</script>

<style scoped>
.user-card {
  margin: 20px auto;
  width: 80%;
  max-width: 1200px;
  font-size: 14px;
}

.avatar-uploader >>> .el-upload {
  transition: border 0.5s linear;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader >>> .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
}

.avatar-loading {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffffb0;

}
</style>