import request from '@/utils/request'

export const getArticles = (params: any) =>
  request({
    url: '/logging/list',
    method: 'post',
    //params
  })
