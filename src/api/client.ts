import request from '@/utils/request'

export const getclient = (params: any) =>
  request({
    url: '/client/list',
    method: 'post',
    params
  })

export const addclient = (data: any) =>
  request({
    url: '/client/add',
    method: 'post',
    data
  })

export const deleteclient = (data: any) =>
  request({
    url: '/client/delete',
    method: 'post',
    data
  })

export const updateclient = (data: any) =>
  request({
    url: '/client/update',
    method: 'post',
    data
  })

export const getclientdashboard = () =>
  request({
    url: '/client/dashboard',
    method: 'post'
  })

export const oneclickset = () =>
  request({
    url: '/client/oneclickset',
    method: 'post'
  })

export const oneclickdel = () =>
  request({
    url: '/client/oneclickdel',
    method: 'post'
  })
