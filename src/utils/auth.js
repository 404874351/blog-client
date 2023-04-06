import Cookies from "js-cookie";
import store from '@/store/index.js'

/**
 * 清除token
 */
const clearToken = () => {
  Cookies.remove('token')
}

/**
 * 获取token
 * @returns token
 */
const getToken = () => {
  return Cookies.get('token')
}

/**
 * 设置token
 * @param {String} token 用户登录凭证
 */
const setToken = (token) => {
  Cookies.set('token', token)
}

/**
 * 清除登录态
 */
const clearLoginStatus = () => {
  store.commit('DEL_USER_INFO')
  Cookies.remove('token')
}

/**
 * 获取登录态
 * @returns {Object} { userInfo }
 */
const getLoginStatus = () => {
  return {
    userInfo: store.state.userInfo,
  }
}

/**
 * 设置登录态
 * @param {Object} userInfo 用户信息
 */
 const setLoginStatus = (userInfo) => {
  store.commit('SET_USER_INFO', userInfo)
}

/**
 * 判断是否登录
 */
 const hasLogin = () => {
  return store.state.userInfo !== null
}



export {
  clearToken,
  getToken,
  setToken,

  clearLoginStatus,
  getLoginStatus,
  setLoginStatus,
  hasLogin,
}