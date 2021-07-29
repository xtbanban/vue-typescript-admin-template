import request from '@/utils/request'

export const getclient = (params: any) =>
  request({
    url: '/client/list',
    method: 'post',
    params
  })
