import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/web/deliveryUserProduct/list',
    method: 'post',
    data:params
  })
}

export function getUserList(params) {
  return request({
    url: '/web/user/list',
    method: 'post',
    data:params
  })
}

export function addProductDelivery(params) {
  return request({
    url: '/web/deliveryUserProduct/add',
    method: 'post',
    data:params
  })
}