import request from "./request.js";

const commentPage = ({ current, size, articleId, parentId, sortBy = "comment_create_time" }) => {
  return request({
    url: `/comment/page`,
    method: 'get',
    params: { current, size, articleId, parentId, sortBy }
  })
}

const commentSave = ({ content, articleId, parentId, replyUserId }) => {
  return request({
    url: `/comment/save`,
    method: 'post',
    data: { content, articleId, parentId, replyUserId }
  })
}

const commentPraise = ({ id }) => {
  return request({
    url: `/comment/praise/${id}`,
    method: 'post',
  })
}

const commentCancelPraise = ({ id }) => {
  return request({
    url: `/comment/cancel_praise/${id}`,
    method: 'post',
  })
}

const commentRemove = ({ id }) => {
  return request({
    url: `/comment/remove/${id}`,
    method: 'post',
  })
}

export {
  commentPage,
  commentSave,
  commentPraise,
  commentCancelPraise,
  commentRemove,

}