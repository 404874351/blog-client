<template>
  <el-dialog 
    style="z-index: 99999; min-width: 300px;"
    width="30%"
    :title="modeList[modeIndex].title" 
    :visible.sync="$store.state.loginVisible"
    center 
    destroy-on-close>
    <!-- 登录表单 -->
    <div v-show="modeIndex == 0">
      <el-form ref="loginForm" :model="loginForm" :rules="loginFormRules" >
        <el-form-item prop="username" class="form-item">
          <el-input 
            prefix-icon="el-icon-user" 
            placeholder="手机号/用户名" 
            v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" class="form-item">
          <el-input 
            prefix-icon="el-icon-lock" 
            placeholder="密码" 
            v-model="loginForm.password" 
            type="password" 
            @keyup.enter.native="submitForm('loginForm')"></el-input>
        </el-form-item>
  
        <div class="text-center">
          <el-button 
            type="primary" 
            style="width: 100%;" 
            :loading="loading" 
            @click="submitForm('loginForm')">登录</el-button>
        </div>
        <div class="flex justify-between">
          <div class="margin-top-xs cursor-pointer" @click="modeIndex = 2">立即注册</div>
          <div class="margin-top-xs cursor-pointer" @click="modeIndex = 1">短信验证码登录</div>
        </div>
        
      </el-form>
    </div>
    <!-- 验证码登录表单 -->
    <div v-show="modeIndex == 1">
      <el-form ref="authCodeLoginForm" :model="authCodeLoginForm" :rules="authCodeLoginFormRules" >
        <el-form-item prop="username" class="form-item">
          <el-input 
            prefix-icon="el-icon-phone-outline" 
            placeholder="手机号" 
            v-model="authCodeLoginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="code" class="form-item">
          <el-input 
            prefix-icon="el-icon-chat-dot-round" 
            placeholder="短信验证码" 
            v-model="authCodeLoginForm.code" 
            @keyup.enter.native="submitForm('authCodeLoginForm')"></el-input>
            <el-button 
            type="text"  
            @click="sendAuthCode(authCodeLoginForm.username)" 
            :loading="auchCodeLoading"
            :disabled="countdown > 0"
            style="position: absolute; right: 10px; top: 0;">{{!countdown ? '获取验证码' : `已发送 ${countdown}s`}}</el-button>
        </el-form-item>
  
        <div class="text-center">
          <el-button 
            type="primary" 
            style="width: 100%;" 
            :loading="loading" 
            @click="submitForm('authCodeLoginForm')">登录</el-button>
        </div>
        <div class="flex justify-between">
          <div class="margin-top-xs cursor-pointer" @click="modeIndex = 2">立即注册</div>
          <div class="margin-top-xs cursor-pointer" @click="modeIndex = 0">密码登录</div>
        </div>
      </el-form>
    </div>
    <!-- 注册表单 -->
    <div v-show="modeIndex == 2">
      <el-form ref="registerForm" :model="registerForm" :rules="registerFormRules" >
        <el-form-item prop="phone" >
          <el-input 
            prefix-icon="el-icon-user" 
            placeholder="11位手机号" 
            v-model="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="code" >
          <el-input 
            prefix-icon="el-icon-chat-dot-round" 
            placeholder="短信验证码" 
            v-model="registerForm.code"></el-input>
          <el-button 
            type="text"  
            @click="sendAuthCode(registerForm.phone)" 
            :loading="auchCodeLoading"
            :disabled="countdown > 0"
            style="position: absolute; right: 10px; top: 0;">{{!countdown ? '获取验证码' : `已发送 ${countdown}s`}}</el-button>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            prefix-icon="el-icon-lock" 
            placeholder="密码" 
            v-model="registerForm.password" 
            type="password"></el-input>
        </el-form-item>
        <el-form-item prop="repeatPassword">
          <el-input 
            prefix-icon="el-icon-finished" 
            placeholder="确认密码" 
            v-model="registerForm.repeatPassword" 
            type="password" ></el-input>
        </el-form-item>
  
        <div class="text-center">
          <el-button 
            type="success" 
            style="width: 100%;" 
            :loading="loading" 
            @click="submitForm('registerForm')">注册</el-button>
        </div>
        <div class="margin-top-xs cursor-pointer" @click="modeIndex = 0">已有账号？立即登录</div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { login, authCodeLogin, authCode, register, userInfo } from '@/api/user';
