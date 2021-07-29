import request from '@/utils/request'

export const getLogging = (params: any) =>
  request({
    url: '/logging/list',
    method: 'post',
    params
  })
