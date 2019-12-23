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

export function deleteById(id) {
  return request({
    url: '/web/deliveryUserProduct/deleteById?id=' + id,
    method: 'post'
  })
}

export function listDayTotalByUserIdAndDate(params) {
  return request({
    url: '/web/data/listDayTotalByUserIdAndDate',
    method: 'post',
    data:params
  })
}

export function saveDelivery(params) {
  return request({
    url: '/web/deliveryUserProduct/saveDelivery',
    method: 'post',
    data:params
  })
}

export function isSaveDelivery(params) {
  return request({
    url: '/web/deliveryUserProduct/isSaveDelivery',
    method: 'post',
    data:params
  })
}