import { setToken, setLoginStatus } from '@/utils/auth';

export default {
  name: "LoginDialog",
  data() {
    return {
      loading: false,
      auchCodeLoading: false,

      countdown: 0, 

      modeList: [
        {
          title: '登录',
        },
        {
          title: '验证码登录',
        },
        {
          title: '注册',
        },
      ],
      modeIndex: 0,

      loginForm: {
        username: "",
        password: "",
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
        ],
      },

      authCodeLoginForm: {
        username: "",
        code: "",
      },
      authCodeLoginFormRules: {
        username: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur",
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入合法手机号",
            trigger: "blur",
          },
        ],
        code: [
          { 
            required: true,
            message: "验证码不能为空",
            trigger: "blur",
          },
        ],
      },

      registerForm: {
        phone: "", 
        code: "",
        password: "",
        repeatPassword: "",
      },
      registerFormRules: {
        phone: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur",
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入合法手机号",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
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
              if (value !== this.registerForm.password) {
                callback(new Error('两次输入密码不相同'))
              }
              callback()
            }, 
            trigger: 'blur' 
          }
        ],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((isValid) => {
        if (!isValid) {
          return false
        }

        if (this.modeIndex == 0) {
          this.userLogin()
          return
        }
        if (this.modeIndex == 1) {
          this.userAuthCodeLogin()
          return
        }
        if (this.modeIndex == 2) {
          this.userRegister()
          return
        }
        
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    async userLogin() {
      try {
        this.loading = true
        // 用户登录，并获取token
        let loginRes = await login({
          username: this.loginForm.username,
          password: this.loginForm.password,
        })
        setToken(loginRes.data.token)

        // 获取用户信息和用户菜单
        let userInfoRes = await userInfo()
        setLoginStatus(userInfoRes.data)

        // 登录完毕，隐藏登录框
        this.$store.commit('SET_LOGIN_VISIBLE', false)
        this.loading = false
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false
      }
    },

    async userAuthCodeLogin() {
      try {
        this.loading = true
        // 用户登录，并获取token
        let loginRes = await authCodeLogin({
          username: this.authCodeLoginForm.username,
          code: this.authCodeLoginForm.code,
        })
        setToken(loginRes.data.token)

        // 获取用户信息和用户菜单
        let userInfoRes = await userInfo()
        setLoginStatus(userInfoRes.data)

        // 登录完毕，隐藏登录框
        this.$store.commit('SET_LOGIN_VISIBLE', false)
        this.loading = false
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false
      }
    },

    sendAuthCode(phone) {
      if (!phone.trim().length) {
        this.$message({
          message: '手机号不能为空',
          type: 'error'
        })
        return
      }

      this.auchCodeLoading = true
      authCode({
        phone
      }).then(res => {
        this.auchCodeLoading = false
        this.countdown = 60
        const timer = setInterval(() => {
          this.countdown--
          if (this.countdown == 0) {
            clearInterval(timer)
          }
        }, 1000)

        this.$message({
          message: '验证码已发送',
          type: 'success'
        })
      }).catch(err => {
        this.auchCodeLoading = false
        console.log(err);
      })
    },

    userRegister() {
      this.loading = true
      register({
        nickname: "用户" + this.registerForm.phone, 
        phone: this.registerForm.phone,
        password: this.registerForm.password,
        code: this.registerForm.code,
      }).then(res => {
        this.modeIndex = 0
        this.loading = false
        this.$message({
          message: '注册成功，请返回登录',
          type: 'success'
        })
        
      }).catch(err => {
        this.loading = false
        console.log(err);
      })
    },


  },
}
</script>

<style scoped>
.form-item {
  margin-bottom: 40px;
}
</style>