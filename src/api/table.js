import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'web/user/list',
    method: 'post',
    data: params
  })
}


export function addUser(params) {
  return request({
    url: 'web/user/add',
    method: 'post',
    data: params
  })
}

