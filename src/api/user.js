import request from "./request.js";

const login = ({ username, password }) => {
  return request({
    url: `/login`,
    method: 'post',
    data: { username, password }
  })
}

const authCodeLogin = ({ username, code }) => {
  return request({
    url: `/login/code`,
    method: 'post',
    data: { username, code }
  })
}

const logout = () => {
  return request({
    url: `/logout`,
    method: 'post',
  })
}

const register = ({ nickname, phone, password, code }) => {
  return request({
    url: `/user/register`,
    method: 'post',
    data: { nickname, phone, password, code }
  })
}

const authCode = ({ phone }) => {
  return request({
    url: `/user/code`,
    method: 'post',
    data: { phone }
  })
}

const userInfo = () => {
  return request({
    url: `/user/info`,
    method: 'get',
  })
}

const userUpdate = ({ nickname, avatarUrl }) => {
  return request({
    url: `/user/update`,
    method: 'post',
    data: { nickname, avatarUrl }
  })
}

const updatePassword = ({ password, newPassword }) => {
  return request({
    url: `/user/password`,
    method: 'post',
    data: { password, newPassword }
  })
}

export {
  login,
  authCodeLogin,
  logout,

  register,
  authCode,
  
  userInfo,
  userUpdate,
  updatePassword,
  
}