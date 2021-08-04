import request from '@/utils/request'

export const getdevice = (params: any) =>
  request({
    url: '/device/list',
    method: 'post',
    params
  })

export const adddevice = (data: any) =>
  request({
    url: '/device/add',
    method: 'post',
    data
  })

export const deletedevice = (data: any) =>
  request({
    url: '/device/delete',
    method: 'post',
    data
  })

export const updatedevice = (data: any) =>
  request({
    url: '/device/update',
    method: 'post',
    data
  })
