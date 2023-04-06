import router from '@/router/index.js'

/**
 * 获取主机地址
 */
const getHostPath = (page) => {
  // 获取当前页面地址
  let wPath = document.location.href;
  // 获取当前页面主机地址之后的目录，如：/admin/index
  let pos = wPath.lastIndexOf(page.$route.path);
  // 获取主机地址，如：http://localhost:8080
  let localhostPath = wPath.substring(0, pos);
  return localhostPath
}

/**
 * 过滤查询参数，将""和null删除
 * @param {Object} params 请求参数
 * @returns 过滤后参数
 */
const filterQueryParams = (params) => {
  let newParams = Object.assign({}, params)
  Object.keys(newParams).forEach(key => {
    if (newParams[key] === null || newParams[key] === "") {
      delete newParams[key]
    }
  })
  return newParams
}

/**
 * 获取uuid
 * @returns uuid
 */
const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  })
}


export {
  getHostPath,
  filterQueryParams,
  uuid,
};
