import request from "./request.js";

const articleStatistic = () => {
  return request({
    url: `/article/statistic`,
    method: 'get',
  })
}

const articlePage = ({ current, size, key, categoryId, sortBy = "article_create_time" }) => {
  return request({
    url: `/article/page`,
    method: 'get',
    params: { current, size, key, categoryId, sortBy }
  })
}

const articleInfo = ({ id }) => {
  return request({
    url: `/article/${id}`,
    method: 'get',
  })
}

const articlePraise = ({ id }) => {
  return request({
    url: `/article/praise/${id}`,
    method: 'post',
  })
}
const articleCancelPraise = ({ id }) => {
  return request({
    url: `/article/cancel_praise/${id}`,
    method: 'post',
  })
}

export {
  articleStatistic,
  articlePage,
  articleInfo,
  articlePraise,
  articleCancelPraise,  
}