import Mock from "mockjs";

const Random = Mock.Random

let responseResult = {
  code: 0,
  msg: 'success',
  data: {}
}

// Mock.mock(`${settings.domain}/api/user/login`, 'post', () => {
//   responseResult.data['token'] = Random.string(32)
//   return responseResult
// })
