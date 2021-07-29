import request from '@/utils/request'

export const getdevice = (params: any) =>
  request({
    url: '/device/list',
    method: 'post',
    params
  })

export const adddevice = (params: any) =>
  request({
    url: '/device/add',
    method: 'post',
    params
  })
