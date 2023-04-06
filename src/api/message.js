import request from "./request.js";

const messageCount = () => {
  return request({
    url: `/message/count`,
    method: 'get',
  })
}

const messagePage = ({ current, size }) => {
  return request({
    url: `/message/page`,
    method: 'get',
    params: { current, size }
  })
}

const messageSave = ({ content }) => {
  return request({
    url: `/message/save`,
    method: 'post',
    data: { content }
  })
}



export {
  messageCount,
  messagePage,
  messageSave,

}