import request from "./request.js";

const categoryOption = () => {
  return request({
    url: `/category/option`,
    method: 'get',
  })
}

export {
  categoryOption,

}