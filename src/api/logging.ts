import request from '@/utils/request'

export const getLogging = (params: any, data: any) =>
  request({
    url: '/logging/list',
    method: 'post',
    params,
    data
  })
